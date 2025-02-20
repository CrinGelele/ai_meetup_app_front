import { Api } from './Api';

export const api = new Api({
    baseURL: import.meta.env.VITE_SERVER_URL + '/api/api/'
});