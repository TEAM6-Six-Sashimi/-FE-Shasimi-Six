'use server';

import { cookies } from "next/headers";
import { saveResume, fetchMyResume, requestAiReview } from "@/services/ai.service";
import { ResumePayload } from "./types";

export async function saveResumeAction(
  payload: ResumePayload,
): Promise<{ success: boolean; resumeId?: number }> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
 
  if (!accessToken) return { success: false };
 
  const result = await saveResume(accessToken, payload);
  if (!result) return { success: false };
 
  return { success: true, resumeId: result.resumeId };
}
 
export async function fetchMyResumeAction(): Promise<ResumePayload | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
 
  if (!accessToken) return null;
 
  return fetchMyResume(accessToken);
}
 
export async function requestAiReviewAction(resumeId: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
 
  if (!accessToken) return null;
 
  return requestAiReview(accessToken, resumeId);
}