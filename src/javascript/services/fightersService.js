import { callApi } from '../helpers/apiHelper';

class FighterService {
  async getFighters() {
    try {
      const endpoint = 'user';
      const apiResult = await callApi(endpoint, 'GET');

      return apiResult;
    } catch (error) {
      throw error;
    }
  }

  async getFighterDetails(_id) {
    try {
      const endpoint = `user/${_id}`;
      const apiResult = await callApi(endpoint, 'GET');
      
      return apiResult;
    } catch (error) {
      throw error;
    }
  }
}

export const fighterService = new FighterService();
