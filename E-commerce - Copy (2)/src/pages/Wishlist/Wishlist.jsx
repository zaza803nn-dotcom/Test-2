// ========================================
// FIX (صفحة جديدة): ده الملف كان قبل كده بيصدّر
// "زرار القلب" (heart button) كـ default export،
// وده خلّى route الـ /Wishlist في App.jsx يعرض
// زرار واحد بس بدل صفحة الـ wishlist الحقيقية.
//
// الحل:
// 1- زرار القلب اتنقل لـ WishlistHeartButton.jsx.
// 2- الملف ده بقى الصفحة الحقيقية: بيجيب الـ
//    wishlist من الـ API ويعرض المنتجات
//    (صورة، اسم، سعر) مع زرار حذف وزرار إضافة للسلة.
// 3- بستخدم نفس queryKey الموحد ["wishlist"].
// ========================================

import { useMemo } from "react";

import { Link } from "react-router-dom";

import {
  Heart,
  Trash2,
  LoaderCircle,
} from "lucide-react";

import { motion } from "motion/react";

import { toast } from "react-hot-toast";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// FIX: axios المكرر اتبدل بـ instance موحد من src/api/api.js
import api from "../../api/api";

import Cart from "../Cart/Cart";

// ========================================
// GET WISHLIST
// ========================================

async function GetWishlist() {
  const { data } = await api.get(`/wishlist`);
  return data;
}

// ========================================
// REMOVE FROM WISHLIST
// ========================================

async function RemoveFromWishlist(productId) {
  const { data } = await api.delete(
    `/wishlist/${productId}`
  );

  return data;
}

// ========================================
// WISHLIST PAGE
// (دي كانت مش موجودة أصلًا — الـ route كان بيعرض الزرار غلط)
// ========================================

export default function Wishlist() {
  const queryClient = useQueryClient();

  // ======================================
  // GET WISHLIST QUERY
  // ======================================

  const {
    data: WishlistData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: GetWishlist,
    enabled: !!localStorage.getItem("token"),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // ======================================
  // PRODUCTS
  // ======================================

  const WishlistProducts = useMemo(() => {
    return WishlistData?.data || [];
  }, [WishlistData]);

  // ======================================
  // REMOVE MUTATION
  // ======================================

  const RemoveMutation = useMutation({
    mutationFn: RemoveFromWishlist,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });

      // FIX: في WishlistSlide كان النجاح بيطلع
      // toast.error — هنا النجاح success زي ما ينبغي
      toast.success("Removed from Wishlist");
    },

    onError: () => {
      toast.error("Something went wrong");
    },
  });

  // ======================================
  // LOADING
  // ======================================

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle
          size={40}
          className="animate-spin text-[#0AAD0A]"
        />
      </div>
    );
  }

  // ======================================
  // ERROR
  // ======================================

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-semibold text-red-500">
          Failed to load wishlist. Please try again later.
        </p>
      </div>
    );
  }

  // ======================================
  // UI
  // ======================================

  return (
    <section className="mx-auto w-full max-w-[1300px] px-4 py-8 sm:px-6 lg:px-8">
      {/* HEADER */}

      <div className="mb-8">
        <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-[#0AAD0A]">
          Wishlist
        </p>

        <h1 className="flex items-center gap-2 text-3xl font-black text-slate-900 sm:text-4xl">
          <Heart
            size={28}
            className="fill-red-500 text-red-500"
          />

          My Wishlist

          <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-bold text-rose-500">
            {WishlistProducts.length}
          </span>
        </h1>
      </div>

      {/* EMPTY */}

      {WishlistProducts.length === 0 && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl bg-white text-center shadow-sm">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <Heart
              size={38}
              className="text-red-400"
              strokeWidth={1.5}
            />
          </div>

          <h2 className="mb-2 text-2xl font-bold text-slate-900">
            Your Wishlist is Empty
          </h2>

          <p className="max-w-[300px] text-slate-500">
            Save your favorite products here and find them easily later.
          </p>

          <Link
            to="/Products"
            className="mt-6 rounded-xl bg-[#0AAD0A] px-6 py-3 font-bold text-white transition hover:bg-[#089208]"
          >
            Browse Products
          </Link>
        </div>
      )}

      {/* PRODUCTS */}

      {WishlistProducts.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WishlistProducts.map((product) => {
            const isRemoving =
              RemoveMutation.isPending &&
              RemoveMutation.variables === product._id;

            return (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  p-4
                  shadow-sm
                  transition
                  hover:shadow-md
                "
              >
                <div className="flex gap-4">

                  {/* IMAGE */}

                  <Link
                    to={`/ProductDetails/${product._id}`}
                    className="
                      h-28
                      w-24
                      shrink-0
                      overflow-hidden
                      rounded-xl
                      bg-gray-50
                    "
                  >
                    <img
                      src={product.imageCover}
                      alt={product.title}
                      className="
                        h-full
                        w-full
                        object-contain
                        transition-transform
                        duration-300
                        hover:scale-105
                      "
                    />
                  </Link>

                  {/* INFO */}

                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      to={`/ProductDetails/${product._id}`}
                      className="
                        line-clamp-2
                        text-sm
                        font-semibold
                        text-gray-900
                        hover:text-[#0AAD0A]
                      "
                    >
                      {product.title}
                    </Link>

                    <p className="mt-1 text-xs text-gray-500">
                      {product.category?.name}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-lg font-bold text-[#0AAD0A]">
                        EGP {product.price}
                      </span>

                      {/* REMOVE */}

                      <button
                        type="button"
                        disabled={isRemoving}
                        onClick={() =>
                          RemoveMutation.mutate(product._id)
                        }
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          text-gray-400
                          transition
                          hover:bg-red-50
                          hover:text-red-500
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                        title="Remove from wishlist"
                        aria-label="Remove from wishlist"
                      >
                        {isRemoving ? (
                          <LoaderCircle
                            size={17}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={17} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* ADD TO CART */}

                <div className="mt-3">
                  <Cart productId={product._id} />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
