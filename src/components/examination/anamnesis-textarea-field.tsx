"use client";

import { useCallback, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { toast } from "sonner";

interface AnamnesisTextareaFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
  isRecordingActive?: boolean;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
}

export function AnamnesisTextareaField({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
  required = false,
  isRecordingActive = false,
  onRecordingStart,
  onRecordingStop,
}: AnamnesisTextareaFieldProps) {
  const handleResult = useCallback(
    (transcript: string, isFinal: boolean) => {
      if (isFinal) {
        onChange(value + (value ? " " : "") + transcript);
      }
    },
    [value, onChange],
  );

  const handleError = useCallback((error: string) => {
    toast.error("Voice Input Error", { description: error });
  }, []);

  const {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    lang: "id-ID",
    onResult: handleResult,
    onError: handleError,
  });

  // Stop listening when another field starts recording
  useEffect(() => {
    if (isRecordingActive === false && isListening) {
      stopListening();
    }
  }, [isRecordingActive, isListening, stopListening]);

  const toggleRecording = () => {
    if (isListening) {
      stopListening();
      onRecordingStop?.();
    } else {
      startListening();
      onRecordingStart?.();
    }
  };

  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && " *"}
      </Label>
      <div className="relative">
        <Textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="pr-12"
        />
        <div className="absolute bottom-2 right-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant={isListening ? "destructive" : "outline"}
                  size="icon"
                  className={`h-8 w-8 ${
                    isListening
                      ? "animate-pulse-ring bg-red-500 hover:bg-red-600 text-white"
                      : ""
                  }`}
                  onClick={toggleRecording}
                  disabled={!isSupported}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {!isSupported
                  ? "Browser tidak mendukung voice input. Gunakan Google Chrome."
                  : isListening
                    ? "Klik untuk berhenti rekam"
                    : "Klik untuk mulai rekam suara"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {isListening && (
        <div className="flex items-center gap-2 text-xs text-red-500">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span>
            Sedang mendengarkan...{" "}
            {transcript && (
              <span className="italic text-muted-foreground">{transcript}</span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
