import {  useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

async function GetSubCategories(id) {
  const { data } = await axios.get(
    `https://ecommerce.routemisr.com/api/v1/categories/${id}/subcategories`
  );

  return data;
}

export default function CategoryDetails() {
  
  const { id } = useParams();
const Navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["subCategories", id],
    queryFn: () => GetSubCategories(id),
    enabled: !!id,
    staleTime: Infinity,
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-5">
      <h1 className="mb-5 text-2xl font-bold">Sub Categories</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {data?.data?.map((subCategory) => (
         <div
  onClick={() => Navigate(`/SubCategory/${subCategory._id}`)}
  className="cursor-pointer rounded-xl border p-4 transition hover:-translate-y-1 hover:shadow-md"
>
  {subCategory.name}
</div>
        ))}
      </div>
    </div>
  );
}