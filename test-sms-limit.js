// test-sms-limit.js
const testPhoneNumber = '1234567890';
const testTransactionId = 'test-' + Date.now(); // Unique transaction ID
const url = 'http://localhost:3000/api/send-sms';

async function testSmsLimit() {
  console.log('Testing SMS rate limit functionality...');
  console.log(`Using phone: ${testPhoneNumber}, transaction ID: ${testTransactionId}`);
  console.log('Sending SMS requests until limit is reached...\n');

  let requestCount = 0;
  
  while (requestCount < 10) { // Try more than the limit (5)
    requestCount++;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mobileNumber: testPhoneNumber,
          name: 'Test User',
          transactionId: `${testTransactionId}-${requestCount}`
        })
      });
      
      const data = await response.json();
      
      console.log(`Request ${requestCount}:`);
      console.log(`  Status: ${response.status} ${response.statusText}`);
      console.log(`  Response: ${JSON.stringify(data)}`);
      
      if (!response.ok) {
        if (response.status === 429) {
          console.log('\n✅ Rate limit test PASSED! SMS limit was enforced.');
          break;
        } else {
          console.log('\n❌ Request failed with status:', response.status);
          break;
        }
      }
      
      // Show remaining quota if available
      if (data.remainingQuota !== undefined) {
        console.log(`  Remaining quota: ${data.remainingQuota}`);
      }
      
      // Add a small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Error:', error);
      break;
    }
  }
  
  if (requestCount >= 10) {
    console.log('\n❌ Rate limit test FAILED! Sent 10 SMS without hitting the limit.');
  }
}

// Run the test
testSmsLimit(); 