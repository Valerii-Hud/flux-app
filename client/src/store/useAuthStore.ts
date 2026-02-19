import { create } from 'zustand';
import useAuthFormStore from './useAuthFormStore';
import { errorHandler, type User } from '../types';
import axiosInstance from '../utils/api/axios';
import toast from 'react-hot-toast';

type Endpoint = 'signup' | 'login' | 'logout' | 'check-auth';
type Method = 'get' | 'post';

interface AuthStore {
  user: User | null;
  helperAuth: (
    endpoint: Endpoint,
    successMessage?: string,
    method?: Method
  ) => void;
  signup: () => void;
  login: () => void;
  logout: () => void;
  checkAuth: () => void;
}

const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  helperAuth: async (endpoint, successMessage, method = 'post') => {
    const { user, resetStates } = useAuthFormStore.getState();
    try {
      const response = await axiosInstance[method](
        `/api/v1/auth/${endpoint}`,
        method === 'post' ? user : undefined
      );

      set({ user: response.data });

      if (response.status === 200 || response.status === 201) {
        resetStates();

        if (successMessage)
          toast.success(response.data.message || successMessage);
      }
    } catch (error) {
      if (endpoint !== 'check-auth') errorHandler(error);
    }
  },
  signup: () => {
    const { helperAuth } = get();
    helperAuth('signup', 'Signup successfully');
  },
  login: () => {
    const { helperAuth } = get();
    helperAuth('login', 'Login successfully');
  },
  logout: () => {
    const { helperAuth } = get();
    helperAuth('logout');
  },
  checkAuth: () => {
    const { helperAuth } = get();
    helperAuth('check-auth', undefined, 'get');
  },
}));

export default useAuthStore;
