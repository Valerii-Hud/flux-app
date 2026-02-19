import type { ChangeEvent } from 'react';
import { create } from 'zustand';
import type { User } from '../types';

interface AuthFormStore {
  user: User;

  resetStates: () => void;
  setUserAuthData: (event: ChangeEvent<HTMLInputElement>) => void;
}

const useAuthFormStore = create<AuthFormStore>((set, get) => ({
  user: {
    email: '',
    userName: '',
    fullName: '',
    password: '',
  },
  setUserAuthData: (event) => {
    const { user } = get();
    set({
      user: {
        ...user,
        [event?.target.name]: event.target.value,
      },
    });
  },
  resetStates: () => {
    set({
      user: {
        email: '',
        userName: '',
        fullName: '',
        password: '',
      },
    });
  },
}));

export default useAuthFormStore;
