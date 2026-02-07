1️⃣ FLASH SALE
AUTO + NORMAL (applies to all automatically for short time)
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
  "rules": [],
  "effects": [
    { "effectType": "PERCENT_DISCOUNT", "value": 30, "maxDiscount": 500 }
  ],
  "coupons": []
}

2️⃣ REFERRAL / LOYALTY BONUS
AUTO + USER_SPECIFIC (auto reward after behavior)
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
  "rules": [
    { "ruleType": "MAX_USER_ORDERS", "operator": "GTE", "value": 3 }
  ],
  "effects": [
    { "effectType": "BONUS_CREDITS", "value": 100 }
  ],
  "coupons": []
}

3️⃣ FIRST ORDER DISCOUNT
AUTO + NORMAL (no coupon, first purchase only)
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
  "rules": [
    { "ruleType": "FIRST_PURCHASE", "operator": "EQUALS", "value": true }
  ],
  "effects": [
    { "effectType": "PERCENT_DISCOUNT", "value": 20, "maxDiscount": 300 }
  ],
  "coupons": []
}

4️⃣ CART ABANDONMENT
AUTO + USER_SPECIFIC (targeted users only)
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
  "rules": [
    {
      "ruleType": "USER_IN",
      "operator": "IN",
      "value": ["USER_ID_1", "USER_ID_2"]
    }
  ],
  "effects": [
    { "effectType": "FLAT_DISCOUNT", "value": 200 }
  ],
  "coupons": []
}

5️⃣ FESTIVAL CAMPAIGN
AUTO + NORMAL (applies to everyone)
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
  "rules": [],
  "effects": [
    { "effectType": "PERCENT_DISCOUNT", "value": 25, "maxDiscount": 600 }
  ],
  "coupons": []
}

6️⃣ INFLUENCER CODE
COUPON + NORMAL (public coupon)
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
  "rules": [],
  "effects": [
    { "effectType": "PERCENT_DISCOUNT", "value": 15, "maxDiscount": 250 }
  ],
  "coupons": [
    { "code": "INFLUENCER15", "maxUses": 5000, "perUserLimit": 1, "isPublic": true }
  ]
}

7️⃣ STUDENT DISCOUNT
COUPON + USER_SPECIFIC (private coupon)
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
  "rules": [
    {
      "ruleType": "USER_IN",
      "operator": "IN",
      "value": ["STUDENT_USER_ID_1", "STUDENT_USER_ID_2"]
    }
  ],
  "effects": [
    { "effectType": "PERCENT_DISCOUNT", "value": 50, "maxDiscount": 500 }
  ],
  "coupons": [
    { "code": "STUDENT50", "maxUses": 200, "perUserLimit": 1, "isPublic": false }
  ]
}

8️⃣ BLACK FRIDAY
AUTO + NORMAL + EXCLUSIVE (blocks all others)
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
  "rules": [],
  "effects": [
    { "effectType": "PERCENT_DISCOUNT", "value": 60, "maxDiscount": 1000 }
  ],
  "coupons": []
}

9️⃣ TARGETED — USER LIST (Auto, No Coupon)

🎯 Example: Cart abandonment / win-back users
Applied automatically but only to selected users

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
  "rules": [
    {
      "ruleType": "USER_IN",
      "operator": "IN",
      "value": ["USER_ID_1", "USER_ID_2", "USER_ID_3"]
    }
  ],
  "effects": [
    { "effectType": "FLAT_DISCOUNT", "value": 250 }
  ],
  "coupons": []
}

🔟 TARGETED — COUNTRY BASED (Auto)

🎯 Example: India-only campaign

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
  "rules": [
    {
      "ruleType": "COUNTRY_IN",
      "operator": "IN",
      "value": ["IN"]
    }
  ],
  "effects": [
    { "effectType": "PERCENT_DISCOUNT", "value": 20, "maxDiscount": 300 }
  ],
  "coupons": []
}

1️⃣1️⃣ TARGETED — COUPON + USER LIST

🎯 Example: Coupon emailed to selected users

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
  "rules": [
    {
      "ruleType": "USER_IN",
      "operator": "IN",
      "value": ["USER_ID_10", "USER_ID_11"]
    }
  ],
  "effects": [
    { "effectType": "PERCENT_DISCOUNT", "value": 40, "maxDiscount": 400 }
  ],
  "coupons": [
    {
      "code": "EMAIL40",
      "maxUses": 50,
      "perUserLimit": 1,
      "isPublic": false
    }
  ]
}

🔥 LOYALTY PROMOTIONS (ALL CASES)
1️⃣2️⃣ LOYALTY — ORDER COUNT BASED (Auto Bonus)

🎯 Example: Reward frequent buyers

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
  "rules": [
    {
      "ruleType": "MAX_USER_ORDERS",
      "operator": "GTE",
      "value": 5
    }
  ],
  "effects": [
    { "effectType": "BONUS_CREDITS", "value": 200 }
  ],
  "coupons": []
}

1️⃣3️⃣ LOYALTY — FIRST PURCHASE BONUS

🎯 Example: Give credits on first paid order

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
  "rules": [
    {
      "ruleType": "FIRST_PURCHASE",
      "operator": "EQUALS",
      "value": true
    }
  ],
  "effects": [
    { "effectType": "BONUS_CREDITS", "value": 50 }
  ],
  "coupons": []
}

1️⃣4️⃣ LOYALTY — HIGH SPENDER REWARD

🎯 Example: Users who spent a lot get bonus

⚠️ Assumes you’ll later add rule like TOTAL_SPEND_GTE
(you can add it without schema change)

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
  "rules": [
    {
      "ruleType": "MAX_USER_ORDERS",
      "operator": "GTE",
      "value": 10
    }
  ],
  "effects": [
    { "effectType": "BONUS_CREDITS", "value": 500 }
  ],
  "coupons": []
}