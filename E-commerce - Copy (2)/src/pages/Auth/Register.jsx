import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import * as Zod from "zod";

const SIGNUP_URL = "https://ecommerce.routemisr.com/api/v1/auth/signup";

const Schema = Zod.object({
  name: Zod.string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be 20 characters or less"),
  email: Zod.string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: Zod.string().min(6, "Password must be at least 6 characters"),
  rePassword: Zod.string().min(1, "Please confirm your password"),
  phone: Zod.string().regex(
    /^01[0125][0-9]{8}$/,
    "Enter a valid Egyptian phone number (01XXXXXXXXX)"
  ),
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords do not match",
  path: ["rePassword"],
});

function Field({ id, label, error, registration, ...inputProps }) {
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
        <p role="alert" className="mt-1.5 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(Schema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values) => axios.post(SIGNUP_URL, values),
    onSuccess: () => {
      toast.success("Account created successfully.");
      navigate("/Home");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    },
  });

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900 sm:text-3xl">
        Register now
      </h1>

      <form
        noValidate
        className="space-y-4"
        onSubmit={handleSubmit((values) => mutate(values))}
      >
        <Field
          id="name"
          label="Name"
          type="text"
          autoComplete="name"
          placeholder="Mostafa Ibrahim"
          error={errors.name}
          registration={register("name")}
        />

        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="name@gmail.com"
          error={errors.email}
          registration={register("email")}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.password}
            registration={register("password")}
          />
          <Field
            id="rePassword"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.rePassword}
            registration={register("rePassword")}
          />
        </div>

        <Field
          id="phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          placeholder="01012345678"
          error={errors.phone}
          registration={register("phone")}
        />

        <div className="flex flex-col gap-4 pt-2 sm:flex-row-reverse sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-[#0aad0a] px-6 py-2.5 font-medium text-white transition hover:bg-[#098f09] focus:outline-none focus:ring-2 focus:ring-green-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isPending ? "Creating account..." : "Register"}
          </button>

          <p className="text-center text-sm text-gray-600 sm:text-left">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#0aad0a] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}