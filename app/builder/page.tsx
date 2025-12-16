"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RoleInput } from "@/types/assessment";

export default function BuilderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [formData, setFormData] = useState<RoleInput>({
    roleTitle: "",
    team: "",
    seniority: "Mid",
    yearsExperience: 3,
    techStack: [],
    domainExpertise: [],
    mustHaveSkills: [],
    niceToHaveSkills: [],
    employmentType: "",
    location: "",
    workPattern: "",
    dealBreakers: [],
    companyValues: [],
    cultureNotes: "",
  });

  const [tempArrayItem, setTempArrayItem] = useState({
    techStack: "",
    domainExpertise: "",
    mustHave: "",
    niceToHave: "",
    dealBreaker: "",
    value: "",
  });

  const addArrayItem = (field: keyof typeof tempArrayItem, key: keyof RoleInput) => {
    const value = tempArrayItem[field].trim();
    if (value && Array.isArray(formData[key])) {
      setFormData({
        ...formData,
        [key]: [...(formData[key] as string[]), value],
      });
      setTempArrayItem({ ...tempArrayItem, [field]: "" });
    }
  };

  const removeArrayItem = (key: keyof RoleInput, index: number) => {
    if (Array.isArray(formData[key])) {
      setFormData({
        ...formData,
        [key]: (formData[key] as string[]).filter((_, i) => i !== index),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors([]);

    try {
      const response = await fetch("/api/generate-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (data.details && Array.isArray(data.details)) {
          setValidationErrors(data.details);
          setError(data.error || "Validation failed");
        } else {
          setError(data.error || data.message || "Failed to generate assessment");
        }
        setLoading(false);
        return;
      }

      const assessment = data;
      router.push(`/assessment?data=${encodeURIComponent(JSON.stringify({ roleInput: formData, assessment }))}`);
    } catch (error: any) {
      console.error("Error generating assessment:", error);
      setError(error.message || "Failed to generate assessment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Jabri RoleFit Assessment Builder
          </h1>
          <p className="text-gray-600 mb-8">
            Create a comprehensive screening assessment for your role
          </p>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-red-800 font-semibold mb-2">{error}</h3>
              {validationErrors.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-red-700 font-medium mb-2">Validation Errors:</p>
                  <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                    {validationErrors.map((err, idx) => (
                      <li key={idx}>
                        {err.path?.join(" → ") || "Unknown field"}: {err.message || "Invalid value"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Basic Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.roleTitle}
                  onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="e.g., Senior Backend Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team
                </label>
                <input
                  type="text"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="e.g., Engineering, Product, Marketing"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seniority Level *
                  </label>
                  <select
                    required
                    value={formData.seniority}
                    onChange={(e) => setFormData({ ...formData, seniority: e.target.value as RoleInput["seniority"] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="Junior">Junior</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                    <option value="Manager">Manager</option>
                    <option value="Head">Head</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience Required *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.yearsExperience}
                    onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
              </div>
            </section>

            {/* Skills & Expertise */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Skills & Expertise
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tech Stack
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tempArrayItem.techStack}
                    onChange={(e) => setTempArrayItem({ ...tempArrayItem, techStack: e.target.value })}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("techStack", "techStack"))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="e.g., Node.js, React, PostgreSQL"
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem("techStack", "techStack")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.techStack?.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("techStack", idx)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Domain Expertise
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tempArrayItem.domainExpertise}
                    onChange={(e) => setTempArrayItem({ ...tempArrayItem, domainExpertise: e.target.value })}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("domainExpertise", "domainExpertise"))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="e.g., E-commerce, FinTech, Healthcare"
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem("domainExpertise", "domainExpertise")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.domainExpertise?.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("domainExpertise", idx)}
                        className="text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Must-Have Skills
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tempArrayItem.mustHave}
                    onChange={(e) => setTempArrayItem({ ...tempArrayItem, mustHave: e.target.value })}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("mustHave", "mustHaveSkills"))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="Required skills"
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem("mustHave", "mustHaveSkills")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.mustHaveSkills?.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("mustHaveSkills", idx)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nice-to-Have Skills
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tempArrayItem.niceToHave}
                    onChange={(e) => setTempArrayItem({ ...tempArrayItem, niceToHave: e.target.value })}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("niceToHave", "niceToHaveSkills"))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="Preferred skills"
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem("niceToHave", "niceToHaveSkills")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.niceToHaveSkills?.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("niceToHaveSkills", idx)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Employment Details */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Employment Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Type
                  </label>
                  <input
                    type="text"
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="e.g., Full-time, Contract"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="e.g., Remote, New York, London"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Pattern
                  </label>
                  <input
                    type="text"
                    value={formData.workPattern}
                    onChange={(e) => setFormData({ ...formData, workPattern: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="e.g., 9-5, Flexible, Async"
                  />
                </div>
              </div>
            </section>

            {/* Deal Breakers */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Deal Breakers
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deal Breakers
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tempArrayItem.dealBreaker}
                    onChange={(e) => setTempArrayItem({ ...tempArrayItem, dealBreaker: e.target.value })}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("dealBreaker", "dealBreakers"))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="e.g., Timezone overlap, Salary band, Work rights"
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem("dealBreaker", "dealBreakers")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.dealBreakers?.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("dealBreakers", idx)}
                        className="text-orange-600 hover:text-orange-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Culture & Values */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Culture & Values
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Values
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tempArrayItem.value}
                    onChange={(e) => setTempArrayItem({ ...tempArrayItem, value: e.target.value })}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("value", "companyValues"))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="e.g., Ownership, Customer Focus, Innovation"
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem("value", "companyValues")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.companyValues?.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("companyValues", idx)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Culture Notes
                </label>
                <textarea
                  value={formData.cultureNotes}
                  onChange={(e) => setFormData({ ...formData, cultureNotes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Describe company culture, working style, team dynamics..."
                />
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Generating Assessment..." : "Generate Assessment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

