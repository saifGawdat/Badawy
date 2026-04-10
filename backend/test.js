const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const API_URL = 'http://localhost:5000/api';

const runTests = async () => {
  try {
    console.log('--- Testing Login ---');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      username: 'admin',
      password: 'adminpassword123'
    });
    const token = loginRes.data.token;
    console.log('✅ Login successful, token received');

    console.log('\n--- Testing Item Creation ---');
    const form = new FormData();
    form.append('title', 'Test Item');
    form.append('description', 'This is a test description');
    // Create a dummy file for testing
    fs.writeFileSync('test-image.txt', 'fake image content');
    form.append('image', fs.createReadStream('test-image.txt'), 'test-image.txt');

    const createRes = await axios.post(`${API_URL}/items`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Item created:', createRes.data.title);
    const itemId = createRes.data._id;

    console.log('\n--- Testing Get Items ---');
    const getRes = await axios.get(`${API_URL}/items`);
    console.log('✅ Items found:', getRes.data.length);

    console.log('\n--- Testing Item Deletion ---');
    const deleteRes = await axios.delete(`${API_URL}/items/${itemId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Item deleted:', deleteRes.data.message);

    // Cleanup
    fs.unlinkSync('test-image.txt');
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response ? error.response.data : error.message);
  }
};

runTests();
