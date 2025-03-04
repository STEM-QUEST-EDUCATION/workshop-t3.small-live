# SMS Rate Limiting Testing Guide

This guide explains how to test the SMS rate limiting system we've implemented to prevent abuse of the SMS API.

## Prerequisites

1. Make sure the development server is running:
   ```
   npm run dev
   ```

2. Set an `ADMIN_API_KEY` in your `.env` file:
   ```
   ADMIN_API_KEY=your-admin-key-here
   ```

## Testing Options

There are multiple ways to test the SMS rate limiting system:

### Option 1: Run the Complete Test Script

The complete test script tests both the SMS rate limiting and the admin reset functionality:

```bash
node test-sms-system.js
```

This script will:
1. Reset the test user's SMS limit
2. Send SMS requests until the limit is reached
3. Verify the limit in the database
4. Reset the limit using the admin API
5. Verify the user can send SMS again

### Option 2: Test SMS Rate Limiting Only

To test only the SMS rate limiting:

```bash
node test-sms-limit.js
```

This script will send SMS requests until the limit is reached.

### Option 3: Test Admin API Only

To test only the admin API for viewing and resetting SMS limits:

```bash
node test-admin-api.js
```

This script will test getting all limits, getting a specific user's limit, and resetting a user's limit.

## Manual Testing via API Calls

### Test SMS Sending Until Limit

```bash
# Send first SMS (should succeed)
curl -X POST http://localhost:3000/api/send-sms \
  -H "Content-Type: application/json" \
  -d '{"mobileNumber": "1234567890", "name": "Test User", "transactionId": "test123"}'

# Send 5 more SMS requests to hit the limit
# The 6th request should fail with a 429 status code
```

### View SMS Limits via Admin API

```bash
# Get all limits
curl -X GET http://localhost:3000/api/admin/sms-limits \
  -H "Authorization: Bearer your-admin-key-here"

# Get specific user's limit
curl -X GET "http://localhost:3000/api/admin/sms-limits?mobileNumber=1234567890" \
  -H "Authorization: Bearer your-admin-key-here"
```

### Reset a User's SMS Limit

```bash
# Reset a user's SMS limit
curl -X POST http://localhost:3000/api/admin/sms-limits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-admin-key-here" \
  -d '{"mobileNumber": "1234567890"}'
```

## Testing in the Frontend

1. Navigate to a page with OTP functionality
2. Try to request multiple OTPs for the same number
3. After 5 requests, you should see an error message about SMS limit exceeded
4. Use the admin API to reset the limit
5. Try again and it should work

## Observing Database Changes

You can monitor the SMS limit records in your database by using the admin API to view all limits:

```bash
curl -X GET http://localhost:3000/api/admin/sms-limits \
  -H "Authorization: Bearer your-admin-key-here"
```

This will show you all users' SMS count and when their last reset occurred.

## Expected Behavior

- Users can send at most 5 SMS messages per day (configurable via `MAX_SMS_PER_DAY` constant)
- After reaching the limit, users will receive a 429 status code with an error message
- SMS counts automatically reset at midnight
- Admins can manually reset a user's count using the admin API
- After a reset, users can send SMS messages again 