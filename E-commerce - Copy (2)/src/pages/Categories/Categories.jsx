import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

async function GetAllCategories() {
  const { data } = await axios.get(
    "https://ecommerce.routemisr.com/api/v1/categories"
  );

  return data;
}

export default function Categories() {
  const navigate = useNavigate();

  const { data: CategoriesData, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: GetAllCategories,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  if (isLoading || !CategoriesData?.data?.length) {
    return null;
  }

  return (
    <div className="w-full py-6">
      <Swiper
        slidesPerView={5}
        spaceBetween={20}
        loop={true}
        speed={5000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        allowTouchMove={true}
        modules={[Autoplay]}
        className="w-full"
        breakpoints={{
          0: {
            slidesPerView: 1.25,
            spaceBetween: 14,
            centeredSlides: true,
          },
          480: {
            slidesPerView: 1.5,
            spaceBetween: 16,
            centeredSlides: true,
          },
          640: {
            slidesPerView: 2.5,
            spaceBetween: 18,
            centeredSlides: false,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
            centeredSlides: false,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 22,
            centeredSlides: false,
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 24,
            centeredSlides: false,
          },
        }}
      >
        {CategoriesData.data.map((category) => (
          <SwiperSlide key={category._id}>
            <div
              onClick={() => navigate(`/CategoryDetails/${category._id}`)}
              className="group relative h-52 w-full cursor-pointer overflow-hidden rounded-2xl bg-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-base font-bold text-white sm:text-lg">
                  {category.name}
                </h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}