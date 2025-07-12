import axios from 'axios';

export class UserApiService {
  private baseUrl = 'https://jsc-tracker.infinitequack.net';

  async postUser(userId: string, accessToken: string, field: string, value: string) {
    return axios.post(
      `${this.baseUrl}/user/${userId}?access_token=${accessToken}`,
      { [field]: value }
    );
  }

  async getUser(accessToken: string, userId?: string) {
    userId ||= '-'; // look up the user owning the accessToken
    return axios.get(`${this.baseUrl}/user/${userId}?access_token=${accessToken}`);
  }

  async createContact(userId: string | undefined, accessToken: string) {
    userId ||= '-'; // look up the user owning the accessToken
    return axios.post(
      `${this.baseUrl}/user/${userId}/contact/new?access_token=${accessToken}`,
      {}
    );
  }
}

// Export a singleton instance
export const userApiService = new UserApiService();
