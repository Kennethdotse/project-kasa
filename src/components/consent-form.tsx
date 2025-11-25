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
import { BookOpen, ShieldCheck } from 'lucide-react';

export type UserData = {
  ageRange: string;
  dataUsage: string;
};

type ConsentFormProps = {
  onSubmit: (data: UserData) => void;
};

export default function ConsentForm({ onSubmit }: ConsentFormProps) {
  const [ageRange, setAgeRange] = useState("");
  const [dataUsage, setDataUsage] = useState("");
  const [hasConsented, setHasConsented] = useState(false);

  const isFormComplete = ageRange && dataUsage && hasConsented;

  const handleSubmit = () => {
    if (isFormComplete) {
      onSubmit({ ageRange, dataUsage });
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl">Welcome to AfriVoice Collect</CardTitle>
        <CardDescription className="text-lg">
          Help us build the future of African language technology.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2 text-center text-muted-foreground">
          <p>This study aims to collect speech data to improve technology's understanding and generation of diverse African languages. Your contribution is invaluable.</p>
        </div>
        
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-semibold text-lg flex items-center gap-2"><ShieldCheck className="text-primary"/>Your Information</h3>
          <div className="space-y-2">
            <Label htmlFor="age-range">Age Range</Label>
            <Select onValueChange={setAgeRange} value={ageRange}>
              <SelectTrigger id="age-range">
                <SelectValue placeholder="Select your age range" />
              </SelectTrigger>
              <SelectContent>
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
                <Label htmlFor="r1" className="font-normal cursor-pointer">For research purposes only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="open_dataset" id="r2" />
                <Label htmlFor="r2" className="font-normal cursor-pointer">Include in a public, open-source dataset</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="model_training" id="r3" />
                <Label htmlFor="r3" className="font-normal cursor-pointer">Use for model training (data will not be released)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex items-start space-x-3 rounded-lg border p-4">
          <Checkbox id="consent" checked={hasConsented} onCheckedChange={(checked) => setHasConsented(Boolean(checked))} className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="consent"
              className="font-medium cursor-pointer"
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
          className="w-full text-lg py-6"
          onClick={handleSubmit}
          disabled={!isFormComplete}
        >
          Proceed to Recording
        </Button>
      </CardFooter>
    </Card>
  );
}
