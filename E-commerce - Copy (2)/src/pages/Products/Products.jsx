import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Oval } from "react-loader-spinner";
import { useMemo, useState } from "react";

import {
  Star,
  ArrowRight,
  Search,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import Cart from "../Cart/Cart";
import Wishlist from "../Wishlist/WishlistHeartButton";
import CategoryTree from "./CategoryTree";

// ========================================
// GET ALL PRODUCTS
// ========================================

async function GetAllProdact() {
  return await axios.get(
    "https://ecommerce.routemisr.com/api/v1/products?limit=100"
  );
}

// ========================================
// PRODUCTS
// ========================================

export default function Products() {
  // ======================================
  // FILTER STATES
  // ======================================

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  // ======================================
  // GET PRODUCTS
  // ======================================

  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: ["Prodact"],
    queryFn: GetAllProdact,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const ProductsData = data?.data?.data || [];

  // ======================================
  // DISCOUNT
  // ======================================

  const getDiscount = (id) => {
    let total = 0;

    for (let i = 0; i < id.length; i++) {
      total += id.charCodeAt(i);
    }

    return (total % 21) + 10;
  };

  // ======================================
  // PRODUCTS WITH DISCOUNT
  // ======================================

  const ProductsWithDiscount = useMemo(() => {
    return ProductsData.map((product) => {
      const discount = getDiscount(product._id);

      const newPrice = Math.round(
        product.price -
          (product.price * discount) / 100
      );

      return {
        ...product,
        discount,
        newPrice,
      };
    });
  }, [ProductsData]);

  // ======================================
  // SEARCH + CATEGORY FILTER
  // ======================================

  const FilteredProducts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return ProductsWithDiscount.filter((product) => {
      // ================================
      // SEARCH
      // ================================

      const matchesSearch =
        !searchValue ||
        product.title?.toLowerCase().includes(searchValue) ||
        product.category?.name
          ?.toLowerCase()
          .includes(searchValue) ||
        product.brand?.name
          ?.toLowerCase()
          .includes(searchValue) ||
        product.subcategory?.some((sub) =>
          sub.name?.toLowerCase().includes(searchValue)
        );

      // ================================
      // CATEGORY
      // ================================

      const matchesCategory =
        !selectedCategory ||
        product.category?._id === selectedCategory;

      // ================================
      // SUB CATEGORY
      // ================================

      const matchesSubCategory =
        !selectedSubCategory ||
        product.subcategory?.some(
          (sub) => sub._id === selectedSubCategory
        );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubCategory
      );
    });
  }, [
    ProductsWithDiscount,
    search,
    selectedCategory,
    selectedSubCategory,
  ]);

  // ======================================
  // LOADING
  // ======================================

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed inset-0 z-50 flex select-none flex-col items-center justify-center bg-gray-950/90 backdrop-blur-md"
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-amber-400/20 blur-2xl" />

          <Oval
            height={80}
            width={80}
            color="#facc15"
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#374151"
            strokeWidth={4}
            strokeWidthSecondary={4}
          />
        </div>

        <p className="mt-6 animate-pulse text-xl font-semibold tracking-wide text-gray-200">
          Loading...
        </p>

        <span className="sr-only">
          Loading content, please wait...
        </span>
      </div>
    );
  }

  // ======================================
  // UI
  // ======================================

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">

      {/* ====================================
          SEARCH BAR
      ==================================== */}

      <div className="mb-8">
        <div className="relative mx-auto max-w-3xl">

          <Search
            size={21}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, categories, brands..."
            className="
              w-full
              rounded-2xl
              border border-gray-200
              bg-white
              py-4
              pl-12
              pr-12
              text-gray-800
              shadow-sm
              outline-none
              transition-all
              focus:border-purple-500
              focus:ring-2
              focus:ring-purple-100
            "
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                transition
                hover:text-gray-700
              "
              aria-label="Clear search"
            >
              <X size={19} />
            </button>
          )}
        </div>
      </div>

      {/* ====================================
          FILTER + PRODUCTS
      ==================================== */}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">

        {/* ==================================
            CATEGORY TREE
        ================================== */}

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <CategoryTree
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            onCategoryChange={setSelectedCategory}
            onSubCategoryChange={setSelectedSubCategory}
          />
        </aside>

        {/* ==================================
            PRODUCTS
        ================================== */}

        <section>

          {/* HEADER */}

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Products
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {FilteredProducts.length} products found
              </p>
            </div>

            {/* ACTIVE FILTERS */}

            {(selectedCategory ||
              selectedSubCategory ||
              search) && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory(null);
                  setSelectedSubCategory(null);
                }}
                className="
                  rounded-xl
                  border border-gray-200
                  bg-white
                  px-4 py-2
                  text-sm font-semibold
                  text-gray-600
                  transition
                  hover:border-red-200
                  hover:bg-red-50
                  hover:text-red-600
                "
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* ==================================
              NO PRODUCTS
          ================================== */}

          {FilteredProducts.length === 0 ? (
            <div
              className="
                flex min-h-[350px]
                flex-col items-center
                justify-center
                rounded-2xl
                border border-dashed
                border-gray-300
                bg-gray-50
                text-center
              "
            >
              <Search
                size={48}
                className="mb-4 text-gray-300"
              />

              <h3 className="text-xl font-bold text-gray-700">
                No Products Found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try another search or change your filters.
              </p>
            </div>
          ) : (

            /* ==================================
               PRODUCTS GRID
            ================================== */

            <div
              className="
                grid
                w-full
                grid-cols-[repeat(auto-fill,minmax(250px,1fr))]
                gap-6
              "
            >
              {FilteredProducts.map((Product) => {

                const {
                  ratingsQuantity,
                  imageCover,
                  price,
                  ratingsAverage,
                  title,
                  category: {
                    name: categoryName,
                  },
                  discount,
                  newPrice,
                } = Product;

                return (
                  <div
                    key={Product._id}
                    className="
                      group
                      flex
                      w-full
                      flex-col
                      overflow-hidden
                      rounded-2xl
                      border
                      border-gray-200
                      bg-white
                      shadow-sm
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-xl
                    "
                  >

                    {/* ==========================
                        IMAGE
                    ========================== */}

                    <div
                      className="
                        relative
                        h-64
                        shrink-0
                        overflow-hidden
                        bg-gray-100
                        sm:h-72
                      "
                    >

                      {/* SALE */}

                      <span
                        className="
                          absolute
                          left-4
                          top-4
                          z-10
                          rounded-lg
                          bg-red-500
                          px-3
                          py-1.5
                          text-xs
                          font-bold
                          text-white
                          shadow-md
                        "
                      >
                        -{discount}%
                      </span>

                      {/* WISHLIST */}

                      <Wishlist
                        productId={Product._id}
                      />

                      {/* PRODUCT IMAGE */}

                      <img
                        src={imageCover}
                        alt={title}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-700
                          ease-out
                          group-hover:scale-110
                        "
                      />

                      {/* OVERLAY */}

                      <div
                        className="
                          pointer-events-none
                          absolute
                          inset-0
                          bg-black/0
                          transition-all
                          duration-500
                          group-hover:bg-black/5
                        "
                      />
                    </div>

                    {/* ==========================
                        CONTENT
                    ========================== */}

                    <div className="flex flex-1 flex-col p-5">

                      {/* CATEGORY */}

                      <p
                        className="
                          mb-2
                          text-xs
                          font-bold
                          uppercase
                          tracking-wider
                          text-purple-600
                        "
                      >
                        {categoryName}
                      </p>

                      {/* TITLE */}

                      <h3
                        className="
                          mb-3
                          line-clamp-2
                          min-h-[50px]
                          text-lg
                          font-semibold
                          text-gray-900
                          transition-colors
                          duration-300
                          group-hover:text-purple-600
                        "
                      >
                        {title}
                      </h3>

                      {/* RATING */}

                      <div className="mb-5 flex items-center gap-2">

                        <div className="flex items-center gap-1">

                          <Star
                            size={17}
                            strokeWidth={2}
                            className="fill-yellow-400 text-yellow-400"
                          />

                          <span className="text-sm font-bold text-gray-800">
                            {ratingsAverage}
                          </span>

                        </div>

                        <span className="text-sm text-gray-400">
                          ({ratingsQuantity})
                        </span>
                      </div>

                      {/* ==========================
                          BOTTOM
                      ========================== */}

                      <div className="mt-auto space-y-3">

                        {/* PRICE + CART */}

                        <div className="flex items-end gap-3">

                          {/* PRICE */}

                          <div className="min-w-0 flex-1">

                            <div className="flex items-baseline gap-1">
                              <span className="text-sm font-bold text-gray-700">
                                EGP
                              </span>

                              <span className="text-xl font-extrabold text-gray-900">
                                {newPrice.toLocaleString()}
                              </span>
                            </div>

                            <div className="flex items-baseline gap-1">
                              <span className="text-xs text-gray-400">
                                EGP
                              </span>

                              <span className="text-sm text-gray-400 line-through">
                                {price.toLocaleString()}
                              </span>
                            </div>

                          </div>

                          {/* CART */}

                          <div className="w-[140px] shrink-0">
                            <Cart
                              productId={Product._id}
                            />
                          </div>

                        </div>

                        {/* VIEW DETAILS */}

                        <Link
                          to={`/ProductDetails/${Product._id}`}
                          className="
                            group/details
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-gray-200
                            bg-gray-50
                            px-4
                            py-3
                            text-sm
                            font-semibold
                            text-gray-700
                            transition-all
                            duration-300
                            hover:border-purple-600
                            hover:bg-purple-600
                            hover:text-white
                          "
                        >
                          <span>
                            View Details
                          </span>

                          <ArrowRight
                            size={17}
                            strokeWidth={2}
                            className="
                              transition-transform
                              duration-300
                              group-hover/details:translate-x-1
                            "
                          />
                        </Link>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}