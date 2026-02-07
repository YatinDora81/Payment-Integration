# Promotions API Guide

> Complete reference for creating promotions, rules, effects, and coupons.

---

## Table of Contents

- [API Endpoint](#api-endpoint)
- [Request Schema](#request-schema)
- [Field Reference](#field-reference)
  - [Promotion](#promotion-fields)
  - [Rules](#rules-fields)
  - [Effects](#effects-fields)
  - [Coupons](#coupons-fields)
- [Promotion Types Matrix](#promotion-types-matrix)
- [Examples by Type](#examples-by-type)
  - [AUTO Promotions](#auto-promotions)
  - [COUPON Promotions](#coupon-promotions)
  - [TARGETED Promotions](#targeted-promotions)
  - [LOYALTY Promotions](#loyalty-promotions)
- [Stacking & Priority Logic](#stacking--priority-logic)
- [Common Mistakes](#common-mistakes)

---

## API Endpoint

```
POST /promotions/add-promotions
Content-Type: application/json
```

---

## Request Schema

The body is an **array** of promotion objects. Each object contains 4 sections:

```json
[
  {
    "promotion": { ... },
    "rules": { ... },
    "effects": { ... },
    "coupons": { ... }
  }
]
```

---

## Field Reference

### Promotion Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Display name |
| `type` | `enum` | Yes | `AUTO` \| `COUPON` \| `TARGETED` \| `LOYALTY` |
| `category` | `enum` | Yes | `NORMAL` \| `USER_SPECIFIC` |
| `isActive` | `boolean` | Yes | Enable/disable promotion |
| `priority` | `number` | Yes | Lower = evaluated first (0 is highest) |
| `exclusive` | `boolean` | Yes | If `true`, blocks all other promotions |
| `isStackable` | `boolean` | Yes | If `true`, can combine with others |
| `startAt` | `string` | Yes | ISO 8601 datetime (e.g. `"2026-01-01T00:00:00.000Z"`) |
| `endAt` | `string` | Yes | ISO 8601 datetime |

### Rules Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ruleType` | `enum` | Yes | See rule types below |
| `operator` | `string` | Yes | Comparison operator |
| `value` | `any` | Yes | Value to compare against (string, number, boolean, array) |

**Rule Types:**

| Rule Type | Operator | Value Type | Example |
|-----------|----------|------------|---------|
| `FIRST_PURCHASE` | `EQUALS` | `boolean` | `true` |
| `MIN_ORDER_VALUE` | `GTE` / `GT` | `number` | `500` |
| `MAX_USER_ORDERS` | `GTE` / `LTE` | `number` | `5` |
| `PLAN_IN` | `IN` | `string[]` | `["plan-id-1", "plan-id-2"]` |
| `USER_IN` | `IN` | `string[]` | `["user-id-1", "user-id-2"]` |
| `COUNTRY_IN` | `IN` | `string[]` | `["IN", "US", "UK"]` |

### Effects Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `effectType` | `enum` | Yes | `PERCENT_DISCOUNT` \| `FLAT_DISCOUNT` \| `BONUS_CREDITS` |
| `value` | `number` | Yes | Discount percentage / flat amount / bonus credits |
| `maxDiscount` | `number` | No | Cap for percentage discounts |

**Effect Types Explained:**

| Effect | Value Meaning | maxDiscount |
|--------|--------------|-------------|
| `PERCENT_DISCOUNT` | Percentage off (e.g. `20` = 20%) | Optional cap |
| `FLAT_DISCOUNT` | Fixed amount off (e.g. `200` = Rs.200 off) | Not needed |
| `BONUS_CREDITS` | Extra credits added (e.g. `100` = 100 bonus credits) | Not needed |

### Coupons Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `code` | `string` | Yes | Unique coupon code (e.g. `"WELCOME20"`) |
| `maxUses` | `number` | Yes | Total global usage limit |
| `perUserLimit` | `number` | Yes | Max uses per user |
| `isPublic` | `boolean` | Yes | Visible to all users or private |

> **Note:** For `AUTO` and non-coupon promotions, still provide coupons with dummy values since the schema requires it. These won't be used in evaluation.

---

## Promotion Types Matrix

| Type | Category | Coupon? | Applied How? | Use Case |
|------|----------|---------|-------------|----------|
| `AUTO` | `NORMAL` | No | Auto for everyone | Flash sale, festival sale |
| `AUTO` | `USER_SPECIFIC` | No | Auto for matching users | Loyalty bonus, cart abandonment |
| `COUPON` | `NORMAL` | Yes (public) | User enters code | Influencer code, general coupon |
| `COUPON` | `USER_SPECIFIC` | Yes (private) | User enters code + must be in list | Student discount, VIP code |
| `TARGETED` | `NORMAL` | No | Auto for matching rule | Country-based offers |
| `TARGETED` | `USER_SPECIFIC` | Optional | Auto/code for specific users | Win-back campaigns, email coupons |
| `LOYALTY` | `NORMAL` | No | Auto after behavior | First purchase bonus |
| `LOYALTY` | `USER_SPECIFIC` | No | Auto for qualifying users | Frequent buyer reward, high spender |

---

## Examples by Type

### AUTO Promotions

#### 1. Flash Sale (Everyone, Short Window)

```json
[
  {
    "promotion": {
      "name": "Flash Sale 30%",
      "type": "AUTO",
      "category": "NORMAL",
      "isActive": true,
      "priority": 1,
      "exclusive": false,
      "isStackable": true,
      "startAt": "2026-02-01T10:00:00.000Z",
      "endAt": "2026-02-01T14:00:00.000Z"
    },
    "rules": {
      "ruleType": "MIN_ORDER_VALUE",
      "operator": "GTE",
      "value": 0
    },
    "effects": {
      "effectType": "PERCENT_DISCOUNT",
      "value": 30,
      "maxDiscount": 500
    },
    "coupons": {
      "code": "FLASH30",
      "maxUses": 99999,
      "perUserLimit": 1,
      "isPublic": true
    }
  }
]
```

#### 2. First Order Discount (Auto, No Coupon)

```json
[
  {
    "promotion": {
      "name": "First Order Discount",
      "type": "AUTO",
      "category": "NORMAL",
      "isActive": true,
      "priority": 2,
      "exclusive": false,
      "isStackable": true,
      "startAt": "2026-01-01T00:00:00.000Z",
      "endAt": "2026-12-31T23:59:59.000Z"
    },
    "rules": {
      "ruleType": "FIRST_PURCHASE",
      "operator": "EQUALS",
      "value": true
    },
    "effects": {
      "effectType": "PERCENT_DISCOUNT",
      "value": 20,
      "maxDiscount": 300
    },
    "coupons": {
      "code": "FIRST20",
      "maxUses": 99999,
      "perUserLimit": 1,
      "isPublic": true
    }
  }
]
```

#### 3. Festival Mega Sale (Everyone, Date Window)

```json
[
  {
    "promotion": {
      "name": "Festival Mega Sale",
      "type": "AUTO",
      "category": "NORMAL",
      "isActive": true,
      "priority": 1,
      "exclusive": false,
      "isStackable": true,
      "startAt": "2026-10-20T00:00:00.000Z",
      "endAt": "2026-10-30T23:59:59.000Z"
    },
    "rules": {
      "ruleType": "MIN_ORDER_VALUE",
      "operator": "GTE",
      "value": 0
    },
    "effects": {
      "effectType": "PERCENT_DISCOUNT",
      "value": 25,
      "maxDiscount": 600
    },
    "coupons": {
      "code": "FESTIVAL25",
      "maxUses": 99999,
      "perUserLimit": 1,
      "isPublic": true
    }
  }
]
```

#### 4. Cart Abandonment (Targeted Users, Auto)

```json
[
  {
    "promotion": {
      "name": "Come Back Offer",
      "type": "AUTO",
      "category": "USER_SPECIFIC",
      "isActive": true,
      "priority": 6,
      "exclusive": false,
      "isStackable": true,
      "startAt": "2026-01-01T00:00:00.000Z",
      "endAt": "2026-03-01T23:59:59.000Z"
    },
    "rules": {
      "ruleType": "USER_IN",
      "operator": "IN",
      "value": ["USER_ID_1", "USER_ID_2"]
    },
    "effects": {
      "effectType": "FLAT_DISCOUNT",
      "value": 200
    },
    "coupons": {
      "code": "COMEBACK200",
      "maxUses": 100,
      "perUserLimit": 1,
      "isPublic": false
    }
  }
]
```

#### 5. Loyalty Bonus Credits (Auto, After Behavior)

```json
[
  {
    "promotion": {
      "name": "Loyalty Bonus Credits",
      "type": "AUTO",
      "category": "USER_SPECIFIC",
      "isActive": true,
      "priority": 5,
      "exclusive": false,
      "isStackable": true,
      "startAt": "2026-01-01T00:00:00.000Z",
      "endAt": "2026-12-31T23:59:59.000Z"
    },
    "rules": {
      "ruleType": "MAX_USER_ORDERS",
      "operator": "GTE",
      "value": 3
    },
    "effects": {
      "effectType": "BONUS_CREDITS",
      "value": 100
    },
    "coupons": {
      "code": "LOYALTY100",
      "maxUses": 99999,
      "perUserLimit": 1,
      "isPublic": false
    }
  }
]
```

---

### COUPON Promotions

#### 6. Influencer Code (Public Coupon)

```json
[
  {
    "promotion": {
      "name": "Influencer Special",
      "type": "COUPON",
      "category": "NORMAL",
      "isActive": true,
      "priority": 4,
      "exclusive": false,
      "isStackable": true,
      "startAt": "2026-01-01T00:00:00.000Z",
      "endAt": "2026-06-30T23:59:59.000Z"
    },
    "rules": {
      "ruleType": "MIN_ORDER_VALUE",
      "operator": "GTE",
      "value": 0
    },
    "effects": {
      "effectType": "PERCENT_DISCOUNT",
      "value": 15,
      "maxDiscount": 250
    },
    "coupons": {
      "code": "INFLUENCER15",
      "maxUses": 5000,
      "perUserLimit": 1,
      "isPublic": true
    }
  }
]
```

#### 7. Student Discount (Private Coupon + User List)

```json
[
  {
    "promotion": {
      "name": "Student Discount",
      "type": "COUPON",
      "category": "USER_SPECIFIC",
      "isActive": true,
      "priority": 5,
      "exclusive": false,
      "isStackable": false,
      "startAt": "2026-01-01T00:00:00.000Z",
      "endAt": "2026-12-31T23:59:59.000Z"
    },
    "rules": {
      "ruleType": "USER_IN",
      "operator": "IN",
      "value": ["STUDENT_USER_ID_1", "STUDENT_USER_ID_2"]
    },
    "effects": {
      "effectType": "PERCENT_DISCOUNT",
      "value": 50,
      "maxDiscount": 500
    },
    "coupons": {
      "code": "STUDENT50",
      "maxUses": 200,
      "perUserLimit": 1,
      "isPublic": false
    }
  }
]
```

#### 8. Black Friday (Exclusive, Blocks Everything)

```json
[
  {
    "promotion": {
      "name": "Black Friday Deal",
      "type": "AUTO",
      "category": "NORMAL",
      "isActive": true,
      "priority": 0,
      "exclusive": true,
      "isStackable": false,
      "startAt": "2026-11-27T00:00:00.000Z",
      "endAt": "2026-11-27T23:59:59.000Z"
    },
    "rules": {
      "ruleType": "MIN_ORDER_VALUE",
      "operator": "GTE",
      "value": 0
    },
    "effects": {
      "effectType": "PERCENT_DISCOUNT",
      "value": 60,
      "maxDiscount": 1000
    },
    "coupons": {
      "code": "BLACKFRIDAY60",
      "maxUses": 99999,
      "perUserLimit": 1,
      "isPublic": true
    }
  }
]
```

---

### TARGETED Promotions

#### 9. Win-Back Selected Users (Auto, No Coupon)

```json
[
  {
    "promotion": {
      "name": "Win Back Selected Users",
      "type": "TARGETED",
      "category": "USER_SPECIFIC",
      "isActive": true,
      "priority": 6,
      "exclusive": false,
      "isStackable": true,
      "startAt": "2026-01-01T00:00:00.000Z",
      "endAt": "2026-03-31T23:59:59.000Z"
    },
    "rules": {
      "ruleType": "USER_IN",
      "operator": "IN",
      "value": ["USER_ID_1", "USER_ID_2", "USER_ID_3"]
    },
    "effects": {
      "effectType": "FLAT_DISCOUNT",
      "value": 250
    },
    "coupons": {
      "code": "WINBACK250",
      "maxUses": 50,
      "perUserLimit": 1,
      "isPublic": false
    }
  }
]
```

#### 10. India-Only Campaign (Country Based)

```json
[
  {
    "promotion": {
      "name": "India User Special",
      "type": "TARGETED",
      "category": "NORMAL",
      "isActive": true,
      "priority": 4,
      "exclusive": false,
      "isStackable": true,
      "startAt": "2026-01-01T00:00:00.000Z",
      "endAt": "2026-06-30T23:59:59.000Z"
    },
    "rules": {
      "ruleType": "COUNTRY_IN",
      "operator": "IN",
      "value": ["IN"]
    },
    "effects": {
      "effectType": "PERCENT_DISCOUNT",
      "value": 20,
      "maxDiscount": 300
    },
    "coupons": {
      "code": "INDIA20",
      "maxUses": 10000,
      "perUserLimit": 1,
      "isPublic": false
    }
  }
]
```

#### 11. Email-Only Coupon (Targeted + Private Code)

```json
[
  {
    "promotion": {
      "name": "Email Only Coupon",
      "type": "TARGETED",
      "category": "USER_SPECIFIC",
      "isActive": true,
      "priority": 7,
      "exclusive": false,
      "isStackable": false,
      "startAt": "2026-01-01T00:00:00.000Z",
      "endAt": "2026-02-28T23:59:59.000Z"
    },
    "rules": {
      "ruleType": "USER_IN",
      "operator": "IN",
      "value": ["USER_ID_10", "USER_ID_11"]
    },
    "effects": {
      "effectType": "PERCENT_DISCOUNT",
      "value": 40,
      "maxDiscount": 400
    },
    "coupons": {
      "code": "EMAIL40",
      "maxUses": 50,
      "perUserLimit": 1,
      "isPublic": false
    }
  }
]
```

---

### LOYALTY Promotions

#### 12. Frequent Buyer Bonus (Order Count Based)

```json
[
  {
    "promotion": {
      "name": "Frequent Buyer Bonus",
      "type": "LOYALTY",
      "category": "USER_SPECIFIC",
      "isActive": true,
      "priority": 8,
      "exclusive": false,
      "isStackable": true,
      "startAt": "2026-01-01T00:00:00.000Z",
      "endAt": "2026-12-31T23:59:59.000Z"
    },
    "rules": {
      "ruleType": "MAX_USER_ORDERS",
      "operator": "GTE",
      "value": 5
    },
    "effects": {
      "effectType": "BONUS_CREDITS",
      "value": 200
    },
    "coupons": {
      "code": "FREQUENT200",
      "maxUses": 99999,
      "perUserLimit": 1,
      "isPublic": false
    }
  }
]
```

#### 13. First Purchase Bonus Credits

```json
[
  {
    "promotion": {
      "name": "First Purchase Bonus Credits",
      "type": "LOYALTY",
      "category": "NORMAL",
      "isActive": true,
      "priority": 3,
      "exclusive": false,
      "isStackable": true,
      "startAt": "2026-01-01T00:00:00.000Z",
      "endAt": "2026-12-31T23:59:59.000Z"
    },
    "rules": {
      "ruleType": "FIRST_PURCHASE",
      "operator": "EQUALS",
      "value": true
    },
    "effects": {
      "effectType": "BONUS_CREDITS",
      "value": 50
    },
    "coupons": {
      "code": "FIRSTBONUS50",
      "maxUses": 99999,
      "perUserLimit": 1,
      "isPublic": true
    }
  }
]
```

#### 14. High Spender Reward

```json
[
  {
    "promotion": {
      "name": "High Spender Reward",
      "type": "LOYALTY",
      "category": "USER_SPECIFIC",
      "isActive": true,
      "priority": 9,
      "exclusive": false,
      "isStackable": true,
      "startAt": "2026-01-01T00:00:00.000Z",
      "endAt": "2026-12-31T23:59:59.000Z"
    },
    "rules": {
      "ruleType": "MAX_USER_ORDERS",
      "operator": "GTE",
      "value": 10
    },
    "effects": {
      "effectType": "BONUS_CREDITS",
      "value": 500
    },
    "coupons": {
      "code": "HIGHSPEND500",
      "maxUses": 99999,
      "perUserLimit": 1,
      "isPublic": false
    }
  }
]
```

---

## Stacking & Priority Logic

### How Priority Works

| Priority | Meaning |
|----------|---------|
| `0` | Highest priority, evaluated first |
| `1-3` | High priority (flash sales, first order) |
| `4-6` | Medium priority (coupons, targeted) |
| `7-9` | Low priority (loyalty, win-back) |

### How Stacking Works

```
1. Sort all active promotions by priority (ascending)
2. For each promotion:
   a. Evaluate rules against user/order
   b. If rules pass:
      - If exclusive = true  --> Apply ONLY this, skip rest
      - If isStackable = true --> Apply and continue
      - If isStackable = false --> Apply and skip same-category
```

### Stacking Decision Table

| Promo A | Promo B | Result |
|---------|---------|--------|
| `exclusive: true` | any | Only A applies |
| `isStackable: true` | `isStackable: true` | Both apply |
| `isStackable: false` | `isStackable: false` (same category) | Only higher priority applies |
| `isStackable: true` | `isStackable: false` | Both apply |

### Category Stacking

| Category | Stacks With |
|----------|-------------|
| `NORMAL` | Other `NORMAL` (if stackable) |
| `USER_SPECIFIC` | Other `USER_SPECIFIC` (if stackable) |
| `NORMAL` | `USER_SPECIFIC` (cross-category always stacks) |

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Sending `startAt` as `"2026-01-01"` | Use full ISO: `"2026-01-01T00:00:00.000Z"` |
| `rules.value` as wrong type | Match rule type: boolean for `FIRST_PURCHASE`, number for `MIN_ORDER_VALUE`, array for `*_IN` |
| Missing `coupons` object | Always provide it, even for AUTO promotions |
| `exclusive: true` + `isStackable: true` | Contradictory. Exclusive should have `isStackable: false` |
| Duplicate `priority` values | Allowed, but may cause unpredictable evaluation order |
| `maxDiscount` on `FLAT_DISCOUNT` | Not needed, ignored. Only for `PERCENT_DISCOUNT` |
