import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";

import {
  ArrowLeft,
  ArrowRight,
  Award,
  Boxes,
  CheckCircle2,
  CircleDollarSign,
  Layers3,
  Package,
  ShoppingBag,
  Star,
  Tag,
  TrendingUp,
} from "lucide-react";

import { useState } from "react";
import { Helmet } from "react-helmet-async";

import Cart from "../Cart/Cart";
// FIX: كان الاستيراد من "../Wishlist/Wishlist" — والملف ده كان بيصدّر زرار القلب،
// دلوقتي اتنقل لملف اسمه صريح: WishlistHeartButton (وفاضل الصفحة الحقيقية في Wishlist.jsx)
import Wishlist from "../Wishlist/WishlistHeartButton";

// ========================================
// API FUNCTION
// ========================================

async function GetProductDetails(id) {
  const response = await axios.get(
    `https://ecommerce.routemisr.com/api/v1/products/${id}`
  );

  return response.data.data;
}

// ========================================
// HELPERS
// ========================================

function formatPrice(price) {
  return new Intl.NumberFormat("en-US").format(price);
}

// ========================================
// PRODUCT DETAILS COMPONENT
// ========================================

export default function ProductDetails() {
  const { id } = useParams();

  const [selectedImage, setSelectedImage] = useState(null);

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => GetProductDetails(id),
    enabled: !!id,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  // ========================================
  // LOADING
  // ========================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] px-4 py-10">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mb-8 h-5 w-32 rounded bg-gray-200" />

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="h-[560px] rounded-[24px] border border-gray-200 bg-white" />

            <div className="space-y-5">
              <div className="h-7 w-32 rounded bg-gray-200" />
              <div className="h-20 w-4/5 rounded bg-gray-200" />
              <div className="h-8 w-40 rounded bg-gray-200" />
              <div className="h-32 rounded bg-gray-200" />
              <div className="h-28 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F7F9] px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
            <Package size={30} />
          </div>

          <h2 className="mb-3 text-2xl font-bold text-gray-800">
            Unable to load product
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            {error?.message || "Something went wrong"}
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0AAD0A] px-5 py-3 font-bold text-white transition hover:bg-[#089208]"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // ========================================
  // PRODUCT NOT FOUND
  // ========================================

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F7F9] text-gray-800">
        Product not found
      </div>
    );
  }

  // ========================================
  // DATA
  // ========================================

  const {
    title,
    description,
    quantity,
    sold,
    price,
    imageCover,
    images = [],
    category,
    brand,
    ratingsAverage,
    ratingsQuantity,
    subcategory = [],
  } = product;

  // ========================================
  // SEO
  // ========================================

  const seoTitle = `${title} | FreshCart`;

  const seoDescription =
    description ||
    `Shop ${title} on FreshCart. View product details, price, ratings and availability.`;

  // ========================================
  // IMAGES
  // ========================================

  const galleryImages = [
    ...new Set([imageCover, ...images].filter(Boolean)),
  ];

  const activeImage =
    selectedImage || galleryImages[0];

  const inStock = quantity > 0;

  // ========================================
  // RETURN
  // ========================================

  return (
    <>
      {/* ========================================
          SEO
      ======================================== */}

      <Helmet>
        <title>{seoTitle}</title>

        <meta
          name="description"
          content={seoDescription}
        />

        <meta
          property="og:title"
          content={seoTitle}
        />

        <meta
          property="og:description"
          content={seoDescription}
        />

        <meta
          property="og:image"
          content={imageCover}
        />

        <meta
          property="og:type"
          content="product"
        />
      </Helmet>

      {/* ========================================
          PAGE
      ======================================== */}

      <div className="min-h-screen bg-[#F6F7F9] text-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          {/* ======================================
              BREADCRUMB
          ====================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-8 flex items-center gap-2 text-sm"
          >
            <Link
              to="/"
              className="text-gray-500 transition hover:text-[#0AAD0A]"
            >
              Home
            </Link>

            <ArrowRight
              size={14}
              className="text-gray-300"
            />

            <Link
              to="/products"
              className="text-gray-500 transition hover:text-[#0AAD0A]"
            >
              Products
            </Link>

            <ArrowRight
              size={14}
              className="text-gray-300"
            />

            <span className="max-w-[250px] truncate font-medium text-[#0AAD0A]">
              {title}
            </span>
          </motion.div>

          {/* ======================================
              HERO
          ====================================== */}

          <div className="grid items-start gap-10 lg:grid-cols-2">

            {/* ====================================
                IMAGE SECTION
            ==================================== */}

            <motion.section
              initial={{
                opacity: 0,
                x: -30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.6,
              }}
            >

              {/* Main Image */}

              <div className="group relative overflow-hidden rounded-[24px] border border-gray-200 bg-white p-4 shadow-sm">

                <div className="relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-[18px] bg-white">

                  <motion.img
                    key={activeImage}
                    initial={{
                      opacity: 0,
                      scale: 0.94,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.35,
                    }}
                    src={activeImage}
                    alt={title}
                    className="relative z-10 max-h-[520px] w-full object-contain p-10 transition duration-700 group-hover:scale-[1.03]"
                  />

                  {/* Stock */}

                  <div className="absolute left-5 top-5 z-20">
                    {inStock ? (
                      <div className="flex items-center gap-2 rounded-full border border-[#0AAD0A]/20 bg-[#0AAD0A]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#089208]">
                        <CheckCircle2 size={15} />
                        In Stock
                      </div>
                    ) : (
                      <div className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-500">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  {/* =================================
                      WISHLIST
                  ================================= */}

                  <Wishlist productId={product._id} />

                </div>
              </div>

              {/* Thumbnails */}

              {galleryImages.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-3">
                  {galleryImages.map((image) => {
                    const active =
                      activeImage === image;

                    return (
                      <motion.button
                        key={image}
                        whileHover={{
                          y: -3,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        type="button"
                        onClick={() =>
                          setSelectedImage(image)
                        }
                        className={`overflow-hidden rounded-2xl border bg-white transition ${active
                            ? "border-[#0AAD0A] shadow-md shadow-[#0AAD0A]/10"
                            : "border-gray-200 hover:border-[#0AAD0A]/40"
                          }`}
                      >
                        <img
                          src={image}
                          alt={title}
                          className="aspect-square w-full object-cover"
                        />
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* =================================
                  BRAND / CATEGORY / SUBCATEGORY
              ================================= */}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                {/* BRAND */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                        Brand
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-gray-900">
                        {brand?.name || "N/A"}
                      </h3>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0AAD0A]/10 text-[#0AAD0A]">
                      <Award size={20} />
                    </div>
                  </div>

                  {brand?.image && (
                    <div className="flex h-28 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50">
                      <img
                        src={brand.image}
                        alt={brand.name}
                        className="max-h-20 max-w-[150px] object-contain"
                      />
                    </div>
                  )}
                </motion.div>

                {/* CATEGORY */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: 0.1,
                  }}
                  className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                        Category
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-gray-900">
                        {category?.name || "N/A"}
                      </h3>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0AAD0A]/10 text-[#0AAD0A]">
                      <ShoppingBag size={20} />
                    </div>
                  </div>

                  {category?.image && (
                    <div className="overflow-hidden rounded-2xl border border-gray-100">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-28 w-full object-cover"
                      />
                    </div>
                  )}
                </motion.div>

                {/* SUBCATEGORY */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: 0.2,
                  }}
                  className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm sm:col-span-2"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                        Subcategory
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-gray-900">
                        Related Categories
                      </h3>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0AAD0A]/10 text-[#0AAD0A]">
                      <Layers3 size={20} />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {subcategory.length > 0 ? (
                      subcategory.map((sub) => (
                        <div
                          key={sub._id}
                          className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                        >
                          <p className="font-semibold text-gray-800">
                            {sub.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {sub.slug}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">
                        No subcategory available
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.section>

            {/* ====================================
                INFO SECTION
            ==================================== */}

            <motion.section
              initial={{
                opacity: 0,
                x: 30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.6,
              }}
            >

              {/* Category / Brand */}

              <div className="mb-5 flex flex-wrap gap-3">
                {category?.name && (
                  <span className="flex items-center gap-2 rounded-full bg-[#0AAD0A]/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#089208]">
                    <Tag size={14} />
                    {category.name}
                  </span>
                )}

                {brand?.name && (
                  <span className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-600">
                    <Award size={14} />
                    {brand.name}
                  </span>
                )}
              </div>

              {/* Title */}

              <h1 className="text-3xl font-black leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                {title}
              </h1>

              {/* Rating */}

              <div className="mt-6 flex items-center gap-3">
                <div className="flex gap-1">
                  {Array.from({
                    length: 5,
                  }).map((_, index) => (
                    <Star
                      key={index}
                      size={18}
                      fill={
                        index <
                          Math.round(
                            ratingsAverage || 0
                          )
                          ? "currentColor"
                          : "transparent"
                      }
                      className={
                        index <
                          Math.round(
                            ratingsAverage || 0
                          )
                          ? "text-[#FFC906]"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>

                <span className="font-bold text-gray-800">
                  {ratingsAverage?.toFixed(1) ||
                    "0.0"}
                </span>

                <span className="text-sm text-gray-500">
                  ({ratingsQuantity || 0} ratings)
                </span>
              </div>

              {/* Divider */}

              <div className="my-7 h-px bg-gray-200" />

              {/* Price */}

              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.25em] text-gray-400">
                  Price
                </p>

                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black text-[#0AAD0A]">
                    {formatPrice(price)}
                  </span>

                  <span className="mb-2 text-lg font-bold text-gray-400">
                    EGP
                  </span>
                </div>
              </div>

              {/* Add to cart */}

              <Cart productId={product._id} />

              {/* Product Description */}

              <div className="mt-10">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0AAD0A]/10">
                    <Package
                      size={18}
                      className="text-[#0AAD0A]"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900">
                      Product Description
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      Everything you need to know about
                      this product
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#0AAD0A]" />

                  <p className="pl-3 text-[15px] leading-8 text-gray-600">
                    {description ||
                      "No description available for this product."}
                  </p>
                </div>
              </div>

              {/* Stats */}

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard
                  icon={<Boxes size={18} />}
                  label="Stock"
                  value={quantity}
                />

                <StatCard
                  icon={<TrendingUp size={18} />}
                  label="Sold"
                  value={sold}
                />

                <StatCard
                  icon={<Star size={18} />}
                  label="Rating"
                  value={
                    ratingsAverage?.toFixed(1) ||
                    "0"
                  }
                />
              </div>
            </motion.section>
          </div>

          {/* ======================================
              PRODUCT INFORMATION
          ====================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="mt-10 rounded-[24px] border border-[#0AAD0A]/15 bg-[#0AAD0A]/5 p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <InfoCard
                icon={<Package size={19} />}
                label="Available Quantity"
                value={`${quantity} units`}
              />

              <InfoCard
                icon={<TrendingUp size={19} />}
                label="Sold"
                value={`${sold} units`}
              />

              <InfoCard
                icon={<Star size={19} />}
                label="Ratings"
                value={`${ratingsQuantity || 0}`}
              />

              <InfoCard
                icon={<CircleDollarSign size={19} />}
                label="Price"
                value={`${formatPrice(price)} EGP`}
              />
            </div>
          </motion.div>

          {/* ======================================
              BOTTOM
          ====================================== */}

          <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
            <p className="text-xs text-gray-400"></p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-xl border border-[#0AAD0A]/20 bg-[#0AAD0A]/5 px-5 py-3 text-sm font-bold text-[#0AAD0A] transition hover:bg-[#0AAD0A]/10"
            >
              <ArrowLeft size={17} />
              Back
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// ========================================
// STAT CARD
// ========================================

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#0AAD0A]/10 text-[#0AAD0A]">
        {icon}
      </div>

      <p className="text-xs uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-gray-900">
        {value}
      </p>
    </div>
  );
}

// ========================================
// INFO CARD
// ========================================

function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0AAD0A]/10 text-[#0AAD0A]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-bold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}