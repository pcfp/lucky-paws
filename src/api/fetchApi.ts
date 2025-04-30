import axios from 'axios';
import { config } from 'process';

const api = axios.create({
  baseURL: 'https://frontend-take-home-service.fetch.com',
  withCredentials: true,
});

export const login = (name: string, email: string) =>
  api.post('/auth/login', { name, email }, {withCredentials:true});

export const logout = () => api.post('/auth/logout');

export const getBreeds = () => api.get('/dogs/breeds');

export const searchDogs = (params: any) => api.get('/dogs/search', { params });

export const getDogsByIds = (ids: string[]) => api.post('/dogs', ids);

export const getMatch = (ids: string[]) => api.post('/dogs/match', ids);

export const getLocations = (zipCodes: string[]) =>
  api.post('/locations', zipCodes);

export default api;
