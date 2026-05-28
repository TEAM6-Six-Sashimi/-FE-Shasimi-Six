import { ApprovedCourse } from "@/features/user/mycourses-instructor/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchApprovedCourses(accessToken: string): Promise<ApprovedCourse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/instructor/courses/approved`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    console.log('fetchApprovedCourses status:', response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.log('fetchApprovedCourses error body:', errorBody);
      return [];
    }

    const data = await response.json();
    console.log('fetchApprovedCourses data:', data);
    return data;
  } catch (e) {
    console.log('fetchApprovedCourses error:', e);
    return [];
  }
}