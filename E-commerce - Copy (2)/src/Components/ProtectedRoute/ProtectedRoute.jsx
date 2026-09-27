// ========================================
// FIX (تعديل ملف): ProtectedRoute بعد التنظيف:
//
// 1- الكود القديم كان: toast + setTimeout + navigate بعد 1.2 ثانية —
//    يعني الصفحة المحمية كانت بتفضل معلّقة ثانية كاملة قبل التحويل،
//    وكمان كان بيقرأ localStorage مباشرة وقت الـ render.
//
// 2- الحل: التحويل بقى فوري بـ <Navigate replace> — وهذي هي الطريقة
//    الموصى بها في react-router للـ guard.
//
// 3- مصدر الحقيقة: توكن في localStorage (نفس مصدر الـ Redux
//    authentication slice عند التحميل).
// ========================================

import { Outlet, Navigate } from "react-router-dom";

import { toast } from "react-hot-toast";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  // FIX: كان toast + setTimeout + navigate بعد 1200ms — تأخير بلا سبب
  // الحل: تحويل فوري بـ Navigate (replace عشان ميضفش في الـ history)
  if (!token) {
    toast.error("You are not logged in. Please login to get access", {
      duration: 2500,
    });

    return <Navigate to="/Login" replace />;
  }

  return <Outlet />;
}
