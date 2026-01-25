# Billing, Promotions & Wallet System (Backend)

This repository contains the backend architecture for a **credit-based AI platform** with full support for:

- Multi payment gateways
- Promotion & coupon engine
- Refund processing
- Wallet (credits) with financial audit
- Webhook idempotency
- Email idempotency (Kafka-ready)

This is designed as **production-grade financial infrastructure**, not just a checkout API.

---

## Features

### Plans & Credit Wallet
Users purchase plans that add credits to their wallet.

- Each plan gives fixed credits
- Wallet balance is cached on user table
- Ledger is source of truth

---

### Multi Payment Gateway

Supported gateways:
- Razorpay
- Stripe
- PayPal

Each order and payment stores:
- gateway type
- gateway order id
- gateway payment id

System is extensible for future gateways.

---

### Promotion Engine

Supports:

| Type | Description |
|--------|------------|
| AUTO | Auto applied discounts |
| COUPON | Requires coupon code |
| TARGETED | Specific users |
| LOYALTY | Based on user history |

Each promotion has:

- **Rules** - Who can apply
- **Effects** - What benefit is given
- **Priority** - Order of evaluation
- **Stacking rules** - Whether it can combine

---

### Coupon Reservation System (Anti Abuse)

When user starts checkout:

- Coupon is **RESERVED**
- Prevents multiple users from consuming limited coupons

After payment:

- Marked as **CONSUMED**

If payment fails or expires:

- Marked as **RELEASED**

This prevents race conditions and abuse.

---

### Refund System

Refunds are fully tracked.

Flow:
1. Refund initiated
2. Sent to payment gateway
3. Gateway confirms refund
4. Wallet credits reversed
5. Refund email sent

Supports:
- Partial refunds
- Admin initiated refunds
- System initiated refunds
- Gateway initiated refunds

---

### Wallet with Financial Audit

Wallet operations are tracked using immutable ledger.

Ledger tracks:

- Credit top-ups (PURCHASE)
- Credit spending (SPEND)
- Refund reversals (REFUND)
- Admin adjustments (ADMIN)

Wallet balance on user is **cached only**.

Ledger is the source of truth.

---

### Webhook Idempotency

Payment gateways retry webhooks.

System ensures:
- Same webhook event is processed only once
- Worker can safely retry failed processing
- Error tracking for debugging

---

### Email Idempotency

Emails are sent through workers (Kafka supported).

Before sending email:
- Check if email already sent
- Prevents duplicate mails

Supports:
- Payment success
- Invoice
- Promotion campaigns
- Refund notifications
- Wallet top-up

---

## High Level Flow

### Create Order

1. Validate plan
2. Load active promotions
3. Evaluate promotion rules
4. Apply stacking algorithm
5. Reserve coupon usage
6. Create payment gateway order
7. Save order in DB
8. Return checkout payload

---

### Payment Webhook Flow

1. Webhook received from gateway
2. Store webhook event (idempotency)
3. Worker processes webhook
4. Save payment record
5. Mark order as PAID
6. Add credits to wallet
7. Consume coupon usage
8. Send payment email

---

### Refund Flow

1. Refund requested
2. Refund sent to gateway
3. Refund webhook received
4. Save refund record
5. Reverse wallet credits
6. Send refund email

---

## Database Schema

### User

Stores account details, cached wallet balance, and order statistics.

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| name | String | User name |
| email | String | Unique email |
| password | String | Hashed password |
| admin | Boolean | Admin flag (default: false) |
| country | String? | Optional country code |
| credits | Int | Cached wallet balance (default: 0) |
| totalOrders | Int | Total order count (default: 0) |
| totalSpend | Decimal | Total amount spent (default: 0) |
| createdAt | DateTime | Created timestamp |
| updatedAt | DateTime | Updated timestamp |

**Relations:**
- orders: Order[]
- creditsLedger: CreditsLedger[]
- promotionUsages: PromotionUsage[]

**Indexes:**
- email

---

### Plans

Defines purchasable credit packs.

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| name | String | Plan name |
| description | String | Plan description |
| features | Json | Feature list |
| isActive | Boolean | Active status (default: true) |
| credits | Int | Credits given |
| priceUSD | Decimal | Price in USD |
| priceINR | Decimal | Price in INR |
| createdAt | DateTime | Created timestamp |
| updatedAt | DateTime | Updated timestamp |

**Relations:**
- orders: Order[]

---

### Promotions

