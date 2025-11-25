"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Mic, StopCircle, Loader, LogOut, SkipForward, FileText, Languages, RefreshCw, AlertCircle, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { prompts, type Prompt } from "@/lib/prompts";
import { useToast } from "@/hooks/use-toast";
import { type UserData } from "./consent-form";
import { AnimatePresence, motion } from "framer-motion";
import { useFirebase, useUser } from "@/firebase";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import Waveform from "./waveform";

type RecordingStatus = "idle" | "recording" | "processing" | "recorded" | "uploading" | "uploaded";

type RecordingInterfaceProps = {
  userData: UserData;
  onStartOver: () => void;
};

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export default function RecordingInterface({ userData, onStartOver }: RecordingInterfaceProps) {
  const [prompt, setPrompt] = useState<Prompt>(() => getRandomItem(prompts));
  const { toast } = useToast();

  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);

  const { user, loading: userLoading } = useUser();
  const { firestore } = useFirebase();

  const imagePrompt = PlaceHolderImages.find(img => img.id === 'ghana-market-1');

  useEffect(() => {
    const getMicPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        setHasMicPermission(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        setHasMicPermission(false);
        toast({
          variant: "destructive",
          title: "Microphone Access Denied",
          description: "Please allow microphone access in your browser settings to continue.",
        });
      }
    };

    getMicPermission();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [toast, audioUrl]);

  const handleStartRecording = () => {
    if (recordingStatus === "recording" || !streamRef.current || !hasMicPermission) return;
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      setAudioBlob(null);
    }
    setRecordingStatus("recording");
    audioChunksRef.current = [];

    mediaRecorderRef.current = new MediaRecorder(streamRef.current);

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      setRecordingStatus("processing");
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioBlob(blob);
      setAudioUrl(url);
      setRecordingStatus("recorded");
    };

    mediaRecorderRef.current.start();
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && recordingStatus === "recording") {
      mediaRecorderRef.current.stop();
    }
  };
  
  const nextPrompt = () => {
    setPrompt(getRandomItem(prompts.filter(p => p.id !== prompt.id)));
    setRecordingStatus("idle");
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!audioBlob || !user || !firestore) return;

    setRecordingStatus("uploading");
    const storage = getStorage();
    const recordingId = `${user.uid}_${Date.now()}.webm`;
    const storageRef = ref(storage, `recordings/${recordingId}`);

    try {
      await uploadBytes(storageRef, audioBlob);
      const recordingPath = storageRef.fullPath;

      const userRecordingsRef = collection(firestore, 'users', user.uid, 'recordings');
      await addDoc(userRecordingsRef, {
        ...userData,
        prompt: {
          id: prompt.id,
          type: prompt.type,
          english: prompt.english,
          otherLanguage: prompt.otherLanguage,
        },
        audioPath: recordingPath,
        createdAt: new Date(),
      });
      
      setRecordingStatus("uploaded");
      toast({
        title: "Upload Successful!",
        description: "Your recording has been saved. Thank you for your contribution!",
      });
      setTimeout(nextPrompt, 2000);
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "There was a problem saving your recording. Please try again.",
      });
      setRecordingStatus("recorded");
    }
  };


  const RecordButton = () => {
    const isDisabled = hasMicPermission === false || userLoading;
    let title = "Start recording";
    if (isDisabled) title = "Microphone not available or still loading";
    if (recordingStatus === 'recording') title = "Stop recording";
    if (recordingStatus === 'processing') title = "Processing...";
    if (recordingStatus === 'uploading') title = "Uploading...";

    switch (recordingStatus) {
      case "recording":
        return (
          <Button onClick={handleStopRecording} size="lg" className="rounded-full w-20 h-20 md:w-24 md:h-24 bg-accent hover:bg-accent/90" aria-label={title}>
            <StopCircle className="h-10 w-10 md:h-12 md:w-12" />
          </Button>
        );
      case "processing":
      case "uploading":
        return (
          <Button size="lg" className="rounded-full w-20 h-20 md:w-24 md:h-24" disabled>
            <Loader className="h-10 w-10 md:h-12 md:w-12 animate-spin" />
          </Button>
        );
      default:
        return (
          <Button onClick={handleStartRecording} size="lg" className="rounded-full w-20 h-20 md:w-24 md:h-24" disabled={isDisabled} aria-label={title}>
            <Mic className="h-10 w-10 md:h-12 md:w-12" />
          </Button>
        );
    }
  };

  return (
    <div className="w-full space-y-6">
       {hasMicPermission === false && (
         <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
           <AlertTitle>Microphone Access Required</AlertTitle>
           <AlertDescription>
             This app needs access to your microphone to record audio. Please check your browser settings and grant permission.
           </AlertDescription>
         </Alert>
       )}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline text-xl md:text-2xl flex items-center gap-2">
            <FileText className="text-primary h-5 w-5"/> Read the Prompt
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={nextPrompt} aria-label="Next prompt">
              <SkipForward className="h-5 w-5"/>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-xl md:text-2xl font-light text-center leading-relaxed p-4 min-h-[100px]">
                {prompt.english}
              </p>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
      
      {prompt.type === 'image' && imagePrompt && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl md:text-2xl">...or Describe the Picture</CardTitle>
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
      {(recordingStatus === "recorded" || recordingStatus === "uploaded") && audioBlob && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl md:text-2xl flex items-center gap-2">
                <Mic className="text-primary h-5 w-5" /> Your Recording
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {audioUrl && <audio src={audioUrl} controls className="w-full" />}
              <Waveform audioBlob={audioBlob} className="w-full h-[60px]" barColor="hsl(var(--primary))" />
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
                <Button variant="outline" onClick={nextPrompt} disabled={recordingStatus === 'uploading'} className="w-full sm:w-auto">
                  <RefreshCw className="mr-2 h-4 w-4" /> Discard & Try Again
                </Button>
                <Button onClick={handleUpload} disabled={recordingStatus === 'uploading' || recordingStatus === 'uploaded'} className="w-full sm:w-auto">
                  <UploadCloud className="mr-2 h-4 w-4" /> Submit Recording
                </Button>
              </div>
               {recordingStatus === "uploaded" && <p className="text-green-600 text-center mt-4">Upload successful! Loading next prompt...</p>}
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
