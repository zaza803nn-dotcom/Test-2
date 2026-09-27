import { useState } from "react";
import axios from "axios";
import { motion } from "motion/react";import {
  Eye,
  EyeOff,
  LockKeyhole,
  CheckCircle2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const email = sessionStorage.getItem("resetEmail");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("newPassword", "");

  const {
    mutate: resetPassword,
    isPending,
  } = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(
        "https://ecommerce.routemisr.com/api/v1/auth/resetPassword",
        {
          email,
          newPassword: data.newPassword,
        }
      );

      return response.data;
    },

    onSuccess: () => {
      setSuccess(true);

      sessionStorage.removeItem("resetEmail");

      toast.success("Password reset successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Could not reset password"
      );
    },
  });

  function handleResetPassword(data) {
    if (!email) {
      toast.error(
        "Reset session expired. Please try again."
      );

      navigate("/ForgotPassword");

      return;
    }

    resetPassword(data);
  }

  const passwordStrength =
    password.length >= 8
      ? password.length >= 12
        ? "Strong"
        : "Good"
      : "Weak";

  // =========================
  // Success Screen
  // =========================

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 px-4">

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-2xl shadow-green-100"
        >

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 250,
            }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-[#0AAD0A]"
          >
            <CheckCircle2 size={52} />
          </motion.div>

          <h1 className="mt-7 text-3xl font-black text-gray-900">
            Password Updated!
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Your password has been changed successfully.
            <br />
            Redirecting you to login...
          </p>

          <div className="mx-auto mt-7 h-1 w-32 overflow-hidden rounded-full bg-gray-100">

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8 }}
              className="h-full bg-[#0AAD0A]"
            />

          </div>

        </motion.div>

      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-emerald-50 via-white to-green-50 px-4 py-12">

      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{ duration: 0.5 }}
          className="w-full rounded-3xl bg-white p-7 shadow-2xl shadow-emerald-100 sm:p-10"
        >

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-[#0AAD0A]">
            <LockKeyhole size={36} />
          </div>

          <div className="mt-6 text-center">

            <h1 className="text-3xl font-black text-gray-900">
              Create New Password
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Choose a strong password for your account.
            </p>

          </div>

          <form
            onSubmit={handleSubmit(
              handleResetPassword
            )}
            className="mt-8 space-y-5"
          >

            {/* New Password */}

            <div>

              <label className="mb-2 block text-sm font-bold text-gray-700">
                New Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter new password"
                  {...register("newPassword", {
                    required:
                      "Password is required",

                    minLength: {
                      value: 6,
                      message:
                        "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-[#0AAD0A] focus:bg-white focus:ring-4 focus:ring-green-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

              {errors.newPassword && (
                <p className="mt-2 text-xs font-semibold text-red-500">
                  {errors.newPassword.message}
                </p>
              )}

              {/* Password Strength */}

              {password && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mt-3"
                >

                  <div className="mb-1 flex justify-between text-xs">

                    <span className="font-semibold text-gray-500">
                      Password strength
                    </span>

                    <span className="font-bold text-[#0AAD0A]">
                      {passwordStrength}
                    </span>

                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">

                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          passwordStrength ===
                          "Strong"
                            ? "100%"
                            : passwordStrength ===
                              "Good"
                            ? "65%"
                            : "30%",
                      }}
                      className="h-full bg-[#0AAD0A]"
                    />

                  </div>

                </motion.div>
              )}

            </div>

            {/* Confirm Password */}

            <div>

              <label className="mb-2 block text-sm font-bold text-gray-700">
                Confirm Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={
                    showConfirm
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  {...register(
                    "confirmPassword",
                    {
                      required:
                        "Please confirm your password",

                      validate: (value) =>
                        value === password ||
                        "Passwords do not match",
                    }
                  )}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-[#0AAD0A] focus:bg-white focus:ring-4 focus:ring-green-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showConfirm ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

              {errors.confirmPassword && (
                <p className="mt-2 text-xs font-semibold text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}

            </div>

            {/* Submit */}

            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={isPending}
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0AAD0A] py-3.5 text-sm font-bold text-white shadow-lg shadow-green-100 transition hover:bg-[#089208] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {isPending ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Updating Password...
                </>
              ) : (
                <>
                  Reset Password
                  <CheckCircle2 size={18} />
                </>
              )}

            </motion.button>

          </form>

        </motion.div>

      </div>
    </div>
  );
}