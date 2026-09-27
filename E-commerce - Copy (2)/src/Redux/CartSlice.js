// ========================================
// FIX (تعديل ملف): ده نفس CartSlice القديم بس بعد التنظيف:
//
// 1- كان الـ state شكله: { Cart: 0 } والـ slice key في الـ store
//    اسمه "Cart" برضه — يعني الوصول كان state.Cart.Cart (لخبطة).
//    الحل: الـ property بقى اسمها count والوصول state.cart.count.
//
// 2- الـ reducers الميتة addtoCart و RemoveFromCart اتشالت —
//    كانوا بيزودوا/ينقصوا العدّاد محليًا من غير أي API call،
//    وده كان بيخلي العدّاد مختلف عن السلة الحقيقية.
//    (كانت بتستخدمهم في Home.jsx بأزرار تجريبية — اتشالت من هناك برضه)
//
// 3- الرسالة: Redux هنا بيحتفظ بس بالعدّاد للعرض (Navbar badge)،
//    والمصدر الحقيقي هو الـ React Query cache — بيتحدث عن طريق setCart.
// ========================================

import { createSlice } from "@reduxjs/toolkit";

const CartSlice = createSlice({
  name: "cart",

  initialState: {
    count: 0,
  },

  reducers: {
    setCart(state, action) {
      state.count = action.payload;
    },

    clearCart(state) {
      state.count = 0;
    },
  },
});

export const { setCart, clearCart } = CartSlice.actions;

export default CartSlice.reducer;
