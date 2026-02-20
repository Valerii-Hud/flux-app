import { HttpMethod, type AuthEndpoint, type User } from '../../types';
import axiosInstance from '../api/axios';

interface AuthHelper {
  endpoint: AuthEndpoint;
  formData?: User;
  method?: HttpMethod;
}

export const authHelper = async ({
  endpoint,
  formData,
  method = HttpMethod.POST,
}: AuthHelper) => {
  try {
    const res = await axiosInstance[method](
      `/api/v1/auth/${endpoint}`,
      formData
    );
    return res.data;
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return null;
  }
};
