import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";

import axios from "axios";

import { useForm } from "react-hook-form";

import toast from "react-hot-toast";

import { Link, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import * as Zod from "zod";

// FIX: كان import من "../../Rudex/AuthenticationSlice" — الفولدر كان مكتوب غلط (Rudex) واتبسط لـ Redux
// كمان من غير التخزين في localStorage جوه الـ reducer — بقى عندنا
// helper واحد saveAuthToStorage بيُنادى بيه هنا مرة واحدة
import {
  setCredentials,
  saveAuthToStorage,
} from "../../Redux/AuthenticationSlice";

const SIGNIN_URL =
  "https://ecommerce.routemisr.com/api/v1/auth/signin";

const Schema = Zod.object({
  email: Zod.string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: Zod.string().min(1, "Password is required"),
});

function Field({
  id,
  label,
  error,
  registration,
  ...inputProps
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <input
        id={id}
        aria-invalid={!!error}
        className={`w-full rounded-lg border px-4 py-2.5 text-gray-900 outline-none transition focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:border-[#0aad0a] focus:ring-green-200"
        }`}
        {...registration}
        {...inputProps}
      />

      {error && (
        <p
          role="alert"
          className="mt-1.5 text-sm text-red-600"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(Schema),
    mode: "onTouched",

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values) =>
      axios.post(SIGNIN_URL, values),

    onSuccess: ({ data }) => {
      // FIX (تكرار التخزين): كان هنا localStorage.setItem("token") + setItem("user")
      // يدويًا، وبعدين dispatch(setCredentials) اللي كان بيكرر نفس الكتابة
      // جوه الـ reducer (side effect غلط في Redux).
      // الحل: كتابة واحدة في localStorage عن طريق helper، وبعدين dispatch صرف.
      saveAuthToStorage({
        user: data.user,
        token: data.token,
      });

      dispatch(
        setCredentials({
          user: data.user,
          token: data.token,
        })
      );

      toast.success("Welcome back!");

      navigate("/");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    },
  });

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-10">

      <h1 className="mb-6 text-2xl font-semibold text-gray-900 sm:text-3xl">
        Login now
      </h1>

      <form
        noValidate
        className="space-y-4"
        onSubmit={handleSubmit((values) => mutate(values))}
      >

        {/* ================= EMAIL ================= */}

        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="name@gmail.com"
          error={errors.email}
          registration={register("email")}
        />

        {/* ================= PASSWORD ================= */}

        <Field
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password}
          registration={register("password")}
        />

        {/* ================= LOGIN BUTTON ================= */}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-[#0aad0a] px-6 py-2.5 font-medium text-white transition hover:bg-[#098f09] focus:outline-none focus:ring-2 focus:ring-green-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isPending ? "Signing in..." : "Login"}
          </button>
        </div>

        {/* ================= LINKS ================= */}

        <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 text-center text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between sm:text-left">

          <Link
            to="/ForgotPassword"
            className="font-semibold text-[#0aad0a] hover:underline"
          >
            Forgot your password?
          </Link>

          {/* ================= REGISTER ================= */}

          {/* FIX (مكان زرار الـ Register): زرار الـ Register كان في الـ Navbar —
              اتنقل هنا (صفحة الـ Login) كمدخل واحد لإنشاء الأكونت:
              "لو معندهاش اكونت → اعمل اكونت". استبدلنا اللينك البسيط
              بـ button واضح بنفس ستايل زرار الـ Login. */}
          <Link
            to="/Register"
            className="rounded-lg border-2 border-[#0aad0a] px-6 py-2 text-center font-medium text-[#0aad0a] transition hover:bg-[#0aad0a] hover:text-white sm:w-auto"
          >
            Create an account →
          </Link>

        </div>

      </form>
    </section>
  );
}