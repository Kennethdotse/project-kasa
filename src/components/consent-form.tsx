"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookOpen, ShieldCheck, UserCheck } from 'lucide-react';
import { Input } from "./ui/input";

export type UserData = {
  ageRange: string;
  dataUsage: string;
  isMinor: boolean;
  guardianName?: string;
  guardianRelationship?: string;
};

type ConsentFormProps = {
  onSubmit: (data: UserData) => void;
};

export default function ConsentForm({ onSubmit }: ConsentFormProps) {
  const [ageRange, setAgeRange] = useState("");
  const [dataUsage, setDataUsage] = useState("");
  const [hasConsented, setHasConsented] = useState(false);
  const [isMinor, setIsMinor] = useState(false);
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelationship, setGuardianRelationship] = useState('');
  const [guardianConsented, setGuardianConsented] = useState(false);

  const isMinorFormComplete = isMinor ? guardianName && guardianRelationship && guardianConsented : true;
  const isFormComplete = ageRange && dataUsage && hasConsented && isMinorFormComplete;

  const handleSubmit = () => {
    if (isFormComplete) {
      onSubmit({ ageRange, dataUsage, isMinor, guardianName, guardianRelationship });
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
          <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-primary" />
        </div>
        <CardTitle className="font-headline text-2xl md:text-3xl">Welcome to AfriVoice Collect</CardTitle>
        <CardDescription className="text-base md:text-lg">
          Help us build the future of African language technology.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2 text-center text-muted-foreground text-sm md:text-base">
          <p>This study aims to collect speech data to improve technology's understanding and generation of diverse African languages. Your contribution is invaluable.</p>
        </div>
        
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-semibold text-base md:text-lg flex items-center gap-2"><ShieldCheck className="text-primary h-5 w-5"/>Your Information</h3>
          <div className="space-y-2">
            <Label htmlFor="age-range">Age Range</Label>
            <Select onValueChange={setAgeRange} value={ageRange}>
              <SelectTrigger id="age-range">
                <SelectValue placeholder="Select your age range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-18">Under 18 (Minor)</SelectItem>
                <SelectItem value="18-24">18-24</SelectItem>
                <SelectItem value="25-34">25-34</SelectItem>
                <SelectItem value="35-44">35-44</SelectItem>
                <SelectItem value="45-54">45-54</SelectItem>
                <SelectItem value="55+">55+</SelectItem>
              </SelectContent>
            </Select>
             <p className="text-xs text-muted-foreground">We only collect anonymous metadata. We will never ask for your name or other personal information.</p>
          </div>

          <div className="space-y-2">
            <Label>Data Usage Options</Label>
            <RadioGroup onValueChange={setDataUsage} value={dataUsage} className="gap-3 pt-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="research_only" id="r1" />
                <Label htmlFor="r1" className="font-normal cursor-pointer text-sm md:text-base">For research purposes only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="open_dataset" id="r2" />
                <Label htmlFor="r2" className="font-normal cursor-pointer text-sm md:text-base">Include in a public, open-source dataset</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="model_training" id="r3" />
                <Label htmlFor="r3" className="font-normal cursor-pointer text-sm md:text-base">Use for model training (data will not be released)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox id="is-minor-checkbox" checked={isMinor} onCheckedChange={(checked) => setIsMinor(Boolean(checked))} className="mt-1" />
           <div className="grid gap-1.5 leading-none">
             <label
              htmlFor="is-minor-checkbox"
              className="font-medium cursor-pointer text-sm md:text-base"
            >
              Are you participating with a minor?
            </label>
             <p className="text-sm text-muted-foreground">
              Check this box if you are a parent or guardian providing consent for a minor.
            </p>
          </div>
        </div>

        {isMinor && (
           <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-semibold text-base md:text-lg flex items-center gap-2"><UserCheck className="text-primary h-5 w-5"/>Guardian Information</h3>
             <div className="space-y-2">
               <Label htmlFor="guardian-name">Guardian&apos;s Full Name</Label>
               <Input id="guardian-name" value={guardianName} onChange={(e) => setGuardianName(e.target.value)} placeholder="Enter guardian's name" />
            </div>
             <div className="space-y-2">
               <Label htmlFor="guardian-relationship">Relationship to Minor</Label>
               <Input id="guardian-relationship" value={guardianRelationship} onChange={(e) => setGuardianRelationship(e.target.value)} placeholder="e.g., Parent, Guardian" />
            </div>
             <div className="flex items-start space-x-3 mt-4">
              <Checkbox id="guardian-consent" checked={guardianConsented} onCheckedChange={(checked) => setGuardianConsented(Boolean(checked))} className="mt-1" />
               <div className="grid gap-1.5 leading-none">
                 <label
                  htmlFor="guardian-consent"
                  className="font-medium cursor-pointer text-sm md:text-base"
                >
                  Guardian Consent
                </label>
                 <p className="text-sm text-muted-foreground">
                  I, the parent or legal guardian, give my consent for this minor to participate in the study.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start space-x-3 rounded-lg border p-4">
          <Checkbox id="consent" checked={hasConsented} onCheckedChange={(checked) => setHasConsented(Boolean(checked))} className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="consent"
              className="font-medium cursor-pointer text-sm md:text-base"
            >
              Informed Consent
            </label>
            <p className="text-sm text-muted-foreground">
              I understand the purpose of the study and I consent to my anonymized voice data being recorded and used as described.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full text-base md:text-lg py-5 md:py-6"
          onClick={handleSubmit}
          disabled={!isFormComplete}
        >
          Proceed to Recording
        </Button>
      </CardFooter>
    </Card>
  );
}
