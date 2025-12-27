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
    const error = new Error(message);
    (error as any).status = res.status;
    throw error;
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

export interface PaginatedResponse<T> {
  matches?: T[];
  jobs?: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function apiGetCandidateMatches(token: string, page = 1, limit = 20) {
  return request<PaginatedResponse<CandidateMatch>>(`/api/candidate/matches?page=${page}&limit=${limit}`, {
    method: "GET",
    token,
  });
}

// Recruiter APIs

export interface RecruiterMatch {
  _id: string;
  score: number;
  topSkills: string[];
  status: "suggested" | "shortlisted" | "contacted" | "rejected" | "hired";
  candidateId: {
    _id: string;
    name: string;
    email: string;
    candidateProfile?: {
      skills?: string[];
      experienceYears?: number;
    };
  };
  jobId: {
    _id: string;
    title: string;
  };
}

export function apiGetRecruiterCandidates(jobId: string, token: string, page = 1, limit = 20) {
  return request<PaginatedResponse<RecruiterMatch>>(`/api/recruiter/candidates/${jobId}?page=${page}&limit=${limit}`, {
    method: "GET",
    token,
  });
}

export function apiGetRecruiterJobs(token: string, page = 1, limit = 20) {
  return request<PaginatedResponse<{ _id: string; title: string; description: string; location?: string; createdAt: string }>>(`/api/recruiter/jobs?page=${page}&limit=${limit}`, {
    method: "GET",
    token,
  });
}

export function apiShortlistCandidate(matchId: string, token: string) {
  return request<{ message: string; match: RecruiterMatch }>(`/api/recruiter/shortlist/${matchId}`, {
    method: "PUT",
    token,
  });
}

export function apiRejectCandidate(matchId: string, token: string) {
  return request<{ message: string; match: RecruiterMatch }>(`/api/recruiter/reject/${matchId}`, {
    method: "PUT",
    token,
  });
}

export function apiUpdateMatchStatus(
  matchId: string,
  status: "suggested" | "shortlisted" | "contacted" | "rejected" | "hired",
  token: string
) {
  return request<{ message: string; match: RecruiterMatch }>(`/api/recruiter/match/${matchId}/status`, {
    method: "PUT",
    body: { status },
    token,
  });
}



