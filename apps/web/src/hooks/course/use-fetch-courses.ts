import { fetchCourses, type FetchCoursesResponse } from "@/api/fetch-courses";
import { useQuery } from "@tanstack/react-query";

export function useFetchCourses(slug: string | undefined) {
  return useQuery<FetchCoursesResponse, Error>({
    queryKey: ["courses", slug],
    queryFn: () => fetchCourses({ slug: slug! }),
    enabled: !!slug,
  });
}
