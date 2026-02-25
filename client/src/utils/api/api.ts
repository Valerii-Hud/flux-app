import {
  HttpMethod,
  type Endpoint,
  type PostType,
  type User,
} from '../../types';
import axiosInstance from './axios';
import { errorHandler } from '../handlers/errorHandler';
import { successHandler } from '../handlers/successHandler';

interface Api {
  endpoint: Endpoint;
  data?: User | PostType;
  method?: HttpMethod;
  showSuccessMessage?: boolean;
  showFailMessage?: boolean;
  successMessage?: string;
  apiVersion?: '1' | '2';
}

export const api = async ({
  endpoint,
  data,
  successMessage,
  method = HttpMethod.GET,
  showSuccessMessage = true,
  showFailMessage = true,
  apiVersion = '1',
}: Api) => {
  try {
    const res = await axiosInstance[method](
      `/api/v${apiVersion}${endpoint}`,
      data ? data : undefined
    );
    if (showSuccessMessage && successMessage) {
      successHandler(res.data.message || successMessage);
    }
    return res.data;
  } catch (error) {
    if (showFailMessage) errorHandler(error);
  }
};
