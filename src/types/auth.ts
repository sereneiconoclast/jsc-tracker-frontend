export interface AuthState {
  access_token: string;
}

export interface UserRecord {
  pk: string;
  created_at: number;
  modified_at: number;
  deactivated_at: number; // 0 if active
  sub: string;
  name: string;
  email: string;
  picture_data?: string;
  slack_profile: string;
  twopager: string;
  cmf: string;
  contact_info: string;
}

export interface ContactRecord {
  pk: string;
  created_at: number;
  modified_at: number;
  deactivated_at: number; // 0 if active
  sub: string;
  contact_id: string;
  name: string;
  contact_info: string;
  notes: string;
  status: string;
}

export interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message: string;
}
