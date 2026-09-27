// ========================================
// FIX (تعديل ملف): Rudex.js بعد التنظيف:
//
// 1- الفولدر نفسه كان اسمه غلط: "Rudex" — الصح Redux. اتبسط لـ src/Redux.
// 2- الملف نفسه كان اسمه غلط: "Rudex.js" — الصح store.js.
// 3- الـ reducer keys كانت: Cart / Authentication / Wishlist —
//    الوصول كان state.Cart.Cart (تكرار أسماء مربك). دلوقتي: cart / authentication.
// 4- WishlistReducer اتشال: الـ WishlistSlice كان dead code بالكامل —
//    مفيش ملف في المشروع بيستخدم ToggleWishlist ولا الـ state،
//    كل حاجة شغالة بـ React Query على مفتاح ["wishlist"].
// ========================================

import { configureStore } from "@reduxjs/toolkit";

import CartReducer from "./CartSlice";
import AuthenticationReducer from "./AuthenticationSlice";

export const store = configureStore({
  reducer: {
    // FIX: كان key اسمه "Cart" وجواه property "Cart" → state.Cart.Cart
    cart: CartReducer,

    // FIX: كان key اسمه "Authentication" — بقى اسم صغير متسق
    authentication: AuthenticationReducer,
  },
});
