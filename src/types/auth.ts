export interface AuthState {
  access_token: string;
}

export interface UserRecord {
  sub: string;
  name: string;
  email: string;
  picture_data?: string;
  created_at: number;
  modified_at: number;
  slack_profile: string;
  twopager: string;
  cmf: string;
  contact_info: string;
}

export interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message: string;
}
