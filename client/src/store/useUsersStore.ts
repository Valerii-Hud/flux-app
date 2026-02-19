import { create } from 'zustand';
import axiosInstance from '../utils/api/axios';
import type { User } from '../types';

interface UsersStore {
  suggestedUsers: User[] | [];
  setSuggestedUsers: () => void;
}

const useUsersStore = create<UsersStore>((set) => ({
  suggestedUsers: [],
  setSuggestedUsers: async () => {
    const response = await axiosInstance.get('/api/v1/users/suggested');
    console.log(response);
    set({ suggestedUsers: response.data });
  },
}));

export default useUsersStore;
