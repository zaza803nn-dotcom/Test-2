import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  Tag,
} from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

async function GetAllCategories() {
  const { data } = await axios.get(
    "https://ecommerce.routemisr.com/api/v1/categories"
  );

  return data;
}

async function GetAllSubCategories() {
  const { data } = await axios.get(
    "https://ecommerce.routemisr.com/api/v1/subcategories?limit=100"
  );

  return data;
}

export default function CategoryTree({
  selectedCategory,
  selectedSubCategory,
  onCategoryChange,
  onSubCategoryChange,
}) {
  const [openCategory, setOpenCategory] = useState(null);

  // ==============================
  // GET CATEGORIES
  // ==============================

  const { data: categoriesData } = useQuery({
    queryKey: ["Categorie"],
    queryFn: GetAllCategories,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // ==============================
  // GET ALL SUB CATEGORIES
  // ==============================

  const { data: subCategoriesData, isLoading } = useQuery({
    queryKey: ["AllSubCategories"],
    queryFn: GetAllSubCategories,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const categories = categoriesData?.data || [];
  const allSubCategories = subCategoriesData?.data || [];

  // ==============================
  // OPEN CATEGORY
  // ==============================

  const handleCategoryClick = (categoryId) => {
    if (openCategory === categoryId) {
      setOpenCategory(null);
      return;
    }

    setOpenCategory(categoryId);

    onCategoryChange(categoryId);
    onSubCategoryChange(null);
  };

  // ==============================
  // UI
  // ==============================

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

      {/* HEADER */}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">
          Categories
        </h2>

        {(selectedCategory || selectedSubCategory) && (
          <button
            onClick={() => {
              setOpenCategory(null);
              onCategoryChange(null);
              onSubCategoryChange(null);
            }}
            className="text-xs font-semibold text-purple-600 hover:text-purple-800"
          >
            Clear
          </button>
        )}
      </div>

      {/* ALL PRODUCTS */}

      <button
        onClick={() => {
          setOpenCategory(null);
          onCategoryChange(null);
          onSubCategoryChange(null);
        }}
        className={`mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
          !selectedCategory && !selectedSubCategory
            ? "bg-purple-100 font-bold text-purple-700"
            : "hover:bg-gray-100"
        }`}
      >
        <Folder size={18} />

        <span>All Products</span>
      </button>

      {/* CATEGORY TREE */}

      <div className="space-y-1">
        {categories.map((category) => {
          const isOpen = openCategory === category._id;

          const isSelected =
            selectedCategory === category._id;

          // ==============================
          // IMPORTANT
          // FILTER USING CATEGORY ID
          // ==============================

          const categorySubCategories =
            allSubCategories.filter(
              (subCategory) =>
                subCategory.category === category._id
            );

          return (
            <div key={category._id}>

              {/* CATEGORY */}

              <button
                onClick={() =>
                  handleCategoryClick(category._id)
                }
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left transition ${
                  isSelected
                    ? "bg-purple-100 font-bold text-purple-700"
                    : "hover:bg-gray-100"
                }`}
              >
                {isOpen ? (
                  <ChevronDown size={17} />
                ) : (
                  <ChevronRight size={17} />
                )}

                <Folder size={18} />

                <span className="flex-1">
                  {category.name}
                </span>
              </button>

              {/* SUB CATEGORIES */}

              {isOpen && (
                <div className="ml-5 border-l-2 border-gray-100 pl-3">

                  {isLoading ? (
                    <p className="px-3 py-2 text-sm text-gray-400">
                      Loading...
                    </p>
                  ) : categorySubCategories.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-gray-400">
                      No sub categories
                    </p>
                  ) : (
                    categorySubCategories.map(
                      (subCategory) => (
                        <button
                          key={subCategory._id}
                          onClick={() => {
                            onCategoryChange(
                              category._id
                            );

                            onSubCategoryChange(
                              subCategory._id
                            );
                          }}
                          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                            selectedSubCategory ===
                            subCategory._id
                              ? "bg-purple-50 font-semibold text-purple-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-purple-600"
                          }`}
                        >
                          <Tag size={15} />

                          <span>
                            {subCategory.name}
                          </span>
                        </button>
                      )
                    )
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}