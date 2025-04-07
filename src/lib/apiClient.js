import axios from './axios';

export const apiGet = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

export const apiPost = async (url, body) => {
  const response = await axios.post(url, body);
  return response.data;
};

export const apiPut = async (url, body) => {
  const response = await axios.put(url, body);
  return response.data;
};

export const apiDelete = async (url) => {
  const response = await axios.delete(url);
  return response.data;
};
