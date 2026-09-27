import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Autoplay } from "swiper/modules";

import image1 from "../../assets/slider-image-1.jpeg";
import image2 from "../../assets/slider-image-2.jpeg";
import image3 from "../../assets/slider-image-3.jpeg";

import banner1 from "../../assets/grocery-banner1.jpg";
import banner2 from "../../assets/grocery-banner2.jpg";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

export default function Slider() {
  const ImgeSlider = [image1, image2, image3];

  return (
   <section className="w-full py-8 ">
  <div className="grid h-[500px] w-full grid-cols-1 gap-5 lg:grid-cols-[7fr_3fr]">

    {/* LEFT 70% */}
    <div className="min-w-0 overflow-hidden rounded-2xl">
      <Swiper
        effect="fade"
        pagination={{
          clickable: true,
        }}
        loop={true}
        autoplay={{
          delay: 1500,
          disableOnInteraction: false,
        }}
        modules={[EffectFade, Pagination, Autoplay]}
        className="h-full w-full"
      >
        {ImgeSlider.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>

    {/* RIGHT 30% */}
    <div className="grid min-h-0 grid-rows-2 gap-5">

      {/* BANNER 1 */}
      <div className="group relative min-h-0 overflow-hidden rounded-2xl">
        <img
          src={banner1}
          alt="Featured products"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute bottom-0 left-0 p-4 text-white">
          <p className="text-xs font-medium uppercase tracking-wider">
            Featured
          </p>

          <h2 className="mt-1 text-lg font-bold">
            New Arrivals
          </h2>
        </div>
      </div>

      {/* BANNER 2 */}
      <div className="group relative min-h-0 overflow-hidden rounded-2xl">
        <img
          src={banner2}
          alt="Special offers"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute bottom-0 left-0 p-4 text-white">
          <p className="text-xs font-medium uppercase tracking-wider">
            Special Offer
          </p>

          <h2 className="mt-1 text-lg font-bold">
            Up To 50% Off
          </h2>
        </div>
      </div>

    </div>
  </div>
</section>
  );
}