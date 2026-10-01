import axios from 'axios';
import { store } from '../store/store';
import { hideLoader, showLoader } from '../slices/LoaderSlice';
import {
  showMiracleError,
  showMiracleSession,
  triggerCloseAllModals,
} from '../slices/MiracleGlobalModalSlice';
import Config from 'react-native-config';
 
const BASE_URL = Config.BASE_URL;
 
export const axiosInstance = axios.create({
  baseURL: "https://miraclebanking.com:9087/mfmbs/mbintf/ina/processapirequest.jsp",
  headers: { 'Content-Type': 'application/json' },
  responseType: 'text',
});
// const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
const delay = '';
const HIDE_DELAY = 800;
 
axiosInstance.interceptors.request.use((config) => {
  store.dispatch(showLoader());
     const sessionId = ""
  // const sessionId = store.getState().session.sessionId;
 
  if (config.data && typeof config.data === 'object' && sessionId) {
    if (!config.data.ReqSessionID) {
      config.data = { ...config.data, ReqSessionID: sessionId };
    }
  }
 
  return config;
});
 axiosInstance.interceptors.response.use(
  async (response) => {
    // await delay(HIDE_DELAY);
    store.dispatch(hideLoader());
 
    let parsedData: any;
    try { 
      parsedData =
        typeof response.data === 'string'
          ? JSON.parse(response.data)
          : response.data;
    } catch (e) {
      store.dispatch(
        showMiracleError({
          title: 'Response Error',
          message: 'Invalid response format from server.',
        })
      );
      return Promise.reject(e);
    }
 
    if (
      parsedData?.statuscodep === '98' ||
      parsedData?.statusCode === '98'
    ) {
      const resultMessage = (parsedData?.ResultMessage ?? '').trim();
 
      if (resultMessage === 'Session Timed Out') {
        store.dispatch(triggerCloseAllModals());
        store.dispatch(showMiracleSession({ message: resultMessage }));
        return Promise.reject({ __handled: true });
      }
 
      return parsedData;
    }
 
    
    const rm = parsedData?.ResultMessage;
    if (rm && typeof rm === 'string') {
      const trimmed = rm.trim();
 
      if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
        parsedData = {
          ...parsedData,
          ResultMessage: JSON.stringify({
            Status: '01',
            Message: trimmed,
          }),
        };
      }
    }
 
    return parsedData;
  },
   async (error) => {
    // await delay(HIDE_DELAY);
    store.dispatch(hideLoader());
 
    const isNetworkError =
      error?.message === 'Failed to fetch' ||
      error?.code === 'ECONNABORTED' ||
      error?.name === 'TypeError'
 
    store.dispatch(
      showMiracleError({
        title: isNetworkError ? 'Network Error' : 'Error',
        message: isNetworkError
          ? 'Please check your internet connection and try again.'
          : 'Something went wrong. Please try again later.',
      })
    );
 
    return Promise.reject({ __handled: true });
  }
);
 
export default axiosInstance;