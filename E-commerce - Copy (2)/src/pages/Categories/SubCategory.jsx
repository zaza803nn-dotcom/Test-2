import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

async function GetAllProducts() {
  const { data } = await axios.get(
    "https://ecommerce.routemisr.com/api/v1/products?limit=100"
  );

  return data;
}

export default function SubCategory() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["SubCategoryProducts", id],
    queryFn: GetAllProducts,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const products =
    data?.data?.filter((product) =>
      product.subcategory?.some((sub) => sub._id === id)
    ) || [];

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Products</h1>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {products.map((product) => (
          <div key={product._id} className="rounded-xl border p-4">
            <img
              src={product.imageCover}
              alt={product.title}
              className="mb-3 h-52 w-full object-contain"
            />

            <h2 className="line-clamp-2 font-semibold">
              {product.title}
            </h2>

            <p className="mt-2 font-bold">{product.price} EGP</p>
          </div>
        ))}
      </div>
    </div>
  );
}