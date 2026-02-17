import { api } from "@/lib/axios";

export type Course = {
  id: string;
  title: string;
  description: string | null;
};

export type FetchCoursesResponse = {
  courses: Course[];
};

export async function fetchCourses({
  slug,
}: {
  slug: string;
}): Promise<FetchCoursesResponse> {
  const response = await api.get<FetchCoursesResponse>(
    `/organizations/${slug}/courses`
  );
  return response.data;
}
