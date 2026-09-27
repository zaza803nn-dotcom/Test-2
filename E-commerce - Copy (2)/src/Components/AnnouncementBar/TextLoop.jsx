// FIX: import React كان unused (Vite + jsx runtime مش محتاجه) — اتشال

const TextLoop = ({
  text = "React ✦ Bits",
  speed = 30, // السرعة بالثواني للدورة الواحدة
  direction = "reverse",
  separator = "★",
  fontSize = 14,
  fontWeight = 600,
  color = "#ffffff",
  ribbonColor = "#0bae43",
  ribbonHeight = 40,
  pauseOnHover = false,
  className = "",
  style = {},
}) => {
  const content = `${text} ${separator} `;

  return (
    <div
      className={`w-full overflow-hidden flex items-center select-none ${className}`}
      style={{
        backgroundColor: ribbonColor,
        height: `${ribbonHeight}px`,
        ...style,
      }}
    >
      <div
        className={`flex whitespace-nowrap min-w-full ${
          pauseOnHover ? "hover:[animation-play-state:paused]" : ""
        }`}
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: direction === "reverse" ? "reverse" : "normal",
        }}
      >
        <span
          className="flex items-center shrink-0"
          style={{
            fontSize: `${fontSize}px`,
            fontWeight,
            color,
          }}
        >
          {content.repeat(8)}
        </span>
        <span
          className="flex items-center shrink-0"
          style={{
            fontSize: `${fontSize}px`,
            fontWeight,
            color,
          }}
        >
          {content.repeat(8)}
        </span>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default TextLoop;