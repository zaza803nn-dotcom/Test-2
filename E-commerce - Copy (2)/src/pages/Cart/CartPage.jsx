import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// FIX: كان axios العادي + getToken() + headers { token } يدوي في كل function.
// دلوقتي: instance موحد من src/api/api.js بيضيف الـ token تلقائيًا
import api from "../../api/api";

// FIX: كان import من "../../Rudex/CartSlice" — الفولدر كان مكتوب غلط (Rudex) واتبسط لـ Redux
import {
  setCart,
  clearCart,
} from "../../Redux/CartSlice";

// ========================================
// TOKEN
// ========================================

function getToken() {
  return localStorage.getItem("token");
}

// ========================================
// GET CART
// ========================================

async function GetLoggedUserCart() {
  // FIX: كان axios.get بعنوان كامل + headers يدوي — بقى call واحد
  const { data } = await api.get(`/cart`);
  return data;
}

// ========================================
// UPDATE CART PRODUCT
// ========================================

async function UpdateCartProduct(
  productId,
  count
) {
  // FIX: كان axios.put + headers يدوي — بقى call واحد
  const { data } = await api.put(
    `/cart/${productId}`,
    {
      count,
    }
  );

  return data;
}

// ========================================
// REMOVE PRODUCT
// ========================================

async function RemoveCartItem(productId) {
  // FIX: كان axios.delete + headers يدوي — بقى call واحد
  const { data } = await api.delete(
    `/cart/${productId}`
  );

  return data;
}

// ========================================
// CLEAR CART
// ========================================

async function ClearUserCart() {
  // FIX: كان axios.delete + headers يدوي — بقى call واحد
  const { data } = await api.delete(`/cart`);
  return data;
}

// ========================================
// CART PAGE
// ========================================

