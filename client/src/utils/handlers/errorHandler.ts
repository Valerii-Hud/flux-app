import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export const errorHandler = (error: unknown) => {
  if (error instanceof AxiosError) {
    toast.error(error.response?.data.error);
  } else {
    toast.error('Something went wrong');
  }
  return undefined;
};
