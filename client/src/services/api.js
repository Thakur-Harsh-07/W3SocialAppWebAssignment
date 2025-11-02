import axios from 'axios';

const API_BASE_URL = 'https://socialwebassignment.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  signup: async (name, email, password) => {
    const response = await api.post('/signup', { name, email, password });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },
};

// Posts API
export const postsAPI = {
  getAllPosts: async () => {
    const response = await api.get('/post');
    return response.data;
  },

  getUserPosts: async (userId) => {
    const response = await api.get(`/post/user/${userId}`);
    return response.data;
  },

  createPost: async (token, content, image = null) => {
    const response = await api.post('/post', { token, content, image });
    return response.data;
  },

  likePost: async (postId, token) => {
    const response = await api.post(`/post/${postId}/like`, { token });
    return response.data;
  },

  addComment: async (postId, token, content) => {
    const response = await api.post(`/post/${postId}/comment`, { token, content });
    return response.data;
  },
};

export default api;

