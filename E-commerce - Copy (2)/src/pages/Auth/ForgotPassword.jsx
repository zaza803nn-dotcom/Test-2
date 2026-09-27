import axios from "axios";
import { AnimatePresence, motion } from "motion/react";import { Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    mutate: forgotPassword,
    isPending,
  } = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords",
        {
          email: data.email,
        }
      );

      return response.data;
    },

    onSuccess: (_, variables) => {
      // نحفظ الإيميل عشان نحتاجه في Reset Password
      sessionStorage.setItem("resetEmail", variables.email);

      toast.success("Reset code sent to your email");

      setTimeout(() => {
        navigate("/VerifyResetCode");
      }, 700);
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    },
  });

  function handleForgotPassword(data) {
    forgotPassword(data);
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-emerald-50 via-white to-green-50 px-4 py-12">
      <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center">

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="grid w-full overflow-hidden rounded-3xl bg-white shadow-2xl shadow-emerald-100 lg:grid-cols-2"
        >

          {/* Left Side */}
          <div className="hidden bg-gradient-to-br from-[#0AAD0A] to-emerald-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div>

              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <ShieldCheck size={30} />
              </div>

              <h1 className="text-4xl font-black leading-tight">
                Forgot your
                <br />
                password?
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-emerald-50">
                No worries. Enter your email address and we&apos;ll send you
                a verification code to securely reset your password.
              </p>

            </div>

            <div className="text-sm text-emerald-100">
              Secure password recovery
            </div>
          </div>

          {/* Form */}
          <div className="p-7 sm:p-10 lg:p-12">

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >

              <div className="mb-8 lg:hidden">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-[#0AAD0A]">
                  <ShieldCheck size={30} />
                </div>
              </div>

              <h2 className="text-3xl font-black text-gray-900">
                Reset Password
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Enter your email and we&apos;ll send you a 6-digit
                verification code.
              </p>

              <form
                onSubmit={handleSubmit(handleForgotPassword)}
                className="mt-8 space-y-5"
              >

                <div>

                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="email"
                      placeholder="you@example.com"
                      {...register("email", {
                        required: "Email is required",

                        pattern: {
                          value:
                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message:
                            "Enter a valid email address",
                        },
                      })}
                      className={`w-full rounded-xl border bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:bg-white focus:ring-4 ${
                        errors.email
                          ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                          : "border-gray-200 focus:border-[#0AAD0A] focus:ring-green-100"
                      }`}
                    />

                  </div>

                  {errors.email && (
                    <p className="mt-2 text-xs font-semibold text-red-500">
                      {errors.email.message}
                    </p>
                  )}

                </div>

               <motion.button
  whileTap={{ scale: 0.98 }}
  disabled={isPending}
  type="submit"
  className="relative flex h-[52px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#0AAD0A] text-sm font-bold text-white shadow-lg shadow-green-100 transition hover:bg-[#089208] disabled:cursor-not-allowed disabled:opacity-60"
>
  <AnimatePresence mode="wait" initial={false}>
    {!isPending ? (
      <motion.div
        key="send"
        initial={{ opacity: 0, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{
          opacity: 0,
          x: -120,
          transition: {
            duration: 0.35,
            ease: "easeIn",
          },
        }}
        className="absolute flex items-center gap-2"
      >
        <span>Send Verification Code</span>

        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ArrowRight size={18} />
        </motion.span>
      </motion.div>
    ) : (
      <motion.div
        key="loading"
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{
          opacity: 0,
          x: 120,
        }}
        transition={{ duration: 0.3 }}
        className="absolute flex items-center gap-2"
      >
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

        <span>Sending...</span>
      </motion.div>
    )}
  </AnimatePresence>
</motion.button>

              </form>

              <div className="mt-7 text-center text-sm text-gray-500">
                Remember your password?{" "}

                <Link
                  to="/login"
                  className="font-bold text-[#0AAD0A] hover:underline"
                >
                  Login
                </Link>
              </div>

            </motion.div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}