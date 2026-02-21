import { HttpMethod, type Endpoint, type User } from '../../types';
import axiosInstance from '../api/axios';

interface ApiHelper {
  endpoint: Endpoint;
  formData?: User;
  method?: HttpMethod;
  apiVersion?: '1' | '2';
}

export const apiHelper = async ({
  endpoint,
  formData,
  method = HttpMethod.POST,
  apiVersion = '1',
}: ApiHelper) => {
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
