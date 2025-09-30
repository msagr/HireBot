"use client";

import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import Form from "@/components/create-interview/form";
import QuestionList from "@/components/create-interview/question-list";
import { toast } from "sonner";
import InterviewLink from "@/components/create-interview/interview-link";

export default function CreateInterview() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [interviewId, setInterviewId] = useState(null);
  const [formData, setFormData] = useState({
    position: "",
    description: "",
  });

  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onCreateLink = (newInterviewId) => {
    if (!newInterviewId) {
      console.error("❌ onCreateLink called without interviewId");
      toast.error("Something went wrong while creating interview link");
      return;
    }
    setInterviewId(newInterviewId);
    setStep((prev) => prev + 1);
  };

  const onGoToNextStep = () => {
    if (!formData.position) {
      toast("Please enter a job position.");
      return;
    }
    if (!formData.description) {
      toast("Please enter a description.");
      return;
    }

    setStep((prev) => prev + 1);
  };

  return (
    <div className="mt-10 px-10 md:px-24 lg:px-44 xl:px-56">
      <div className="flex gap-5 items-center">
        <ArrowLeft onClick={() => router.back()} className="cursor-pointer" />
        <h2 className="text-2xl font-bold">Create Interview</h2>
      </div>

      <Progress value={step * 33.33} className="my-5" />

      {step === 1 && (
        <Form
          formData={formData}
          onHandleInputChange={onHandleInputChange}
          GoToNextStep={onGoToNextStep}
        />
      )}

      {step === 2 && (
        <QuestionList
          formData={formData}
          onCreateLink={onCreateLink}
          GoToNextStep={() => setStep((prev) => prev + 1)}
        />
      )}

      {step === 3 && (
        <InterviewLink interview_id={interviewId} formData={formData} />
      )}
    </div>
  );
}
