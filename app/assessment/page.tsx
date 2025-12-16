"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import VideoRecorder from "@/components/VideoRecorder";
import { Assessment, Question, RoleInput } from "@/types/assessment";

function AssessmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [roleInput, setRoleInput] = useState<RoleInput | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<number, { videoBlob?: Blob; timestamp?: number }>>({});

  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (dataParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(dataParam));
        setAssessment(parsed.assessment);
        setRoleInput(parsed.roleInput);
      } catch (err) {
        console.error("Error parsing assessment data:", err);
        setError("Invalid assessment data");
      }
    } else {
      // Fallback: try to generate with default values
      fetch("/api/generate-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleTitle: "Senior Backend Engineer",
          seniority: "Senior",
          yearsExperience: 6,
          techStack: ["Node.js", "PostgreSQL"],
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setAssessment(data);
        })
        .catch((err) => {
          console.error("Failed to load assessment:", err);
          setError("Failed to load assessment. Please create a new assessment.");
        });
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/builder")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create New Assessment
          </button>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  const allQuestions = assessment.sections.flatMap((section) =>
    section.questions.map((q) => ({ ...q, sectionTitle: section.title }))
  );
  const currentQuestion = allQuestions[currentIndex];
  const totalQuestions = allQuestions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isFirstQuestion = currentIndex === 0;

  const handleVideoRecorded = (blob: Blob) => {
    setResponses({ ...responses, [currentIndex]: { videoBlob: blob, timestamp: Date.now() } });
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex(currentIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentIndex(currentIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleComplete = async () => {
    // Here you would submit all responses to the backend
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {roleInput?.roleTitle || "Assessment"}
          </h1>
          {roleInput && (
            <p className="text-gray-600">
              {roleInput.seniority} • {roleInput.yearsExperience} years experience
              {roleInput.team && ` • ${roleInput.team}`}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <ProgressBar current={currentIndex + 1} total={totalQuestions} />

        {/* Current Section Indicator */}
        <div className="mt-4 mb-6">
          <p className="text-sm text-gray-600">
            Section: <span className="font-semibold">{currentQuestion.sectionTitle}</span>
          </p>
          <p className="text-sm text-gray-500">
            Question {currentIndex + 1} of {totalQuestions}
          </p>
        </div>

        {/* Question Card */}
        <QuestionCard question={currentQuestion} questionNumber={currentIndex + 1} />

        {/* Video Recorder */}
        <VideoRecorder
          question={currentQuestion}
          onRecorded={handleVideoRecorded}
          recordedBlob={responses[currentIndex]?.videoBlob}
        />

        {/* Navigation */}
        <div className="mt-8 flex justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleComplete}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Complete Assessment
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading assessment...</p>
          </div>
        </div>
      }
    >
      <AssessmentContent />
    </Suspense>
  );
}
