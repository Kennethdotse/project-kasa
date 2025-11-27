"use client";

import { useState } from "react";
import ConsentForm, { type UserData } from "@/components/consent-form";
import RecordingInterface from "@/components/recording-interface";
import { FirebaseProvider } from "@/firebase/provider";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import Background from "@/components/background";

type Step = "consent" | "collect";

export default function Home() {
  const [step, setStep] = useState<Step>("consent");
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleConsentSubmit = (data: UserData) => {
    setUserData(data);
    setStep("collect");
  };

  const handleStartOver = () => {
    setUserData(null);
    setStep("consent");
  }

  return (
    <FirebaseProvider>
      <FirebaseClientProvider>
        <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-4 sm:p-6 md:p-8">
          <Background />
          <div className="relative z-10 w-full max-w-2xl">
            {step === "consent" && <ConsentForm onSubmit={handleConsentSubmit} />}
            {step === "collect" && userData && <RecordingInterface userData={userData} onStartOver={handleStartOver} />}
          </div>
        </main>
      </FirebaseClientProvider>
    </FirebaseProvider>
  );
}
