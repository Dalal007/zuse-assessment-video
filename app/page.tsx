import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Jabri RoleFit Assessment Builder
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Create comprehensive candidate screening assessments that replace initial screening calls
          and prepare candidates for face-to-face interviews.
        </p>
        <Link
          href="/builder"
          className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
        >
          Create New Assessment
        </Link>
      </div>
    </div>
  );
}
