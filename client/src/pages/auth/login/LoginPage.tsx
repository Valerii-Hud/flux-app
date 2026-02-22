import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';

import XSvg from '../../../components/svgs/X';

import { MdOutlineMail } from 'react-icons/md';
import { MdPassword } from 'react-icons/md';
import { HttpMethod, type User } from '../../../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { errorHandler } from '../../../utils/handlers/errorHandler';
import { successHandler } from '../../../utils/handlers/successHandler';
import { api } from '../../../utils/api/api';

const LoginPage = () => {
  const [formData, setFormData] = useState<User>({
    email: '',
    password: '',
  });
  const queryClient = useQueryClient();
  const { mutate: login, isPending } = useMutation({
    mutationFn: (formData: User) =>
      api({ data: formData, endpoint: '/auth/login', method: HttpMethod.POST }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      successHandler('Login successfully');
    },
    onError: (error) => errorHandler(error),
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="text"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white">
            {isPending ? 'Loading...' : 'Login'}
          </button>
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
