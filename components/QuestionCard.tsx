import { Question } from "@/types/assessment";

interface QuestionCardProps {
  question: Question & { sectionTitle?: string };
  questionNumber?: number;
}

export default function QuestionCard({ question, questionNumber }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
      {questionNumber && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            Question {questionNumber}
          </span>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
        {question.questionText}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">What we're evaluating</h3>
          <p className="text-sm text-gray-600">{question.signal}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Maximum answer time</h3>
          <p className="text-sm text-gray-600">⏱ {question.maxAnswerTime} seconds</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Competencies assessed</h3>
        <div className="flex flex-wrap gap-2">
          {question.secondTierCompetencies.map((competency, idx) => (
            <span
              key={idx}
              className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
            >
              {competency}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <details className="group">
          <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
            View Scoring Guide
          </summary>
          <div className="mt-4 space-y-2">
            {Object.entries(question.scoringGuide).map(([score, description]) => (
              <div key={score} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="font-bold text-blue-600 min-w-[2rem]">{score}/5</span>
                <span className="text-sm text-gray-700">{description}</span>
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}
