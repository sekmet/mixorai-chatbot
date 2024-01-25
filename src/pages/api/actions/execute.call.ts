import axios, { AxiosResponse } from 'axios';
import { Action } from './action.interface';

const apiUrl = 'https://api.example.com';

function sendRequest(action: Action, inputData: any): Promise<AxiosResponse<any>> {
  const requestBody = JSON.stringify({
    action_name: action.name,
    input_data: inputData,
  });

  return axios.post(`${apiUrl}/execute`, requestBody, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch((error) => {
    // Handle network issues, timeouts, or server-side errors here
    console.error('Request failed:', error.message);
    throw error;
  });
}

export { sendRequest };