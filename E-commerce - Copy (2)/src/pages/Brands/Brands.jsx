import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Oval } from "react-loader-spinner";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

// ========================================
// GET ALL BRANDS
// ========================================

async function GetAllBrands() {
  const { data } = await axios.get(
    "https://ecommerce.routemisr.com/api/v1/brands"
  );

  return data;
}

// ========================================
// BRANDS
// ========================================

export default function Brands() {
  const [search, setSearch] = useState("");

  // ======================================
  // GET BRANDS
  // ======================================

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["Brands"],
    queryFn: GetAllBrands,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const BrandsData = data?.data || [];

  // ======================================
  // SEARCH
  // ======================================

  const FilteredBrands = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return BrandsData;
    }

    return BrandsData.filter((brand) =>
      brand.name?.toLowerCase().includes(value)
    );
  }, [BrandsData, search]);

  // ======================================
  // LOADING
  // ======================================

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-950/90 backdrop-blur-md">
        <Oval
          height={80}
          width={80}
          color="#facc15"
          visible={true}
          ariaLabel="brands-loading"
          secondaryColor="#374151"
          strokeWidth={4}
          strokeWidthSecondary={4}
        />

        <p className="mt-6 animate-pulse text-xl font-semibold text-gray-200">
          Loading Brands...
        </p>
      </div>
    );
  }

  // ======================================
  // ERROR
  // ======================================

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Something went wrong
          </h2>

          <p className="mt-2 text-gray-500">
            Failed to load brands.
          </p>
        </div>
      </div>
    );
  }

  // ======================================
  // UI
  // ======================================

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">

      {/* ====================================
          HEADER
      ==================================== */}

      <div className="mb-8">
        <div className="mb-2 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Brands
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Discover your favorite brands
            </p>
          </div>

          <span className="hidden rounded-full bg-purple-50 px-4 py-2 text-sm font-bold text-purple-600 sm:block">
            {FilteredBrands.length} Brands
          </span>
        </div>
      </div>

      {/* ====================================
          SEARCH
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
            placeholder="Search brands..."
            className="
              w-full
              rounded-2xl
              border
              border-gray-200
              bg-white
              py-4
              pl-12
              pr-12
              text-gray-800
              shadow-sm
              outline-none
              transition-all
              duration-300
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
          RESULTS COUNT
      ==================================== */}

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          {search ? "Search Results" : "All Brands"}
        </h2>

        <span className="text-sm text-gray-500 sm:hidden">
          {FilteredBrands.length} Brands
        </span>
      </div>

      {/* ====================================
          NO RESULTS
      ==================================== */}

      {FilteredBrands.length === 0 ? (
        <div
          className="
            flex
            min-h-[350px]
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
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
            No Brands Found
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Try another brand name.
          </p>

          {search && (
            <button
              onClick={() => setSearch("")}
              className="
                mt-5
                rounded-xl
                bg-purple-600
                px-5
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-purple-700
              "
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (

        /* ====================================
           BRANDS GRID
        ==================================== */

        <div
          className="
            grid
            grid-cols-2
            gap-4
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
          "
        >
          {FilteredBrands.map((brand) => (
            <div
              key={brand._id}
              className="
                group
                relative
                flex
                min-h-[190px]
                cursor-pointer
                flex-col
                items-center
                justify-center
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-purple-200
                hover:shadow-xl
              "
            >
              {/* IMAGE */}

              <div
                className="
                  flex
                  h-28
                  w-28
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-2xl
                  bg-gray-50
                  p-4
                  transition-transform
                  duration-500
                  group-hover:scale-105
                "
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="
                    h-full
                    w-full
                    object-contain
                    transition-transform
                    duration-500
                    group-hover:scale-110
                  "
                />
              </div>

              {/* NAME */}

              <h3
                className="
                  mt-5
                  line-clamp-1
                  text-center
                  text-base
                  font-bold
                  text-gray-800
                  transition-colors
                  duration-300
                  group-hover:text-purple-600
                "
              >
                {brand.name}
              </h3>

              {/* SLUG */}

              {brand.slug && (
                <p className="mt-1 line-clamp-1 text-xs text-gray-400">
                  {brand.slug}
                </p>
              )}

              {/* HOVER LINE */}

              <div
                className="
                  absolute
                  bottom-0
                  left-1/2
                  h-1
                  w-0
                  -translate-x-1/2
                  rounded-t-full
                  bg-purple-600
                  transition-all
                  duration-300
                  group-hover:w-16
                "
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}