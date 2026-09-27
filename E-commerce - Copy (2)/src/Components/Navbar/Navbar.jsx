import { NavLink } from "react-router-dom";

import {
  ShoppingCart,
  Heart,
} from "lucide-react";

import { motion } from "motion/react";

import ImgeIcon from "../../assets/freshcart-logo.svg";

import AnnouncementBar from "./../AnnouncementBar/AnnouncementBar";

import WishlistSlide from "../../pages/Wishlist/WishlistSlide";

import { useSelector, useDispatch } from "react-redux";

import { useEffect, useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

// FIX (مشكلة الـ logout): الحاجة كلها كانت بتفضل شكها زي ما هي لحد reload —
// لأن handleLogout كان بيمسح localStorage والـ Redux auth بس، من غير:
// 1) تصفير عدّاد السلة في Redux.
// 2) مسح كاش الـ React Query (السلة + الـ wishlist كانوا بيفضلوا من الـ memory).
// 3) toast + تحويل لصفحة الـ login.
// (وقدّه الـ reload بيظبط — لأنه بيمسح الـ memory كله).
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

// FIX: كان import axios من "axios" — بقت unused بعد الانتقال للـ instance الموحد
// FIX: كان import من "../../Rudex/AuthenticationSlice" — الفولدر كان مكتوب غلط (Rudex) واتبسط لـ Redux
import {
  logout,
  clearAuthFromStorage,
} from "../../Redux/AuthenticationSlice";

// FIX (مشكلة الـ refresh): العدّاد كان بيفضل 0 بعد الـ login لحد ما المستخدم
// يعمل refresh — لأن الـ CartPage هو اللي كان بيملى Redux من الـ query
// في useEffect تابع ليه، لكن الـ Navbar (اللي بيعرض الرقم) كان يشغّل
// الـ query من غير ما يحدث Redux. الحل: نفس المزامنة هنا.
import { setCart } from "../../Redux/CartSlice";

// FIX: axios المكرر (عنوان كامل + headers يدوي) اتبدل بـ instance موحد من src/api/api.js
import api from "../../api/api";


// ========================================
// GET LOGGED USER CART
// ========================================

// FIX: كان البراميتر token بيتستلم وبيتبعت من queryFn وماله استخدام
// بعد انتقال الـ headers للـ interceptor — اتشال
async function GetLoggedUserCart() {
  // FIX: كان axios.get بعنوان كامل + headers يدوي — بقى call واحد على الـ instance
  const response = await api.get(`/cart`);

  return response.data;
}


// ========================================
// NAVBAR
// ========================================

export default function Navbar() {
  const dispatch = useDispatch();

  // FIX (مشكلة الـ logout): محتاجين مسح الكاش + navigate في الـ logout
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // ========================================
  // AUTHENTICATION
  // ========================================

  // FIX: كان الوصول state.Authentication.token — الـ store key اتسمّى authentication
  // بعد تنظيف الـ store (كان بيتكرر في كل حتة state.Cart.Cart / state.Authentication.x)
  const token = useSelector(
    (state) => state.authentication.token
  );

  const reduxUser = useSelector(
    (state) => state.authentication.user
  );

  // ========================================
  // WISHLIST DRAWER
  // ========================================

  const [wishlistOpen, setWishlistOpen] =
    useState(false);

  // ========================================
  // CART QUERY
  // ========================================

  // FIX (مشكلة الـ refresh): كان استدعاء بدون استخدام للنتيجة.
  const {
    data: CartData,
  } = useQuery({
    // FIX (تعارض الـ queryKey): كان هنا ["cart", token] — يعني كاش منفصل
    // عن صفحة السلة وزرار الإضافة (اللي بيستخدموا ["cart"])، فالعّادّة
    // كانت بتفضل قديمة بعد إضافة منتج.
    // الحل: مفتاح موحد ["cart"] في كل المشروع، ولو الـ token مش موجود
    // الـ query مش هتشتغل أصلًا (enabled: !!token).
    queryKey: ["cart"],

    queryFn: () => GetLoggedUserCart(),

    enabled: !!token,

    staleTime: 5 * 60 * 1000,

    refetchOnWindowFocus: false,
  });

  // ========================================
  // SYNC CART COUNT → REDUX
  // ========================================

  // FIX (مشكلة الـ refresh): ده هو الإصلاح الفعلي — أول ما الـ login يحصل
  // الـ token بيتغير والـ query بتشتغل (enabled: !!token)، ولما الـ data
  // توصل بنملّي العدّاد في Redux هنا فورًا — من غير أي refresh.
  // (نفس المنطق كان موجود في CartPage بس — من هناك كان الرقم بيظهر
  //  بس بعد زيارة صفحة السلة أو refresh كامل).
  useEffect(() => {
    if (CartData) {
      dispatch(setCart(CartData.numOfCartItems || 0));
    }
  }, [CartData, dispatch]);

  // ========================================
  // CART COUNT
  // ========================================

  const cartCount = useSelector(
    // FIX: كان state.Cart.Cart (اسم الـ key نفس الـ property — لخبطة)
    // الحل: state.cart.count بعد إعادة تسمية الـ slice
    (state) => state.cart.count
  );

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    // FIX: كان logout reducer بيتمسح من localStorage جوه الـ reducer (side effect غلط)
    // الحل: المسح من localStorage هنا أول، وبعدين dispatch عادي
    clearAuthFromStorage();

    dispatch(logout());

    // FIX (مشكلة الـ logout): التلاتة دول كانوا ناقصين:

    // 1) نصفر عدّاد السلة في Redux — كان بيفضل بالرقم القديم بعد الـ logout
    dispatch(setCart(0));

    // 2) نمسح كاش الـ React Query كله (السلة، الـ wishlist، ...) —
    //    ده كان السبب إن الداتا القديمة تفضل ظاهرة في الـ drawer والصفحات
    queryClient.clear();

    toast.success("Logged out successfully");

    // 3) نحوّل لصفحة الـ login — بدل ما المستخدم يفضل في نفس الصفحة
    //    والـ UI كله شكله زي ما هو لحد ما يعمل reload بيده
    navigate("/Login");
  };

  // ========================================
  // NAVIGATION LINKS
  // ========================================

  const Links = [
    {
      name: "Home",
      path: "/",
    },

    {
      name: "Brands",
      path: "/Brands",
    },



    {
      name: "Products",
      path: "/Products",
    },

    {
      name: "Cart",
      path: "/Cart",
    },
  ];

  return (
    <>
      {/* ========================================
          NAVBAR
      ======================================== */}

      <nav className="fixed z-50 w-full border-b border-gray-200 bg-white shadow-sm">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          {/* ========================================
              LEFT - AUTH
          ======================================== */}

          <div className="flex items-center gap-3">

            {!reduxUser ? (
              <>
                {/* LOGIN */}

                <NavLink
                  to="/Login"
                  className={({ isActive }) =>
                    `rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-700 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  Login
                </NavLink>

                {/* FIX (مكان زرار الـ Register): زرار الـ Register كان هنا في الـ Navbar —
                    اتنقل لصفحة الـ Login نفسها (تحت الفورم:
                    "Don't have an account? Register") عشان اللي عنده اكونت
                    يلاقي اللوجين مباشر، واللي معندهاش ينشئ اكونت من صفحة اللوجين.
                    الـ /Register route نفسه مفيش أي تغيير فيه. */}
              </>
            ) : (
              /* USER */

              <div className="flex items-center gap-3">

                <span className="text-sm text-gray-600">
                  Hello{" "}

                  <span className="font-bold text-[#0aad0a]">
                    {reduxUser.name}
                  </span>
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    rounded-lg
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-red-600
                    transition
                    hover:bg-red-50
                  "
                >
                  Logout
                </button>

              </div>
            )}

          </div>


          {/* ========================================
              CENTER - LINKS
          ======================================== */}

          <div className="hidden items-center gap-1 md:flex">

            {Links.map((link) => (

              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`
                }
              >

                {link.name === "Cart" ? (

                  <div className="flex min-w-[55px] flex-col items-center justify-center">

                    {/* CART ICON */}

                    <div className="relative">

                      <motion.div
                        animate={
                          cartCount > 0
                            ? {
                                scale: [1, 1.08, 1],
                              }
                            : {
                                scale: 1,
                              }
                        }
                        transition={{
                          duration: 0.4,
                        }}
                      >

                        <ShoppingCart
                          size={22}
                          strokeWidth={2}
                        />

                      </motion.div>


                      {/* CART BADGE */}

                      {cartCount > 0 && (

                        <motion.span
                          key={cartCount}
                          initial={{
                            scale: 0.5,
                            opacity: 0,
                          }}
                          animate={{
                            scale: 1,
                            opacity: 1,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 18,
                          }}
                          className="
                            absolute
                            -right-2.5
                            -top-2
                            flex
                            h-[18px]
                            min-w-[18px]
                            items-center
                            justify-center
                            rounded-full
                            bg-red-500
                            px-1
                            text-[10px]
                            font-bold
                            leading-none
                            text-white
                            shadow-sm
                          "
                        >
                          {cartCount}
                        </motion.span>

                      )}

                    </div>


                    {/* CART TEXT */}

                    <span className="mt-1 text-xs font-medium">
                      Cart
                    </span>

                  </div>

                ) : (

                  link.name

                )}

              </NavLink>

            ))}

          </div>


          {/* ========================================
              RIGHT
          ======================================== */}

          <div className="flex items-center gap-4">

            {/* WISHLIST */}

            <button
              type="button"
              onClick={() => setWishlistOpen(true)}
              className="
                relative
                flex
                items-center
                justify-center
                rounded-xl
                p-2
                text-gray-700
                transition-all
                duration-200
                hover:bg-red-50
                hover:text-red-500
              "
              aria-label="Open wishlist"
            >

              <Heart
                size={22}
                strokeWidth={2}
              />

            </button>


            {/* LOGO */}

            <NavLink
              to="/"
              className="flex items-center"
            >

              <img
                src={ImgeIcon}
                alt="Freshcart"
                className="h-auto w-[150px]"
              />

            </NavLink>

          </div>

        </div>


        {/* ANNOUNCEMENT BAR */}

        <AnnouncementBar />

      </nav>


      {/* ========================================
          WISHLIST DRAWER
      ======================================== */}

      <WishlistSlide
        open={wishlistOpen}
        onOpenChange={setWishlistOpen}
      />

    </>
  );
}