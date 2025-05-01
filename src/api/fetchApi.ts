import axios from 'axios';

const api = axios.create({
  baseURL: 'https://frontend-take-home-service.fetch.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const login = (name: string, email: string) =>
  api.post('/auth/login', { name, email });

export const logout = () => api.post('/auth/logout', {});

export const getBreeds = () => api.get('/dogs/breeds');

export const searchDogs = (params: any) => api.get('/dogs/search', { params });

export const getDogsByIds = (ids: string[]) => api.post('/dogs', ids);

export const getMatch = (ids: string[]) => api.post('/dogs/match', ids);

export const getLocations = (zipCodes: string[]) =>
  api.post('/locations', zipCodes);

export default api;
