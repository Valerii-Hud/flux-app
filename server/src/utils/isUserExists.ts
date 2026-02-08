import User from '../models/user.model';

interface UserExists {
  data: string;
  key: 'email' | 'userName';
}

export const isUserExists = async ({ key, data }: UserExists) => {
  return !!(await User.exists({ [`${key}`]: data }));
};
