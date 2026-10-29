import api from './api';

export const getMyProfile = () => api.get('/profile');
export const updateMyProfile = (data) => api.put('/profile', data);
export const changePassword = (data) => api.put('/profile/password', data);