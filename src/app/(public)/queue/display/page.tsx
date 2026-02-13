"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Maximize, Clock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import type { QueueDisplayData } from "@/types/queue";
import kioskService from "@/services/kiosk.service";
import queueAudio from "@/lib/queue-audio";

export default function QueueDisplayPage() {
  const [displayData, setDisplayData] = useState<QueueDisplayData | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [lastCalledCode, setLastCalledCode] = useState<string | null>(null);
  const [isAnnouncing, setIsAnnouncing] = useState(false);
  const announcementQueueRef = useRef<
    Array<{
      queueCode: string;
      counterNumber?: number | null;
      departmentName?: string;
    }>
  >([]);
  const isProcessingRef = useRef(false);

  // Process announcement queue
  const processAnnouncementQueue = useCallback(async () => {
    if (
      isProcessingRef.current ||
      announcementQueueRef.current.length === 0 ||
      isMuted
    ) {
      return;
    }

    isProcessingRef.current = true;
    setIsAnnouncing(true);

    while (announcementQueueRef.current.length > 0) {
      const announcement = announcementQueueRef.current.shift();
      if (announcement) {
        try {
          await queueAudio.announce(announcement, 2); // Repeat 2 times
        } catch (error) {
          console.error("Error announcing:", error);
        }
        // Small pause between different announcements
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    isProcessingRef.current = false;
    setIsAnnouncing(false);
  }, [isMuted]);

  // Fetch display data
  const fetchDisplayData = useCallback(async () => {
    try {
      const response = await kioskService.getQueueDisplay();
      const newData = response.data;

      // Check if there's a new call
      if (newData.current.length > 0) {
        const latestCall = newData.current[0];
        if (
          latestCall.queue_code !== lastCalledCode &&
          latestCall.status === "called"
        ) {
          setLastCalledCode(latestCall.queue_code);

          // Add to announcement queue
          if (!isMuted) {
            announcementQueueRef.current.push({
              queueCode: latestCall.queue_code,
              counterNumber: latestCall.counter,
              departmentName: latestCall.department,
            });
            processAnnouncementQueue();
          }
        }
      }

      setDisplayData(newData);
    } catch (error) {
      console.error("Error fetching display data:", error);
    }
  }, [lastCalledCode, isMuted, processAnnouncementQueue]);

  // Initial load and refresh
  useEffect(() => {
    fetchDisplayData();

    // Refresh every 3 seconds
    const interval = setInterval(fetchDisplayData, 3000);
    return () => clearInterval(interval);
  }, [fetchDisplayData]);

  // Set mounted state and initialize time on client only
  useEffect(() => {
    setIsMounted(true);
    setCurrentTime(new Date());
  }, []);

  // Update time every second
  useEffect(() => {
    if (!isMounted) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [isMounted]);

  // Update volume when changed
  useEffect(() => {
    queueAudio.setVolume(volume / 100);
  }, [volume]);

  // Stop audio when muted
  useEffect(() => {
    if (isMuted) {
      queueAudio.stop();
      announcementQueueRef.current = [];
    }
  }, [isMuted]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Test announcement
  const testAnnouncement = () => {
    if (!isMuted) {
      queueAudio.announce(
        {
          queueCode: "A-001",
          counterNumber: 1,
          departmentName: "Poli Umum",
        },
        1,
      );
    }
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Get color class based on department color
  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      red: "from-red-500 to-red-600",
      yellow: "from-yellow-500 to-yellow-600",
      purple: "from-purple-500 to-purple-600",
      pink: "from-pink-500 to-pink-600",
      indigo: "from-indigo-500 to-indigo-600",
      cyan: "from-cyan-500 to-cyan-600",
      orange: "from-orange-500 to-orange-600",
      teal: "from-teal-500 to-teal-600",
    };
    return colors[color] || "from-gray-500 to-gray-600";
  };

  // Show loading state during SSR to prevent hydration mismatch
  if (!isMounted || !currentTime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Antrian Pasien</h1>
            <p className="text-slate-400">Memuat...</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-2xl font-mono">
              <Clock className="h-6 w-6 text-slate-400" />
              <span>--:--:--</span>
            </div>
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-slate-300">
              Sedang Dipanggil
            </h2>
            <div className="p-16 rounded-3xl bg-slate-800/50 text-center animate-pulse">
              <p className="text-4xl text-slate-500">Memuat...</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 text-slate-300">
              Antrian Berikutnya
            </h2>
            <div className="p-8 rounded-xl bg-slate-800/50 text-center animate-pulse">
              <p className="text-slate-500">Memuat...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Antrian Pasien</h1>
          <p className="text-slate-400">{formatDate(currentTime)}</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Announcing indicator */}
          {isAnnouncing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-2 h-2 rounded-full bg-green-400"
              />
              <span className="text-sm">Memanggil...</span>
            </motion.div>
          )}

          <div className="flex items-center gap-2 text-2xl font-mono">
            <Clock className="h-6 w-6 text-slate-400" />
            {formatTime(currentTime)}
          </div>

          {/* Audio Settings */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end">
              <div className="space-y-4">
                <h4 className="font-medium">Pengaturan Audio</h4>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Volume</Label>
                    <span className="text-sm text-muted-foreground">
                      {volume}%
                    </span>
                  </div>
                  <Slider
                    value={[volume]}
                    onValueChange={(values) => setVolume(values[0])}
                    max={100}
                    step={10}
                    disabled={isMuted}
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={testAnnouncement}
                  disabled={isMuted}
                  className="w-full"
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Test Suara
                </Button>

                <p className="text-xs text-muted-foreground">
                  Suara akan memanggil nomor antrian dan loket secara otomatis
                </p>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="text-white hover:bg-white/10"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="text-white hover:bg-white/10"
          >
            <Maximize className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Current Queue - Main Display */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-slate-300">
            Sedang Dipanggil
          </h2>

          <AnimatePresence mode="wait">
            {displayData?.current && displayData.current.length > 0 ? (
              <motion.div
                key={displayData.current[0].queue_code}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4"
              >
                {displayData.current.map((item, index) => (
                  <motion.div
                    key={item.queue_code}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-8 rounded-3xl bg-gradient-to-r ${getColorClass(item.department_color)} shadow-2xl`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg opacity-80">{item.department}</p>
                        <motion.p
                          className="text-8xl font-bold tracking-wider"
                          animate={
                            item.status === "called"
                              ? { scale: [1, 1.02, 1] }
                              : {}
                          }
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          {item.queue_code}
                        </motion.p>
                        {item.patient_name && (
                          <p className="text-2xl mt-2 opacity-90">
                            {item.patient_name}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        {item.counter && (
                          <div>
                            <p className="text-lg opacity-80">Loket</p>
                            <motion.p
                              className="text-6xl font-bold"
                              animate={
                                item.status === "called"
                                  ? { scale: [1, 1.05, 1] }
                                  : {}
                              }
                              transition={{
                                repeat: Infinity,
                                duration: 2,
                                delay: 0.5,
                              }}
                            >
                              {item.counter}
                            </motion.p>
                          </div>
                        )}
                        <p className="mt-2 text-lg opacity-80">
                          {item.status === "called"
                            ? "Silakan ke loket"
                            : "Sedang dilayani"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-16 rounded-3xl bg-slate-800/50 text-center"
              >
                <p className="text-4xl text-slate-500">Menunggu panggilan...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Waiting Queue */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-slate-300">
            Antrian Berikutnya
          </h2>

          <div className="space-y-3">
            <AnimatePresence>
              {displayData?.waiting && displayData.waiting.length > 0 ? (
                displayData.waiting.map((item, index) => (
                  <motion.div
                    key={item.queue_code}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl bg-slate-800/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-3 h-3 rounded-full bg-gradient-to-r ${getColorClass(item.department_color)}`}
                      />
                      <span className="text-2xl font-bold">
                        {item.queue_code}
                      </span>
                    </div>
                    <span className="text-slate-400">{item.department}</span>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 rounded-xl bg-slate-800/50 text-center"
                >
                  <p className="text-slate-500">Tidak ada antrian</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-slate-500 text-sm">
        <p>Harap menunggu sampai nomor antrian Anda dipanggil</p>
        {isMounted && !queueAudio.isSupported() && (
          <p className="mt-2 text-yellow-500">
            Browser tidak mendukung fitur suara. Gunakan browser modern untuk
            pengalaman terbaik.
          </p>
        )}
      </div>
    </div>
  );
}
