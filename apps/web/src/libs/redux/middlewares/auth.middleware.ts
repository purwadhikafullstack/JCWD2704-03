import { Dispatch } from '@reduxjs/toolkit';
import { axiosInstance } from '../../axios.config';
import axios, { AxiosError } from 'axios'; // Import axios and AxiosError
import { login } from '../slices/user.slice';
import { UserLoginPayload, User, UserLoginResponse } from '@/models/user.model';
import { deleteCookie, getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

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
        console.log('Role from response:', role);

        if (role === 'tenant') {
          toast.error('Please log in on the property host login page.');
          return;
        }

        if (access_token) {
          const user: User = jwtDecode(access_token); // Cast to JwtPayload
          dispatch(login(user));
        }

        return { role, url };
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const errorMessage =
            err.response.data.message || 'An unexpected error occurred.';
          toast.error(errorMessage);
          console.log('Axios error response:', err.response);
        } else {
          toast.error('An unexpected error occurred.');
        }
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };
};

export const tenantLogin = ({ email, password }: UserLoginPayload) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axiosInstance().post(
        'api/users/v8',
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
        console.log('Role from response:', role);

        if (role === 'user') {
          console.log('User role detected, showing guest login page error.');
          toast.error('Please log in on the guest login page.');
          return;
        }
        if (access_token) {
          const user: User = jwtDecode(access_token); // Cast to JwtPayload
          dispatch(login(user));
        }

        return { role, url };
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const errorMessage =
            err.response.data.message || 'An unexpected error occurred.';
          toast.error(errorMessage);
          console.log('Axios error response:', err.response);
        } else {
          toast.error('An unexpected error occurred.');
        }
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };
};

// export const userLogin = ({ email, password }: UserLoginPayload) => {
//   return async (dispatch: Dispatch) => {
//     try {
//       const response = await axiosInstance().post(
//         'api/users/v6',
//         {
//           email,
//           password,
//         },
//         {
//           withCredentials: true,
//         },
//       );

//       // Extract data from the response
//       const { role, url } = response.data;

//       if (role === 'tenant') {
//         toast.error('Please log in on the guest login page.');
//         return;
//       }

//       if (role === 'user') {
//         const access_token = getCookie('access_token') || '';
//         if (access_token) {
//           const user: User = jwtDecode(access_token);
//           dispatch(login(user));
//         }
//         return { role, url };
//       }
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         if (err.response) {
//           if (err.response.data.error === 'Unauthorized') {
//             toast.error('Please log in on the guest login page.');
//           } else {
//             toast.error('Wrong email/password');
//           }
//         } else {
//           toast.error('An unexpected error occurred.');
//         }
//       } else {
//         toast.error('An unexpected error occurred.');
//       }
//     }
//   };
// };

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
