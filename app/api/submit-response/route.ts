import { NextResponse } from "next/server";
import { QuestionResponse } from "@/types/assessment";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { assessmentId, questionId, videoBlob, answerText, score, notes } = body;

    if (!assessmentId || !questionId) {
      return NextResponse.json(
        { error: "Missing required fields: assessmentId, questionId" },
        { status: 400 }
      );
    }

    // In a production system, you would:
    // 1. Store the video blob in cloud storage (S3, Cloudinary, etc.)
    // 2. Save the response to a database
    // 3. Update the assessment session status
    // For now, we'll just log and return success

    const response: QuestionResponse = {
      questionId,
      videoUrl: videoBlob ? "stored_video_url" : undefined,
      answerText,
      score,
      notes,
    };

    console.log("Received response:", {
      assessmentId,
      questionId,
      hasVideo: !!videoBlob,
      score,
    });

    // TODO: Implement actual storage
    // await storeVideo(assessmentId, questionId, videoBlob);
    // await saveResponse(assessmentId, response);

    return NextResponse.json(
      {
        success: true,
        message: "Response submitted successfully",
        responseId: `resp_${Date.now()}`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error submitting response:", error);
    return NextResponse.json(
      {
        error: "Failed to submit response",
        message: error.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

