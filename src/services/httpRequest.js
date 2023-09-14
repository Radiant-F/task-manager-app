import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

const instance = token =>
  axios.create({
    baseURL: 'https://todoapi-production-61ef.up.railway.app/api/v1',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

export default instance;
