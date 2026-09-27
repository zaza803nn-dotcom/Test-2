
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import './App.css'
import Layout from './Components/Layout/Layout'
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import ProductDetails from './pages/Products/ProductDetails';
import Addresses from './pages/Addresses/Addresses';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ResetPassword from './pages/Auth/ResetPassword';
import VerifyResetCode from './pages/Auth/VerifyResetCode';
import Brands from './pages/Brands/Brands';
import BrandDetails from './pages/Brands/BrandDetails';
import Categories from './pages/Categories/Categories';
import CategoryDetails from './pages/Categories/CategoryDetails';
import Checkout from './pages/Checkout/Checkout';
import PaymentSuccess from './pages/Checkout/PaymentSuccess';
import Orders from './pages/Orders/Orders';
import OrderDetails from './pages/Orders/OrderDetails';
import ChangePassword from './pages/Profile/ChangePassword';
import Profile from './pages/Profile/Profile';
import UpdateProfile from './pages/Profile/UpdateProfile';

import Wishlist from './pages/Wishlist/Wishlist';
import NotFound from './Components/NotFound/NotFound';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from "react-helmet-async";
import { store } from "./Redux/store";
import CartPage from './pages/Cart/CartPage';
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import SubCategory from './pages/Categories/SubCategory';

// ========================================
// FIX (أداء/أمان): كان الـ queryClient و createBrowserRouter
// جوه App component — يعني بيتعملوا من جديد مع كل render.
// الحل: اتنقلوا هنا فوق المكون (مرة واحدة لكل عمر الـ app).
// ========================================

const queryClient = new QueryClient();

function App() {
// FIX: كان جوه المكون: const queryClient = new QueryClient() و const Routes = createBrowserRouter([...])
// — كلاهما بيتعمل من جديد مع كل render، وده anti-pattern في ردّ-كويري وراوتر-دوم.
// الحل: اتنقلوا خارج المكون.
const Routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,

    children: [
      // ================= PUBLIC ROUTES =================

      {
        index: true,
        element: <Home />,
      },

      {
        path: "Products",
        element: <Products />,
      },

      {
        path: "ProductDetails/:id",
        element: <ProductDetails />,
      },

      {
        path: "ForgotPassword",
        element: <ForgotPassword />,
      },

      {
        path: "Login",
        element: <Login />,
      },

      {
        path: "Register",
        element: <Register />,
      },

      {
        path: "ResetPassword",
        element: <ResetPassword />,
      },

      {
        path: "VerifyResetCode",
        element: <VerifyResetCode />,
      },

      {
        path: "Brands",
        element: <Brands />,
      },

      {
        path: "BrandDetails/:id",
        element: <BrandDetails />,
      },

      {
        path: "Categories",
        element: <Categories />,
      },

      {
        path: "CategoryDetails/:id",
        element: <CategoryDetails />,
      },
      {
  path: "SubCategory/:id",
  element: <SubCategory />,
},

      // ================= PROTECTED ROUTES =================

      {
        element: <ProtectedRoute />,

        children: [
          {
            path: "Addresses",
            element: <Addresses />,
          },

          {
            path: "Profile",
            element: <Profile />,
          },

          {
            path: "UpdateProfile",
            element: <UpdateProfile />,
          },

          {
            path: "Wishlist",
            element: <Wishlist />,
          },

          {
            path: "Cart",
            element: <CartPage />,
          },

          {
            path: "ChangePassword",
            element: <ChangePassword />,
          },

          {
            path: "Checkout",
            element: <Checkout />,
          },

          {
            path: "PaymentSuccess",
            element: <PaymentSuccess />,
          },

          {
            path: "Orders",
            element: <Orders />,
          },

          {
            path: "OrderDetails/:id",
            element: <OrderDetails />,
          },
        ],
      },

      // ================= NOT FOUND =================

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);





 return (
  <HelmetProvider>

    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
      <RouterProvider router={Routes} />
      <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#ffffff",
                color: "#1a1d21",
                border: "1px solid #e4e7e5",
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                boxShadow: "0 4px 16px rgba(26, 29, 33, 0.08)",
              },
              success: {
                iconTheme: {
                  primary: "#0d9488",
                  secondary: "#ffffff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#dc2626",
                  secondary: "#ffffff",
                },
              },
            }}
          />
          </Provider>
    </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App
