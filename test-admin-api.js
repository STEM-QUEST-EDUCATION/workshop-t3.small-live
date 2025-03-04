// test-admin-api.js
// You need to set this in your .env file or replace with your actual admin key
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'test-admin-key';
const BASE_URL = 'http://localhost:3000/api/admin/sms-limits';
const testPhoneNumber = '1234567890';

async function testAdminAPI() {
  console.log('Testing Admin API for SMS limits...');
  
  // Test 1: Get all SMS limits
  console.log('\n1. Getting all SMS limits:');
  try {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ADMIN_API_KEY}`
      }
    });
    
    const data = await response.json();
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('Response:', data);
    
    if (!response.ok) {
      console.log('❌ Get all limits test FAILED!');
    } else {
      console.log('✅ Get all limits test PASSED!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
  
  // Test 2: Get specific user's limit
  console.log('\n2. Getting specific user limit:');
  try {
    const response = await fetch(`${BASE_URL}?mobileNumber=${testPhoneNumber}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ADMIN_API_KEY}`
      }
    });
    
    const data = await response.json();
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('Response:', data);
    
    if (response.status === 404) {
      console.log('ℹ️ No record found for this user (expected if user has not sent any SMS)');
    } else if (!response.ok) {
      console.log('❌ Get user limit test FAILED!');
    } else {
      console.log('✅ Get user limit test PASSED!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
  
  // Test 3: Reset user's limit
  console.log('\n3. Resetting user\'s SMS limit:');
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ADMIN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mobileNumber: testPhoneNumber
      })
    });
    
    const data = await response.json();
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('Response:', data);
    
    if (!response.ok) {
      console.log('❌ Reset limit test FAILED!');
    } else {
      console.log('✅ Reset limit test PASSED!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the tests
testAdminAPI(); 