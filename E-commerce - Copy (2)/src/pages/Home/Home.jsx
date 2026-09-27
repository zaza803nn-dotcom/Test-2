// ========================================
// FIX (تعديل ملف): Home.jsx بعد التنظيف:
//
// 1- كان فيه زرارين تجريبيين "add to cart" و "Remove From Cart"
//    بيستدعوا addtoCart / RemoveFromCart من CartSlice —
//    كانوا بيغيروا العدّاد محليًا من غير أي API، فالعدّاد في الـ
//    Navbar كان بيطلع مش مطابق للسلة الحقيقية. الزرارين والـ
//    reducers اتمسحوا (الطريق الصحيح للإضافة هو زرار Cart في كارت المنتج).
//
// 2- كان فيه console.log(state) بيطبع الـ store كله في الـ console
//    مع كل render + useSelector بدون استخدام — كله dead code اتشال.
//
// 3- استيراد addtoCart/RemoveFromCart كان من فولدر مكتوب غلط (Rudex).
// ========================================

import Slider from "../Slider/Slider";
import Products from "../Products/Products";
import Categories from "../Categories/Categories";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 lg:px-8">
      <Slider />
      <Categories />
      <Products />
    </div>
  );
}
