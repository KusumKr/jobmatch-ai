export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(
  path: string,
  options: { method?: HttpMethod; body?: unknown; token?: string } = {},
): Promise<T> {
  const { method = "GET", body, token } = options;

  const res = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "candidate" | "recruiter";
  };
}

export function apiSignup(payload: {
  name: string;
  email: string;
  password: string;
  role: "candidate" | "recruiter";
}) {
  return request<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: payload,
  });
}

export function apiLogin(payload: {
  email: string;
  password: string;
}) {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: payload,
  });
}

// File upload helper for candidate resume

export async function apiUploadResume(file: File, token: string) {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch(`${BACKEND_URL}/api/candidate/upload-resume`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Upload failed with status ${res.status}`;
    throw new Error(message);
  }

  return data as { message: string; skills?: string[]; experienceYears?: number };
}

// Candidate APIs

export interface CandidateMatch {
  _id: string;
  score: number;
  topSkills: string[];
  jobId: {
    _id: string;
    title: string;
    description: string;
    location?: string;
    salaryRange?: {
      min?: number;
      max?: number;
      currency?: string;
    };
  };
}

export function apiGetCandidateMatches(token: string) {
  return request<CandidateMatch[]>("/api/candidate/matches", {
    method: "GET",
    token,
  });
}



