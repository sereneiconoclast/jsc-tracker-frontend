import axios from 'axios';

export interface AdminUserSearchParams {
  name?: string;
  email?: string;
  jsc?: string;
  admin_only?: boolean;
}

export interface AdminUserRecord {
  sub: string;
  name: string;
  email: string;
  picture_data?: string;
  jsc?: string;
  roles?: string[];
}

export interface AdminUserSearchResponse {
  users: AdminUserRecord[];
}

export class AdminApiService {
  private baseUrl = 'https://jsc-tracker.infinitequack.net';

  async searchUsers(accessToken: string, params: AdminUserSearchParams = {}) {
    const queryParams = new URLSearchParams();
    queryParams.append('access_token', accessToken);

    if (params.name) queryParams.append('name', params.name);
    if (params.email) queryParams.append('email', params.email);
    if (params.jsc) queryParams.append('jsc', params.jsc);
    if (params.admin_only) queryParams.append('admin_only', 'true');

    return axios.get<AdminUserSearchResponse>(
      `${this.baseUrl}/admin/users/search?${queryParams.toString()}`
    );
  }

  async assignUsersToJsc(accessToken: string, userSubs: string[], jscNumber: string) {
    return axios.post(
      `${this.baseUrl}/admin/users/assign?access_token=${accessToken}`,
      {
        user_subs: userSubs,
        jsc_number: jscNumber
      }
    );
  }

  async grantAdmin(accessToken: string, userSub: string) {
    return axios.post(
      `${this.baseUrl}/admin/users/grant_admin?access_token=${accessToken}`,
      { user_sub: userSub }
    );
  }

  async revokeAdmin(accessToken: string, userSub: string) {
    return axios.post(
      `${this.baseUrl}/admin/users/revoke_admin?access_token=${accessToken}`,
      { user_sub: userSub }
    );
  }
}

// Export a singleton instance
export const adminApiService = new AdminApiService();
