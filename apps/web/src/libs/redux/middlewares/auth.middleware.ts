import { Dispatch } from '@reduxjs/toolkit';
import { axiosInstance } from '../../axios.config';
import { login } from '../slices/user.slice';
import { UserLoginPayload, User } from '@/models/user.model';
import { deleteCookie, getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';

export const userLogin = ({ email, password }: UserLoginPayload) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axiosInstance().post(
        'api/users/v6',
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );

      const access_token = getCookie('access-token') || '';
      console.log(access_token);

      if (response.data) {
        const { role, url } = response.data;

        if (access_token) {
          const user: User = jwtDecode(access_token); // Cast to JwtPayload
          dispatch(login(user));
        }

        return { role, url };
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        deleteCookie('access-token');
        alert('Wrong email/password');
      }
    }
  };
};

export const keepLogin = () => {
  return async (dispatch: Dispatch) => {
    try {
      const token = getCookie('access_token');
      if (token) {
        dispatch(login(jwtDecode(token)));
      }
      // const res = await axiosInstance().get("/users", {
      //   params: { username: storage.username },
      // });
      // const user: TUser = res.data[0];

      // if (user.id) {
      //   dispatch(login(user));
      // }
      // return;
    } catch (err: any) {
      deleteCookie('access_token');
      // window.location.reload();
      // return err.message;
    }
  };
};
