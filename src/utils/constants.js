import { AsyncStorage } from 'react-native';
import axios from 'axios';

const getAuthToken = async () => {
  let token = null;
  await AsyncStorage.getItem("user").then((value) => {
    if (value) {
      token = JSON.parse(value).token;
      axios.defaults.headers.Authorization = `Bearer ${token}`;
    }
  });
}

// Network constants

//https://tranquil-anchorage-35603.herokuapp.com/api/v1
// export const baseURL = 'https://tranquil-anchorage-35603.herokuapp.com/api/v1';
const devTesting = false;
export const baseURL =  devTesting === true ? 'https://tranquil-anchorage-35603.herokuapp.com/api/v1' : 'https://foodallinone.com/api/v1';
// export const baseURL = 'https://1a7c5c1d.ngrok.io/api/v1';


export const token = getAuthToken();