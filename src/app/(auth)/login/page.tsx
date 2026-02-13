"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/logo";
import { useAuth } from "@/providers/auth-provider";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";

const demoAccounts = [
  {
    email: "admin@klinik.com",
    password: "password",
    role: "Super Admin",
    color: "from-purple-500 to-indigo-500",
  },
  {
    email: "dokter@klinik.com",
    password: "password",
    role: "Dokter",
    color: "from-emerald-500 to-teal-500",
  },
  {
    email: "perawat@klinik.com",
    password: "password",
    role: "Perawat",
    color: "from-cyan-500 to-blue-500",
  },
  {
    email: "kasir@klinik.com",
    password: "password",
    role: "Kasir",
    color: "from-amber-500 to-orange-500",
  },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const { login, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success("Login berhasil! Selamat datang kembali.", {
        icon: <Sparkles className="w-4 h-4" />,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login gagal");
    }
  };

  const handleDemoLogin = (account: (typeof demoAccounts)[0]) => {
    setSelectedDemo(account.email);
    setValue("email", account.email);
    setValue("password", account.password);

    // Auto submit after a short delay
    setTimeout(() => {
      handleSubmit(onSubmit)();
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Glassmorphism Card */}
      <div className="relative">
        {/* Glow effect behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-cyan-500 to-primary-500 rounded-2xl blur-xl opacity-20 animate-pulse" />

        <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header with gradient accent */}
          <div className="relative px-8 pt-8 pb-6">
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-cyan-500 to-primary-500" />

            {/* Logo for mobile */}
            <div className="flex justify-center mb-6 lg:hidden">
              <Logo size="lg" variant="gradient" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h1 className="text-2xl font-bold text-gray-900">
                Selamat Datang!
              </h1>
              <p className="mt-2 text-gray-600">
                Masuk untuk mengakses dashboard Anda
              </p>
            </motion.div>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-lg blur opacity-0 group-focus-within:opacity-20 transition-opacity" />
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      className="pl-11 h-12 text-black  border-gray-200 focus:border-primary-500 focus:ring-primary-500/20 rounded-lg transition-all"
                      {...register("email")}
                    />
                  </div>
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-red-500 flex items-center gap-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-red-500" />
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium"
                  >
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
                  >
                    Lupa password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-lg blur opacity-0 group-focus-within:opacity-20 transition-opacity" />
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      className="pl-11 pr-11 h-12  bg-white/50 border-gray-200 focus:border-primary-500 focus:ring-primary-500/20 rounded-lg transition-all"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-red-500 flex items-center gap-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-red-500" />
                      {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transition-all duration-300 group"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Memproses...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Masuk ke Dashboard
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Demo Accounts Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white/80 text-sm text-gray-500 font-medium">
                    Coba Demo Akun
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {demoAccounts.map((account, index) => (
                  <motion.button
                    key={account.email}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDemoLogin(account)}
                    disabled={isLoading}
                    className={`relative p-3 rounded-xl border-2 transition-all duration-300 ${
                      selectedDemo === account.email
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-100 hover:border-gray-200 bg-white/50 hover:bg-white"
                    }`}
                  >
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r ${account.color}`}
                    />
                    <div className="pt-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        {account.role}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {account.email}
                      </p>
                    </div>
                    {selectedDemo === account.email && isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                        <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-sm text-gray-500 mt-6"
      >
        Dengan masuk, Anda menyetujui{" "}
        <Link href="#" className="text-primary-600 hover:underline">
          Syarat & Ketentuan
        </Link>{" "}
        kami.
      </motion.p>
    </motion.div>
  );
}
