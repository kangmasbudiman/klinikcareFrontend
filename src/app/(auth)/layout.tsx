"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/shared/logo";
import {
  Stethoscope,
  Heart,
  Activity,
  ShieldCheck,
  Clock,
  Users,
} from "lucide-react";

const floatingIcons = [
  { Icon: Stethoscope, delay: 0, x: "10%", y: "20%" },
  { Icon: Heart, delay: 0.5, x: "80%", y: "15%" },
  { Icon: Activity, delay: 1, x: "15%", y: "70%" },
  { Icon: ShieldCheck, delay: 1.5, x: "85%", y: "65%" },
  { Icon: Clock, delay: 2, x: "50%", y: "85%" },
  { Icon: Users, delay: 2.5, x: "75%", y: "40%" },
];

const features = [
  {
    icon: Users,
    title: "Manajemen Pasien",
    desc: "Data lengkap & terorganisir",
  },
  {
    icon: Activity,
    title: "Rekam Medis Digital",
    desc: "Akses cepat & aman",
  },
  {
    icon: Clock,
    title: "Penjadwalan Dokter",
    desc: "Atur jadwal dengan mudah",
  },
  {
    icon: ShieldCheck,
    title: "Sistem Antrian",
    desc: "Efisien & transparan",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Modern Medical Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop')`,
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/95 via-primary-800/90 to-primary-600/85" />

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating Medical Icons */}
        {floatingIcons.map(({ Icon, delay, x, y }, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{ left: x, top: y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
              y: [0, -20, 0],
            }}
            transition={{
              delay,
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Icon className="w-6 h-6 text-white/70" />
            </div>
          </motion.div>
        ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-10"
            >
              <Logo size="xl" variant="white" showText={true} />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl xl:text-5xl font-bold mb-4 leading-tight"
            >
              Solusi Digital untuk
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                Klinik Modern
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg xl:text-xl text-white/80 mb-10 max-w-md"
            >
              Platform terintegrasi untuk mengelola seluruh operasional klinik
              Anda dengan efisien dan profesional.
            </motion.p>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="group p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-300"
                >
                  <feature.icon className="w-8 h-8 text-cyan-300 mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-white/60">{feature.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-10 flex items-center gap-4"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-white/20 flex items-center justify-center text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium">Dipercaya 100+ Klinik</p>
                <p className="text-xs text-white/60">di seluruh Indonesia</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Right side - Auth form with subtle pattern */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 relative">
        {/* Subtle pattern background */}
        <div className="absolute inset-0 opacity-40">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="dots"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1" fill="#cbd5e1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
