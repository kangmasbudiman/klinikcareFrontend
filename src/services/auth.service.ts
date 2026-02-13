import api, { getCsrfCookie } from "@/lib/axios";
import { User, LoginCredentials } from "@/types/auth";

// Response types from Laravel
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string | null;
}

export interface UpdatePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}

// Auth service functions
const authService = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Get CSRF cookie first (optional for token-based auth, but needed for session-based)
    try {
      await getCsrfCookie();
    } catch {
      // Ignore CSRF error for token-based auth
    }

    // Then login
    const response = await api.post<LoginResponse>(
      "/api/auth/login",
      credentials,
    );

    // Store token and user in localStorage
    if (response.data.success && response.data.data.token) {
      localStorage.setItem("auth_token", response.data.data.token);
      localStorage.setItem(
        "auth_user",
        JSON.stringify(response.data.data.user),
      );
    }

    return response.data;
  },

  /**
   * Logout current user
   */
  async logout(): Promise<LogoutResponse> {
    try {
      const response = await api.post<LogoutResponse>("/api/auth/logout");
      return response.data;
    } finally {
      // Always clear local storage on logout attempt
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<UserResponse> {
    const response = await api.get<UserResponse>("/api/auth/me");
    return response.data;
  },

  /**
   * Check if user is authenticated (local check)
   */
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("auth_token");
  },

  /**
   * Get stored user from localStorage
   */
  getStoredUser(): User | null {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem("auth_user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  },

  /**
   * Update user profile (name, phone)
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<UserResponse> {
    const response = await api.put<UserResponse>("/api/auth/profile", payload);
    if (response.data.success && response.data.data) {
      localStorage.setItem("auth_user", JSON.stringify(response.data.data));
    }
    return response.data;
  },

  /**
   * Update user password
   */
  async updatePassword(
    payload: UpdatePasswordPayload,
  ): Promise<MessageResponse> {
    const response = await api.put<MessageResponse>(
      "/api/auth/password",
      payload,
    );
    return response.data;
  },
};

export default authService;
