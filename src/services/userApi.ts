import axios from 'axios';

export class UserApiService {
  private baseUrl = 'https://jsc-tracker.infinitequack.net';

  async getUser(accessToken: string, userId?: string) {
    userId ||= '-'; // look up the user owning the accessToken
    return axios.get(`${this.baseUrl}/user/${userId}?access_token=${accessToken}`);
  }

  async postUser(accessToken: string, field: string, value: string, userId?: string) {
    userId ||= '-'; // look up the user owning the accessToken
    return axios.post(
      `${this.baseUrl}/user/${userId}?access_token=${accessToken}`,
      { [field]: value }
    );
  }

  // TODO: Consider whether we ever want to allow passing a userId here
  async createContact(accessToken: string, userId?: string) {
    userId ||= '-'; // look up the user owning the accessToken
    return axios.post(
      `${this.baseUrl}/user/${userId}/contact/new?access_token=${accessToken}`,
      {}
    );
  }

  // TODO: Consider whether we ever want to allow passing a userId here
  async postContact(accessToken: string, contactId: string, field: string, value: string, userId?: string) {
    userId ||= '-'; // look up the user owning the accessToken
    return axios.post(
      `${this.baseUrl}/user/${userId}/contact/${contactId}?access_token=${accessToken}`,
      { [field]: value }
    );
  }

  // TODO: Consider whether we ever want to allow passing a userId here
  async archiveContact(accessToken: string, contactId: string, userId?: string) {
    userId ||= '-'; // look up the user owning the accessToken
    return axios.delete(
      `${this.baseUrl}/user/${userId}/contact/${contactId}?access_token=${accessToken}`
    );
  }
}

// Export a singleton instance
export const userApiService = new UserApiService();
