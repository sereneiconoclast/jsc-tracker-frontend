import axios from 'axios';
import { UserRecord } from '../types/auth';

export class UserApiService {
  private baseUrl = 'https://jsc-tracker.infinitequack.net';

  async postUser(userId: string, accessToken: string, field: string, value: string) {
    return axios.post(
      `${this.baseUrl}/user/${userId}?access_token=${accessToken}`,
      { [field]: value }
    );
  }

  async getUser(accessToken: string) {
    return axios.get(`${this.baseUrl}/user/-?access_token=${accessToken}`);
  }
}

// Export a singleton instance
export const userApiService = new UserApiService();