Defines marketing campaigns with validity windows, stacking rules, and exclusivity.

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| name | String | Promotion name |
| type | PromotionType | AUTO, COUPON, TARGETED, LOYALTY |
| category | PromotionCategory | NORMAL, USER_SPECIFIC (default: NORMAL) |
| isActive | Boolean | Active status |
| priority | Int | Evaluation priority |
| exclusive | Boolean | Exclusive promotion flag |
| isStackable | Boolean | Can stack with others |
| startAt | DateTime | Validity start |
| endAt | DateTime | Validity end |
| createdAt | DateTime | Created timestamp |
| updatedAt | DateTime | Updated timestamp |

**Relations:**
- rules: PromotionRules[]
- effects: PromotionEffects[]
- coupons: CouponCode[]
- promotionUsages: PromotionUsage[]

**Indexes:**
- [isActive, startAt, endAt] - Active promotion queries

---

### PromotionRules

Defines eligibility conditions for promotions.

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| promotionId | String | FK to Promotions |
| ruleType | RuleType | Rule type enum |
| operator | String | Comparison operator |
| value | Json | Rule value |

**Rule Types:**
- MIN_ORDER_VALUE - Minimum order amount
- FIRST_PURCHASE - First time buyers only
- MAX_USER_ORDERS - Maximum user order limit
- PLAN_IN - Specific plans only
- USER_IN - Specific users only
- COUNTRY_IN - Specific countries only

**Relations:**
- promotions: Promotions (cascade delete)

**Indexes:**
- promotionId

---

### PromotionEffects

Defines benefits given by promotions.

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| promotionId | String | FK to Promotions |
| effectType | EffectType | Effect type enum |
| value | Decimal | Effect value |
| maxDiscount | Decimal? | Optional max discount cap |

**Effect Types:**
- PERCENT_DISCOUNT - Percentage off
- FLAT_DISCOUNT - Fixed amount off
- BONUS_CREDITS - Extra credits

**Relations:**
- promotions: Promotions (cascade delete)

**Indexes:**
- promotionId

---

### CouponCode

Stores actual coupon strings with usage limits.

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| promotionId | String | FK to Promotions |
| code | String | Unique coupon code |
| maxUses | Int | Global usage limit |
| perUserLimit | Int | Per user usage limit |
| isPublic | Boolean | Public visibility (default: true) |

**Relations:**
- promotions: Promotions (cascade delete)

**Indexes:**
- code (unique)

---

### PromotionUsage

Tracks coupon usage lifecycle for anti-abuse and auditing.

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| promotionId | String | FK to Promotions |
| userId | String | FK to User |
| orderId | String | FK to Order |
| status | CouponUsageStatus | RESERVED, CONSUMED, RELEASED |
| usedAt | DateTime | Usage timestamp |
| appliedPromos | Json | Applied promotion details |

**Relations:**
- promotion: Promotions
- user: User
- order: Order

**Constraints:**
- Unique: [promotionId, orderId, userId]

**Indexes:**
- promotionId
- userId
- status

---

### Order

Represents checkout session with payment gateway info.

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| userId | String | FK to User |
| planId | String | FK to Plans |
| gateway | PaymentGateway | RAZORPAY, STRIPE, PAYPAL |
| gatewayOrderId | String | Unique gateway order ID |
| baseAmount | Decimal | Original amount |
| discountTotal | Decimal | Total discount |
| finalAmount | Decimal | Final payable amount |
| currency | Currency | USD, INR |
| appliedPromos | Json | Applied promotions snapshot |
| status | OrderStatus | CREATED, PAID, FAILED, EXPIRED |
| failureReason | String? | Failure reason from gateway |
| metaData | Json? | Additional gateway metadata |
| createdAt | DateTime | Created timestamp |
| updatedAt | DateTime | Updated timestamp |

**Relations:**
- user: User
- plan: Plans
- payments: Payment[]
- refund: Refund[]
- promotionUsage: PromotionUsage[]

---

### Payment

Represents gateway transaction. Multiple attempts allowed per order.

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| orderId | String | FK to Order |
| gateway | PaymentGateway | RAZORPAY, STRIPE, PAYPAL |
| gatewayPaymentId | String | Unique gateway payment ID |
| status | PaymentStatus | SUCCESS, FAILED |
| rawPayload | Json | Raw gateway response |
| createdAt | DateTime | Created timestamp |
| updatedAt | DateTime | Updated timestamp |

**Relations:**
- order: Order
- refund: Refund[]

---

### Refund

Tracks refund lifecycle with support for partial refunds.

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| orderId | String | FK to Order |
| paymentId | String | FK to Payment |
| gateway | PaymentGateway | RAZORPAY, STRIPE, PAYPAL |
| gatewayRefundId | String? | Gateway refund ID (nullable until confirmed) |
| amount | Decimal | Refund amount |
| currency | Currency | USD, INR |
| status | RefundStatus | INITIATED, PROCESSING, SUCCESS, FAILED |
| reason | String? | Refund reason |
| initiatedBy | RefundSource | ADMIN, SYSTEM, GATEWAY |
| createdAt | DateTime | Created timestamp |
| updatedAt | DateTime | Updated timestamp |

