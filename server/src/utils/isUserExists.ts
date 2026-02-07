import User from '../models/user.model';

interface UserExists {
  data: string;
  key: 'email' | 'userName';
}

export const isUserExists = async ({ key, data }: UserExists) => {
  const user = await User.find({ [`${key}`]: data });
  return !(user.length === 0);
};
