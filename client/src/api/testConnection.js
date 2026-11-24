
import API from './axios';

const testConnection = async () => {
  try {
    const response = await API.get('/auth/me');

    console.log('Backend connected!');
    console.log('Logged-in user:', response.data.user);

  } catch (error) {
    console.log('Backend response:', error.response?.data);
    console.log('Status:', error.response?.status);
  }
};

testConnection();
