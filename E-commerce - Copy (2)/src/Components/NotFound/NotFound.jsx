import ImgNotFound from "../../assets/error.svg";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <img
        src={ImgNotFound}
        alt="Page Not Found"
        className="w-full max-w-lg"
      />
    </main>
  );
}