**Relations:**
- order: Order
- payment: Payment

**Indexes:**
- orderId
- paymentId
- status

---

### CreditsLedger

Immutable wallet transaction history for financial audit.

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| userId | String | FK to User |
| change | Int | Credit change (+/-) |
| balanceAfter | Int | Balance after transaction |
| reason | LedgerReason | PURCHASE, SPEND, REFUND, ADMIN |
| referenceId | String | Related entity ID |
| referenceType | LedgerReferenceType | ORDER, PAYMENT, REFUND, ADMIN_ACTION |
| createdAt | DateTime | Created timestamp |

**Relations:**
- user: User

**Indexes:**
- [userId, createdAt] - User credit history
- userId
- [userId, referenceType] - User transactions by type
- referenceId - Reference lookup

---

### WebhookEvents

Stores gateway webhook events for idempotency and debugging.

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| eventId | String | Unique gateway event ID |
| gateway | PaymentGateway | RAZORPAY, STRIPE, PAYPAL |
| type | String | Event type |
| payload | Json | Raw webhook payload |
| processed | Boolean | Processing status (default: false) |
| processedAt | DateTime? | Processing timestamp |
| errorMessage | String? | Error message if failed |
| createdAt | DateTime | Created timestamp |

**Indexes:**
- processed
- [gateway, processed] - Gateway-specific processing queue

---

### EmailLog

Tracks sent emails to prevent duplicates.

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| userId | String? | Optional FK to User |
| entityType | EmailEntityType | ORDER, PROMOTION, REFUND, WALLET |
| entityId | String | Related entity ID |
| emailType | EmailType | Email type enum |
| sentAt | DateTime | Sent timestamp |

**Email Types:**
- PAYMENT_SUCCESS
- INVOICE
- PROMOTION_OFFER
- REFUND_PROCESSED
- WALLET_TOPUP

**Constraints:**
- Unique: [entityType, entityId, emailType]

**Indexes:**
- userId

---

## Enums

### PromotionType
- AUTO - Auto applied discounts
- COUPON - Requires coupon code
- TARGETED - Specific users
- LOYALTY - Based on user history

### PromotionCategory
- NORMAL - Standard promotion
- USER_SPECIFIC - User-targeted promotion

### RuleType
- MIN_ORDER_VALUE
- FIRST_PURCHASE
- MAX_USER_ORDERS
- PLAN_IN
- USER_IN
- COUNTRY_IN

### EffectType
- PERCENT_DISCOUNT
- FLAT_DISCOUNT
- BONUS_CREDITS

### CouponUsageStatus
- RESERVED - During checkout
- CONSUMED - After successful payment
- RELEASED - After failed/expired payment

### PaymentGateway
- RAZORPAY
- STRIPE
- PAYPAL

### OrderStatus
- CREATED - Order created, awaiting payment
- PAID - Payment successful
- FAILED - Payment failed
- EXPIRED - Order expired

### PaymentStatus
- SUCCESS
- FAILED

### RefundStatus
- INITIATED - Refund requested
- PROCESSING - Sent to gateway
- SUCCESS - Refund completed
- FAILED - Refund failed

### RefundSource
- ADMIN - Admin initiated
- SYSTEM - System initiated
- GATEWAY - Gateway initiated

### LedgerReason
- PURCHASE - Credits from purchase
- SPEND - Credits used
- REFUND - Credits reversed
- ADMIN - Admin adjustment

### LedgerReferenceType
- ORDER
- PAYMENT
- REFUND
- ADMIN_ACTION

### Currency
- USD
- INR

### EmailEntityType
- ORDER
- PROMOTION
- REFUND
- WALLET

### EmailType
- PAYMENT_SUCCESS
- INVOICE
- PROMOTION_OFFER
- REFUND_PROCESSED
- WALLET_TOPUP

---

## Scalability Design

System is built to scale using:

- Redis + BullMQ workers
- Kafka for email & async jobs
- Idempotent DB writes
- Stateless API servers

Payment processing is always handled by workers, not API threads.

---

## Financial Safety Rules

- Never update ledger entries - only append
- Never credit wallet directly without ledger
- Always process payment in DB transaction
- Always validate webhook signature
- Always use idempotency keys

---

## Ready for Production

This architecture supports:

- High traffic
- Multiple gateways
- Finance audit
- Marketing campaigns
- Safe refunds

Designed to work in enterprise environments.

---

## Next Steps

Planned implementations:

- Promotion rule evaluation engine
- Coupon stacking algorithm
- Worker payment processor
- Refund processor
- Kafka email consumer

---

Built for scale, safety and real-world finance.
