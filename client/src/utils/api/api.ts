import { HttpMethod, type Endpoint, type User } from '../../types';
import axiosInstance from './axios';

interface Api {
  endpoint: Endpoint;
  formData?: User;
  method?: HttpMethod;
  apiVersion?: '1' | '2';
}

export const api = async ({
  endpoint,
  formData,
  method = HttpMethod.POST,
  apiVersion = '1',
}: Api) => {
  try {
    const res = await axiosInstance[method](
      `/api/v${apiVersion}${endpoint}`,
      formData ? formData : undefined
    );
    return res.data;
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return null;
  }
};
