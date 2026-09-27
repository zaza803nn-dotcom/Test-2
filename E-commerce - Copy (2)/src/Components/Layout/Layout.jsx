import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar/>
      <main className="flex-1">
        <div className="w-full pt-28">
          <Outlet  />
        </div>
      </main>

      <Footer />
    </div>
  );
}