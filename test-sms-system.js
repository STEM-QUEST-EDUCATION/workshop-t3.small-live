// test-sms-system.js - Tests the complete SMS rate limiting system
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'test-admin-key';
const BASE_URL = 'http://localhost:3000';
const SMS_URL = `${BASE_URL}/api/send-sms`;
const ADMIN_URL = `${BASE_URL}/api/admin/sms-limits`;
const testPhoneNumber = '1234567890';
const testTransactionId = 'test-' + Date.now(); // Unique transaction ID

// Utility function to make a request and log response
async function makeRequest(url, options, description) {
  console.log(`\n${description}:`);
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('Response:', data);
    return { response, data };
  } catch (error) {
    console.error('Error:', error);
    return { error };
  }
}

// Step 1: Reset the user's SMS limit before starting the test
async function resetUserLimit() {
  return makeRequest(
    ADMIN_URL,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ADMIN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mobileNumber: testPhoneNumber
      })
    },
    'STEP 1: Resetting user SMS limit before test'
  );
}

// Step 2: Send SMS requests until we hit the limit
async function testSmsLimit() {
  console.log('\nSTEP 2: Testing SMS rate limit...');
  console.log(`Using phone: ${testPhoneNumber}`);
  
  let requestCount = 0;
  let hitLimit = false;
  
  while (requestCount < 10 && !hitLimit) { // Try more than the limit (5)
    requestCount++;
    
    const { response, data } = await makeRequest(
      SMS_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mobileNumber: testPhoneNumber,
          name: 'Test User',
          transactionId: `${testTransactionId}-${requestCount}`
        })
      },
      `SMS request ${requestCount}`
    );
    
    if (!response || !response.ok) {
      if (response && response.status === 429) {
        console.log('\n✅ Rate limit test PASSED! SMS limit was enforced.');
        hitLimit = true;
      } else {
        console.log('\n❌ Request failed with status:', response ? response.status : 'unknown');
        break;
      }
    }
    
    // Show remaining quota if available
    if (data && data.remainingQuota !== undefined) {
      console.log(`Remaining quota: ${data.remainingQuota}`);
    }
    
    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  if (!hitLimit) {
    console.log('\n❌ Rate limit test FAILED! Sent multiple SMS without hitting the limit.');
  }
  
  return { requestCount, hitLimit };
}

// Step 3: Check the user's current limit through admin API
async function checkUserLimit() {
  return makeRequest(
    `${ADMIN_URL}?mobileNumber=${testPhoneNumber}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ADMIN_API_KEY}`
      }
    },
    'STEP 3: Checking user limit in database'
  );
}

// Step 4: Reset the limit and verify it was reset
async function resetAndVerifyLimit() {
  // Reset the limit
  await makeRequest(
    ADMIN_URL,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ADMIN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mobileNumber: testPhoneNumber
      })
    },
    'STEP 4a: Resetting user limit'
  );
  
  // Verify the limit was reset
  return makeRequest(
    `${ADMIN_URL}?mobileNumber=${testPhoneNumber}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ADMIN_API_KEY}`
      }
    },
    'STEP 4b: Verifying limit was reset'
  );
}

// Step 5: Make one more request to confirm the user can send SMS again
async function verifyUserCanSendAgain() {
  return makeRequest(
    SMS_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mobileNumber: testPhoneNumber,
        name: 'Test User',
        transactionId: `${testTransactionId}-final`
      })
    },
    'STEP 5: Verifying user can send SMS after reset'
  );
}

// Run all tests in sequence
async function runCompleteTest() {
  console.log('=== FULL SMS SYSTEM TEST ===');
  console.log('Testing both rate limiting and admin reset functionality');
  
  // Step 1: Reset user's limit before starting
  await resetUserLimit();
  
  // Step 2: Test SMS rate limit
  const { hitLimit } = await testSmsLimit();
  
  if (!hitLimit) {
    console.log('\nTest failed - did not hit rate limit. Stopping test.');
    return;
  }
  
  // Step 3: Check the user's current limit 
  await checkUserLimit();
  
  // Step 4: Reset and verify the limit
  const { data: resetData } = await resetAndVerifyLimit();
  
  if (!resetData || !resetData.success) {
    console.log('\nTest failed - could not reset user limit. Stopping test.');
    return;
  }
  
  // Step 5: Verify user can send SMS again
  const { response: finalResponse } = await verifyUserCanSendAgain();
  
  if (finalResponse && finalResponse.ok) {
    console.log('\n✅ SYSTEM TEST PASSED! User can send SMS again after reset.');
  } else {
    console.log('\n❌ SYSTEM TEST FAILED! User cannot send SMS after reset.');
  }
  
  console.log('\n=== TEST COMPLETED ===');
}

// Run the full test
runCompleteTest(); 