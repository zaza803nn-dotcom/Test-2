// ========================================
// FIX (تعديل ملف): AuthenticationSlice بعد التنظيف:
//
// 1- الغلط الأكبر: الـ reducers كانت تعمل side effects
//    (localStorage.setItem / removeItem) جوه الـ reducer —
//    والـ reducers لازم تكون pure functions في Redux.
//    الحل: الـ reducers دلوقتي بتعدل الـ state بس، والتخزين
//    في localStorage بقى مسؤولية الـ helper saveAuthToStorage
//    و clearAuthFromStorage اللي بينادوا عليهم من الـ UI
//    (Login.jsx / Navbar.jsx) قبل الـ dispatch.
//
// 2- مصدر الحقيقة عند الـ refresh هو localStorage نفسه —
//    ده طبيعي وبيتمسح مع logout.
//
// 3- كمان كان في تكرار: Login.jsx كان يكتب في localStorage
//    يدويًا و setCredentials يكتب تاني — دلوقتي الكتابة مرة واحدة
//    عن طريق الـ helpers هنا.
// ========================================

import { createSlice } from "@reduxjs/toolkit";

// ========================================
// STORAGE HELPERS
// (كانت الكتابة/المسح جوه الـ reducers — غلط في Redux)
// ========================================

export function saveAuthToStorage({ user, token }) {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
}

export function clearAuthFromStorage() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

// ========================================
// SLICE
// ========================================

const AuthenticationSlice = createSlice({
  name: "authentication",

  initialState: {
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,

    token: localStorage.getItem("token"),
  },

  reducers: {
    // FIX: مفيش localStorage هنا — pure reducer بس
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    // FIX: مفيش localStorage هنا — pure reducer بس
    // (كمان كنا عندنا isAuthenticated مكرر ومش مستخدم — اتشال،
    //  وجود الـ token نفسه هو الدلالة)
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = AuthenticationSlice.actions;

export default AuthenticationSlice.reducer;
