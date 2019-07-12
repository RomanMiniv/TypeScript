// import { callApi } from '../helpers/apiHelper';

// class FighterService {
//   async getFighters() {
//     try {
//       const endpoint = 'user';
//       const apiResult = await callApi(endpoint, 'GET');

//       return apiResult;
//     } catch (error) {
//       throw error;
//     }
//   }

//   async getFighterDetails(_id) {
//     try {
//       const endpoint = `user/${_id}`;
//       const apiResult = await callApi(endpoint, 'GET');

//       return apiResult;
//     } catch (error) {
//       throw error;
//     }
//   }
// }

// export const fighterService = new FighterService();

import { callApi } from '../helpers/apiHelper';

export interface IFighterData {
	_id: number | string;
	name: string;
	source: string;
}

export interface IFighterDetails extends IFighterData {
	health: number;
	attack: number;
	defense: number;
}

class FighterService {
	public async getFighters() {
		try {
			const endpoint: string = 'user';
			const apiResult: IFighterData[] = await callApi(endpoint, 'GET');

			return apiResult;
		} catch (error) {
			throw error;
		}
	}

	public async getFighterDetails(_id: number | string) {
		try {
			const endpoint = `user/${_id}`;
			const apiResult: IFighterDetails = await callApi(endpoint, 'GET');

			return apiResult;
		} catch (error) {
			throw error;
		}
	}
}

export const fighterService = new FighterService();
