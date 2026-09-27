import TextLoop from "./TextLoop";

export default function AnnouncementBar() {
  return (
    <div className="w-full overflow-hidden">
      <TextLoop
        text="⚡ Flash Sale — Up To 50% OFF ★ 🚚 Free Shipping Over 500 EGP ★ 🔒 Secure Payment ★ ↩️ Easy Returns ★ 🎁 Exclusive Deals Every Day ★ ✨ New Arrivals ★ 💳 Multiple Payment Methods ★ 🏷️ Special Offers"
        speed={35} // كل ما قل الرقم زادت السرعة
        direction="reverse"
        fontSize={14}
        fontWeight={600}
        ribbonColor="#0bae43"
        color="#ffffff"
        ribbonHeight={38}
        pauseOnHover={true}
      />
    </div>
  );
}