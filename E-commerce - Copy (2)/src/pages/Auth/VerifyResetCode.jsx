import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

export default function VerifyResetCode() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [timer, setTimer] = useState(60);

  const inputRefs = useRef([]);

  const email = sessionStorage.getItem("resetEmail");

  // =========================
  // Verify OTP Mutation
  // =========================

  const {
    mutate: verifyResetCode,
    isPending: isVerifying,
  } = useMutation({
    mutationFn: async (resetCode) => {
      const response = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode",
        {
          resetCode,
        }
      );

      return response.data;
    },

    onSuccess: () => {
      toast.success("Code verified successfully");

      setTimeout(() => {
        navigate("/ResetPassword");
      }, 700);
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Invalid or expired verification code"
      );
    },
  });

  // =========================
  // Resend OTP Mutation
  // =========================

  const {
    mutate: resendCode,
    isPending: isResending,
  } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords",
        {
          email,
        }
      );

      return response.data;
    },

    onSuccess: () => {
      setOtp(["", "", "", "", "", ""]);
      setTimer(60);

      inputRefs.current[0]?.focus();

      toast.success("A new code has been sent");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Could not resend the code"
      );
    },
  });

  // =========================
  // Timer
  // =========================

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // =========================
  // Check Email
  // =========================

  useEffect(() => {
    if (!email) {
      navigate("/ForgotPassword");
    }
  }, [email, navigate]);

  // =========================
  // OTP Change
  // =========================

  function handleChange(value, index) {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value.slice(-1);

    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  // =========================
  // Backspace
  // =========================

  function handleKeyDown(event, index) {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  // =========================
  // Paste OTP
  // =========================

  function handlePaste(event) {
    event.preventDefault();

    const pastedData = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newOtp = [...otp];

    pastedData.split("").forEach((number, index) => {
      newOtp[index] = number;
    });

    setOtp(newOtp);

    const nextIndex = Math.min(
      pastedData.length,
      5
    );

    inputRefs.current[nextIndex]?.focus();
  }

  // =========================
  // Verify
  // =========================

  function handleVerify() {
    const resetCode = otp.join("");

    if (resetCode.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    verifyResetCode(resetCode);
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

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 250,
            }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-[#0AAD0A]"
          >
            <ShieldCheck size={38} />
          </motion.div>

          <div className="mt-6 text-center">

            <h1 className="text-3xl font-black text-gray-900">
              Verify Your Email
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              We&apos;ve sent a 6-digit verification code to
            </p>

            <p className="mt-1 truncate font-bold text-[#0AAD0A]">
              {email}
            </p>

          </div>

          {/* OTP */}

          <div className="mt-9 flex justify-center gap-2 sm:gap-3">

            {otp.map((number, index) => (
              <motion.input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                value={number}
                maxLength={1}
                inputMode="numeric"
                autoComplete="one-time-code"
                onChange={(event) =>
                  handleChange(
                    event.target.value,
                    index
                  )
                }
                onKeyDown={(event) =>
                  handleKeyDown(event, index)
                }
                onPaste={handlePaste}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.06,
                }}
                className="h-14 w-11 rounded-xl border-2 border-gray-200 bg-gray-50 text-center text-xl font-black text-gray-900 outline-none transition focus:border-[#0AAD0A] focus:bg-white focus:ring-4 focus:ring-green-100 sm:h-16 sm:w-14"
              />
            ))}

          </div>

          {/* Verify */}

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleVerify}
            disabled={isVerifying}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0AAD0A] py-3.5 text-sm font-bold text-white shadow-lg shadow-green-100 transition hover:bg-[#089208] disabled:cursor-not-allowed disabled:opacity-60"
          >

            {isVerifying ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Verifying...
              </>
            ) : (
              <>
                Verify Code
                <ShieldCheck size={18} />
              </>
            )}

          </motion.button>

          {/* Resend */}

          <div className="mt-7 text-center">

            {timer > 0 ? (
              <p className="text-sm text-gray-500">
                Resend code in{" "}
                <span className="font-bold text-[#0AAD0A]">
                  {timer}s
                </span>
              </p>
            ) : (
              <button
                onClick={() => resendCode()}
                disabled={isResending}
                className="mx-auto flex items-center gap-2 text-sm font-bold text-[#0AAD0A] hover:underline disabled:opacity-50"
              >
                <RotateCcw size={16} />

                {isResending
                  ? "Sending..."
                  : "Resend Code"}
              </button>
            )}

          </div>

          {/* Back */}

          <button
            onClick={() =>
              navigate("/ForgotPassword")
            }
            className="mx-auto mt-7 flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Change email
          </button>

        </motion.div>

      </div>
    </div>
  );
}