export default function CartPage() {
  const dispatch = useDispatch();

  // FIX: زرار "Proceed To Checkout" كان ميّت — مفيش onClick ولا navigate.
  // الحل: useNavigate + onClick بيروح لصفحة الـ /Checkout.
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  // ========================================
  // REMOVING PRODUCT ID
  // ========================================

  const [removingProductId, setRemovingProductId] =
    useState(null);

  // ========================================
  // GET CART
  // ========================================

  const {
    data: CartData,
    isLoading,
    isError,
  } = useQuery({
    // FIX (تعارض الـ queryKey): الـ Navbar كان بيستخدم ["cart", token]
    // وصفحة السلة وزرار الإضافة كانوا بيستخدموا ["cart"] — يعني كاشين مختلفين
    // والعّادّة كانت مش بتتحدث. دلوقتي المفتاح موحد: ["cart"] في كل مكان.
    queryKey: ["cart"],
    queryFn: GetLoggedUserCart,

    enabled: !!getToken(),

    // FIX: كانت staleTime: Infinity — يعني الـ data عمرها ما تُعتبر قديمة
    // حتى بعد تغيير السلة. اتبدلت بوقت معقول مع الـ invalidation بعد كل mutation.
    staleTime: 30 * 1000,

    refetchOnWindowFocus: false,
  });

  // ========================================
  // UPDATE REDUX CART COUNT
  // ========================================

  useEffect(() => {
    if (CartData) {
      dispatch(
        setCart(
          CartData?.numOfCartItems || 0
        )
      );
    }
  }, [CartData, dispatch]);

  // ========================================
  // UPDATE QUANTITY
  // ========================================

  const UpdateMutation = useMutation({
    mutationFn: ({
      productId,
      count,
    }) =>
      UpdateCartProduct(
        productId,
        count
      ),

    onSuccess: async (data) => {
      /*
       * لو الـ API رجع عدد السلة
       * نحدث Redux مباشرة.
       */

      if (
        data?.numOfCartItems !==
        undefined
      ) {
        dispatch(
          setCart(
            data.numOfCartItems
          )
        );
      }

      /*
       * نجيب Cart الجديدة
       * عشان الـ UI يتحدث فورًا.
       */

      await queryClient.refetchQueries({
        queryKey: ["cart"],
      });
    },
  });

  // ========================================
  // REMOVE PRODUCT
  // ========================================

  const RemoveMutation = useMutation({
    mutationFn: RemoveCartItem,

    /*
     * نحدد الـ product اللي بيتحذف
     * بدل ما نخلي كل الـ buttons
     * تعتبر نفسها pending.
     */

    onMutate: (productId) => {
      setRemovingProductId(productId);
    },

    onSuccess: async (data) => {
      /*
       * تحديث Redux لو الـ response
       * فيه numOfCartItems.
       */

      if (
        data?.numOfCartItems !==
        undefined
      ) {
        dispatch(
          setCart(
            data.numOfCartItems
          )
        );
      }

      /*
       * أهم جزء:
       * نجيب الـ Cart الجديدة فورًا.
       */

      await queryClient.refetchQueries({
        queryKey: ["cart"],
      });
    },

    onSettled: () => {
      /*
       * بعد نجاح أو فشل الـ request
       * نشيل حالة الـ removing.
       */

      setRemovingProductId(null);
    },
  });

  // ========================================
  // CLEAR CART
  // ========================================

  const ClearMutation = useMutation({
    mutationFn: ClearUserCart,

    onSuccess: async () => {
      // نصفر Redux
      dispatch(clearCart());

      // نجيب الـ Cart الجديدة
      await queryClient.refetchQueries({
        queryKey: ["cart"],
      });
    },
  });

  // ========================================
  // PRODUCTS
  // ========================================

  // FIX (تحذير react-hooks): كان Products بيتعمل كـ array جديد كل render
  // من غير memoization، فكان بيخلي dependencies بتاع الـ useMemo بتاع الـ summary
  // تتغير كل مرة — الحل: wrap جوه useMemo نفسه.
  const Products = useMemo(() => {
    return CartData?.data?.products || [];
  }, [CartData]);

  // ========================================
  // CART SUMMARY
  // ========================================

  const CartSummary = useMemo(() => {
    const totalItems =
      Products.reduce(
        (total, item) =>
          total + item.count,
        0
      );

    const totalPrice =
      Products.reduce(
        (total, item) =>
          total +
          item.price * item.count,
        0
      );

    return {
      totalItems,
      totalPrice,
    };
  }, [Products]);

  // ========================================
  // LOADING
  // ========================================

  if (isLoading) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
        "
      >
        <div
          className="
            h-12
            w-12
            animate-spin
            rounded-full
            border-4
            border-emerald-500
            border-t-transparent
          "
        />
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (isError) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
        "
      >
        <p className="text-red-500">
          Failed to load cart
        </p>
      </div>
    );
  }

  // ========================================
  // HANDLERS
  // ========================================

  const handleUpdate = (
    productId,
    count
  ) => {
    if (count < 1) return;

    UpdateMutation.mutate({
      productId,
      count,
    });
  };

  const handleRemove = (
    productId
  ) => {
    RemoveMutation.mutate(
      productId
    );
  };

  const handleClear = () => {
    ClearMutation.mutate();
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        px-4
        py-8
        sm:px-6
        lg:px-10
      "
    >
      <div className="mx-auto max-w-7xl">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                mb-1
                text-sm
                font-semibold
                uppercase
                tracking-widest
                text-emerald-500
              "
            >
              Shopping Cart
            </p>

            <h1
              className="
                text-3xl
                font-black
                text-slate-900
                sm:text-4xl
              "
            >
              Your Cart
            </h1>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              {CartSummary.totalItems} items
            </p>
          </div>

          {/* ================================= */}
          {/* CLEAR CART */}
          {/* ================================= */}

          {Products.length > 0 && (
            <button
              onClick={handleClear}
              disabled={
                ClearMutation.isPending
              }
              className="
                rounded-xl
                bg-red-50
                px-5
                py-3
                font-semibold
                text-red-500
                transition
                hover:bg-red-100
                disabled:opacity-50
              "
            >
              {ClearMutation.isPending
                ? "Clearing..."
                : "Clear Cart"}
            </button>
          )}
        </div>

        {/* ================================= */}
        {/* EMPTY CART */}
        {/* ================================= */}

        {Products.length === 0 ? (
          <div
            className="
              flex
              min-h-[50vh]
              flex-col
              items-center
              justify-center
              rounded-3xl
              bg-white
              text-center
              shadow-sm
            "
          >
            <div
              className="
                mb-5
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-emerald-50
                text-3xl
              "
            >
              🛒
            </div>

            <h2
              className="
                text-2xl
                font-bold
                text-slate-900
              "
            >
              Your cart is empty
            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Add some products to get started.
            </p>
          </div>
        ) : (

          /* ================================= */
          /* CART CONTENT */
          /* ================================= */

          <div
            className="
              grid
              gap-6
              lg:grid-cols-[1fr_350px]
            "
          >

            {/* ================================= */}
            {/* PRODUCTS */}
            {/* ================================= */}

            <div className="space-y-4">

              {Products.map((item) => {
                const productId =
                  item.product._id;

                const isRemoving =
                  removingProductId ===
                  productId;

                return (
                  <div
                    key={productId}
                    className="
                      rounded-2xl
                      bg-white
                      p-4
                      shadow-sm
                      transition
                      hover:shadow-md
                      sm:p-5
                    "
                  >
                    <div
                      className="
                        flex
                        gap-4
                        sm:gap-6
                      "
                    >

                      {/* IMAGE */}

                      <img
                        src={
                          item.product
                            .imageCover
                        }
                        alt={
                          item.product
                            .title
                        }
                        className="
                          h-24
                          w-24
                          shrink-0
                          rounded-xl
                          object-cover
                          sm:h-32
                          sm:w-32
                        "
                      />

                      {/* INFO */}

                      <div
                        className="
                          flex
                          min-w-0
                          flex-1
                          flex-col
                          justify-between
                        "
                      >

                        {/* TITLE + PRICE */}

                        <div>
                          <h2
                            className="
                              line-clamp-2
                              text-sm
                              font-bold
                              text-slate-900
                              sm:text-lg
                            "
                          >
                            {
                              item.product
                                .title
                            }
                          </h2>

                          <p
                            className="
                              mt-2
                              font-bold
                              text-emerald-600
                            "
                          >
                            {item.price} EGP
                          </p>
                        </div>

                        {/* CONTROLS */}

                        <div
                          className="
                            mt-4
                            flex
                            flex-wrap
                            items-center
                            justify-between
                            gap-3
                          "
                        >

                          {/* QUANTITY */}

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                              rounded-xl
                              bg-slate-100
                              p-1
                            "
                          >
                            <button
                              onClick={() =>
                                handleUpdate(
                                  productId,
                                  item.count - 1
                                )
                              }
                              disabled={
                                item.count <= 1 ||
                                UpdateMutation.isPending
                              }
                              className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                bg-white
                                font-bold
                                transition
                                hover:text-emerald-500
                                disabled:opacity-40
                              "
                            >
                              -
                            </button>

                            <span
                              className="
                                min-w-6
                                text-center
                                font-bold
                              "
                            >
                              {item.count}
                            </span>

                            <button
                              onClick={() =>
                                handleUpdate(
                                  productId,
                                  item.count + 1
                                )
                              }
                              disabled={
                                UpdateMutation.isPending
                              }
                              className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                bg-white
                                font-bold
                                transition
                                hover:text-emerald-500
                              "
                            >
                              +
                            </button>
                          </div>

                          {/* REMOVE */}

                          <button
                            onClick={() =>
                              handleRemove(
                                productId
                              )
                            }
                            disabled={
                              isRemoving
                            }
                            className="
                              text-sm
                              font-semibold
                              text-red-500
                              transition
                              hover:text-red-600
                              disabled:cursor-not-allowed
                              disabled:opacity-40
                            "
                          >
                            {isRemoving
                              ? "Removing..."
                              : "Remove"}
                          </button>

                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>

            {/* ================================= */}
            {/* SUMMARY */}
            {/* ================================= */}

            <div
              className="
                h-fit
                rounded-3xl
                bg-slate-950
                p-6
                text-white
                shadow-xl
                lg:sticky
                lg:top-6
              "
            >
              <p
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-widest
                  text-emerald-400
                "
              >
                Order Summary
              </p>

              <h2
                className="
                  mt-2
                  text-2xl
                  font-black
                "
              >
                Checkout
              </h2>

              <div
                className="
                  my-6
                  space-y-4
                  border-y
                  border-white/10
                  py-6
                "
              >
                <div
                  className="
                    flex
                    justify-between
                    text-slate-300
                  "
                >
                  <span>
                    Items
                  </span>

                  <span>
                    {
                      CartSummary.totalItems
                    }
                  </span>
                </div>

                <div
                  className="
                    flex
                    justify-between
                    text-slate-300
                  "
                >
                  <span>
                    Subtotal
                  </span>

                  <span>
                    {CartSummary.totalPrice.toFixed(
                      2
                    )}{" "}
                    EGP
                  </span>
                </div>
              </div>

              <div
                className="
                  mb-6
                  flex
                  items-center
                  justify-between
                "
              >
                <span className="font-bold">
                  Total
                </span>

                <span
                  className="
                    text-2xl
                    font-black
                    text-emerald-400
                  "
                >
                  {CartSummary.totalPrice.toFixed(
                    2
                  )}{" "}
                  EGP
                </span>
              </div>

              <button
                // FIX: الزرار كان بدون أي handler — دلوقتي بيروح لصفحة الـ Checkout
                onClick={() => navigate("/Checkout")}
                className="
                  w-full
                  rounded-xl
                  bg-emerald-500
                  px-5
                  py-4
                  font-bold
                  transition
                  hover:bg-emerald-400
                "
              >
                Proceed To Checkout
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}