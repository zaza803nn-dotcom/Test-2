import { useMemo } from "react";
import { Drawer } from "vaul";
import {
  X,
  Heart,
  Trash2,
  // FIX: كان ShoppingBag مستورد ومالوش استخدام — اتشال
  LoaderCircle,
} from "lucide-react";

import { motion } from "motion/react";
import { toast } from "react-hot-toast";

// FIX: كان import axios من "axios" + BASE_URL + getToken() مكررين
// في كل ملف — استُبدلوا بالـ instance الموحد من src/api/api.js
import api from "../../api/api";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import Cart from "../Cart/Cart";

// FIX: كان BASE_URL + getToken() معرفين هنا وهنا مكررين — اتمسحوا،
// الـ instance بيقرأ الـ token من localStorage بنفسه في الـ interceptor
// =========================
// Get Wishlist
// =========================
async function GetWishlist() {
  // FIX: كان axios.get بعنوان كامل + headers يدوي — بقى call واحد
  const { data } = await api.get(`/wishlist`);

  return data;
}


// =========================
// Remove Wishlist Product
// =========================
async function RemoveFromWishlist(productId) {
  // FIX: كان axios.delete بعنوان كامل + headers يدوي — بقى call واحد
  const { data } = await api.delete(
    `/wishlist/${productId}`
  );

  return data;
}

export default function WishlistSlide({
  open,
  onOpenChange,
}) {
  let user = localStorage.getItem("token")
  const queryClient = useQueryClient();

  // =========================
  // Wishlist Query
  // =========================
  const {
    data: WishlistData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: GetWishlist,
    // FIX: كان enabled: !!getToken() — والـ function اتمسحت مع التنظيف
    // (كانت مكررة في كل ملف). نفس المنطق مباشرة من localStorage.
    enabled: !!localStorage.getItem("token") && open,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // =========================
  // Products
  // =========================
  const WishlistProducts = useMemo(() => {
    return WishlistData?.data || [];
  }, [WishlistData]);

  // =========================
  // Remove Mutation
  // =========================
  const RemoveMutation = useMutation({
    mutationFn: RemoveFromWishlist,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });

      // FIX: الحذف الناجح كان بيطلع toast.error — غلطة منطقية،
      // النجاح المفروض toast.success
      toast.success("Removed from Wishlist");
    },

    onError: () => {
      toast.error("Something went wrong");
    },
  });

  // =========================
  // Loading
  // =========================
  if (isLoading) {
    return (
      <Drawer.Root
        direction="right"
        open={open}
        onOpenChange={onOpenChange}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />

          <Drawer.Content className="fixed right-0 top-0 bottom-0 z-50 w-[420px] max-w-[90vw] outline-none">
            <div className="flex h-full w-full flex-col bg-white shadow-2xl">

              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5">
                <div className="flex items-center gap-2">
                  <Heart
                    size={22}
                    className="fill-red-500 text-red-500"
                  />

                  <Drawer.Title className="text-xl font-bold text-gray-900">
                    My Wishlist
                  </Drawer.Title>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-1 items-center justify-center">
                <LoaderCircle
                  size={35}
                  className="animate-spin text-[#0AAD0A]"
                />
              </div>

            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <Drawer.Root
      direction="right"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Drawer.Portal>

        {/* Overlay */}
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />

        {/* Drawer */}
        <Drawer.Content
          className="
            fixed
            right-0
            top-0
            bottom-0
            z-50
            w-[420px]
            max-w-[90vw]
            outline-none
          "
        >
          <div className="flex h-full w-full flex-col bg-white shadow-2xl">

            {/* ================= Header ================= */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5">

              <div className="flex items-center gap-2">

                <Heart
                  size={22}
                  className="fill-red-500 text-red-500"
                />

                <Drawer.Title className="text-xl font-bold text-gray-900">
                  My Wishlist
                </Drawer.Title>

                <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-500">
                  {WishlistProducts.length}
                </span>

              </div>

              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  text-gray-500
                  transition-all
                  duration-200
                  hover:bg-gray-100
                  hover:text-gray-900
                "
                aria-label="Close wishlist"
              >
                <X size={20} />
              </button>

            </div>

            {/* ================= Content ================= */}
            <div className="flex-1 overflow-y-auto p-5">

              {/* Error */}
              {isError && (
                <div className="flex h-full items-center justify-center text-center">
                  <div>
                    <p className="font-semibold text-red-500">
                      Failed to load wishlist
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Please try again later.
                    </p>
                  </div>
                </div>
              )}

              {/* Empty */}
              {
                user ? (
                  !isError &&
                  WishlistProducts.length === 0 && (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                        <Heart
                          size={38}
                          className="text-red-400"
                          strokeWidth={1.5}
                        />
                      </div>

                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        Your Wishlist is Empty
                      </h3>

                      <p className="max-w-[260px] text-sm leading-6 text-gray-500">
                        Save your favorite products here and find them easily later.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                      <Heart
                        size={38}
                        className="text-red-400"
                        strokeWidth={1.5}
                      />
                    </div>

                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      Login Required
                    </h3>

                    <p className="max-w-[260px] text-sm leading-6 text-gray-500">
                      Please login to view your wishlist.
                    </p>
                  </div>
                )
              }

              {/* ================= Products ================= */}
              {WishlistProducts.length > 0 && (
                <div className="space-y-4">

                  {WishlistProducts.map((product) => {

                    const isRemoving =
                      RemoveMutation.isPending &&
                      RemoveMutation.variables === product._id;

                    return (
                      <motion.div
                        key={product._id}
                        layout
                        initial={{
                          opacity: 0,
                          x: 30,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        exit={{
                          opacity: 0,
                          x: 30,
                        }}
                        className="
                          overflow-hidden
                          rounded-2xl
                          border
                          border-gray-100
                          bg-white
                          p-3
                          shadow-sm
                          transition
                          hover:shadow-md
                        "
                      >

                        <div className="flex gap-3">

                          {/* Image */}
                          <div className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-50">

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

                          </div>

                          {/* Info */}
                          <div className="flex min-w-0 flex-1 flex-col">

                            <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                              {product.title}
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                              {product.category?.name}
                            </p>

                            <div className="mt-auto flex items-center justify-between">

                              <span className="text-lg font-bold text-[#0AAD0A]">
                                EGP {product.price}
                              </span>

                              {/* Remove */}
                              <button
                                type="button"
                                disabled={isRemoving}
                                onClick={() =>
                                  RemoveMutation.mutate(
                                    product._id
                                  )
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

                        {/* Add To Cart */}
                        <div className="mt-3">

                          <Cart productId={product._id} />

                        </div>

                      </motion.div>
                    );
                  })}

                </div>
              )}

            </div>

          </div>
        </Drawer.Content>

      </Drawer.Portal>
    </Drawer.Root>
  );
}