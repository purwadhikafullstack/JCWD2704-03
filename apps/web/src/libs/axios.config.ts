import axios from 'axios';
import { getCookie } from 'cookies-next';

const baseURL = process.env.NEXT_PUBLIC_API_BASEURL || 'http://localhost:8000';

// const baseURL = 'http://localhost:8000';

export function axiosInstance() {
  const token = getCookie('access_token') || '';

  return axios.create({
    baseURL,
    headers: {
      Authorization: 'Bearer ' + token,
    },
    withCredentials: true,
  });
}
