// ========================================
// FIX: قلنا قبل كده إن getToken() والـ BASE_URL
// والـ headers { token } كانوا متكررين في كل ملف
// (Wishlist.jsx, CartPage.jsx, Cart.jsx, Navbar.jsx ...).
// الحل: axios instance واحد هنا + interceptor يضيف
// الـ token تلقائيًا على كل request، فمفيش نسيان header.
// ========================================

import axios from "axios";

export const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

// Instance واحد للمشروع كله
const api = axios.create({
  baseURL: BASE_URL,
});

// FIX: interceptor بيقرأ الـ token من localStorage
// ويحطه في الـ header تلقائيًا — بدل التكرار اليدوي في كل function
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.token = token;
  }
  return config;
});

export default api;
