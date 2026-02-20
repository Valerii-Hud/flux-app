import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export const errorHandler = (error: unknown) => {
  return error instanceof AxiosError
    ? toast.error(error.response?.data.error)
    : toast.error('Something went wrong');
};
