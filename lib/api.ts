interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const fetchApi = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const baseUrl = "http://localhost:8080/api";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${baseUrl}${url}`, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("API call failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const get = <T>(url: string) => fetchApi<T>(url, { method: "GET" });
export const post = <T>(url: string, body: any) =>
  fetchApi<T>(url, { method: "POST", body: JSON.stringify(body) });
export const put = <T>(url: string, body: any) =>
  fetchApi<T>(url, { method: "PUT", body: JSON.stringify(body) });
export const remove = <T>(url: string) =>
  fetchApi<T>(url, { method: "DELETE" });
