"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Mic, StopCircle, Loader, LogOut, SkipForward, FileText, Languages, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { prompts, type Prompt } from "@/lib/prompts";
import { useToast } from "@/hooks/use-toast";
import { type UserData } from "./consent-form";
import { AnimatePresence, motion } from "framer-motion";

type RecordingStatus = "idle" | "recording" | "processing" | "recorded";

type RecordingInterfaceProps = {
  userData: UserData;
  onStartOver: () => void;
};

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export default function RecordingInterface({ userData, onStartOver }: RecordingInterfaceProps) {
  const [prompt, setPrompt] = useState<Prompt>(() => getRandomItem(prompts));
  const [showSwahili, setShowSwahili] = useState(false);
  const { toast } = useToast();

  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const imagePrompt = PlaceHolderImages.find(img => img.id === 'afrivoice-prompt-1');

  useEffect(() => {
    // Cleanup function to stop media stream and revoke URL
    return () => {
      if (mediaRecorderRef.current?.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleStartRecording = async () => {
    if (recordingStatus === "recording") return;
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingStatus("recording");
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        setRecordingStatus("processing");
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setRecordingStatus("recorded");
        
        // Stop all media tracks after processing is done
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        variant: "destructive",
        title: "Microphone Access Denied",
        description: "Please allow microphone access in your browser settings to continue.",
      });
      setRecordingStatus("idle");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && recordingStatus === "recording") {
      mediaRecorderRef.current.stop();
    }
  };
  
  const nextPrompt = () => {
    setPrompt(getRandomItem(prompts.filter(p => p.id !== prompt.id)));
    setRecordingStatus("idle");
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  const RecordButton = () => {
    switch (recordingStatus) {
      case "recording":
        return (
          <Button onClick={handleStopRecording} size="lg" className="rounded-full w-24 h-24 bg-accent hover:bg-accent/90" aria-label="Stop recording">
            <StopCircle className="h-12 w-12" />
          </Button>
        );
      case "processing":
        return (
          <Button size="lg" className="rounded-full w-24 h-24" disabled>
            <Loader className="h-12 w-12 animate-spin" />
          </Button>
        );
      default:
        return (
          <Button onClick={handleStartRecording} size="lg" className="rounded-full w-24 h-24" aria-label="Start recording">
            <Mic className="h-12 w-12" />
          </Button>
        );
    }
  };

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <FileText className="text-primary"/> Read the Prompt
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowSwahili(!showSwahili)} aria-label="Toggle language">
              <Languages className="h-5 w-5"/>
            </Button>
            <Button variant="ghost" size="icon" onClick={nextPrompt} aria-label="Next prompt">
              <SkipForward className="h-5 w-5"/>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={prompt.id + (showSwahili ? '-sw' : '-en')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-2xl font-light text-center leading-relaxed p-4 min-h-[100px]">
                {showSwahili ? prompt.swahili : prompt.english}
              </p>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
      
      {prompt.type === 'image' && imagePrompt && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">...or Describe the Picture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg">
              <Image
                src={imagePrompt.imageUrl}
                alt={imagePrompt.description}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                data-ai-hint={imagePrompt.imageHint}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center items-center py-4">
        <RecordButton />
      </div>

      <AnimatePresence>
      {recordingStatus === "recorded" && audioUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Mic className="text-primary" /> Your Recording
              </CardTitle>
            </CardHeader>
            <CardContent>
                <audio src={audioUrl} controls className="w-full" />
              <div className="flex justify-between items-center gap-2 mt-4">
                <Button variant="outline" onClick={nextPrompt}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Try another prompt
                </Button>
                <Button asChild>
                  <a href={audioUrl} download={`recording-${new Date().toISOString()}.webm`}>
                    Download
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      </AnimatePresence>

      <div className="text-center mt-8">
        <Button variant="link" onClick={onStartOver}>
          <LogOut className="mr-2 h-4 w-4"/> Start Over / Change Settings
        </Button>
      </div>
    </div>
  );
}
