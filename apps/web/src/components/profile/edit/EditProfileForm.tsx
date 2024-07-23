'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/app/hooks';
import { axiosInstance } from '@/libs/axios.config';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCookie } from 'cookies-next';
import { User } from '@/models/user.model';
import { jwtDecode } from 'jwt-decode';
import { login } from '@/libs/redux/slices/user.slice';

function EditProfileForm() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth);

  const imageRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const dispatch = useDispatch();

  const initialValues = {
    image: null as string | File | null,
    first_name: '',
    last_name: '',
    email: '',
  };

  const validationSchema = Yup.object().shape({
    image: Yup.mixed().required('Picture is required'),
    first_name: Yup.string()
      .required('First name is required')
      .min(3, 'First name must have at least 3 characters'),
    last_name: Yup.string()
      .required('Last name is required')
      .min(3, 'Last name must have at least 3 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log('Form values:', values);

        const formData = new FormData();
        formData.append('first_name', values.first_name);
        formData.append('last_name', values.last_name);
        formData.append('email', values.email);

        if (values.image) {
          formData.append('image', values.image);
        }
        console.log('Try editing user profile:', formData);

        await axiosInstance().patch('/api/users/edit', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });

        // const token = getCookie('access_token');
        // if (token) {
        //   const decode = jwtDecode(token) as { user: User };
        //   dispatch(login(decode.user));
        // }

        alert('User berhasil edit data');
        router.push(`/profile/show/${user?.id}`);
      } catch (error) {
        console.log(error);
        if (error instanceof AxiosError) {
          alert(error.response?.data.message);
        }
      }
    },
  });

  useEffect(() => {
    console.log('User object:', user);
    if (user?.id) {
      const imgSrc = user.id
        ? `http://localhost:8000/api/users/image/${user.id}`
        : null;

      console.log(imgSrc);

      formik.setValues({
        image: user.image ? imgSrc : null,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
      setImagePreview(imgSrc);
    }
  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);

      if (file.size > 1048576) {
        toast.error('File size exceeds 1MB. Please select a smaller file.', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center w-screen">
      <form
        onSubmit={formik.handleSubmit}
        className="tracking-tighter flex flex-col gap-2 w-full"
      >
        <div className="form-group">
          <div className="label">
            <span className="label-text font-semibold">Profile Picture</span>
          </div>

          <div className="flex flex-row gap-4 items-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt=""
                className="img-thumbnail circle-img w-28 h-28 object-cover rounded-full border-zinc-400 border-2 bg-zinc-300"
              />
            ) : null}

            <div className="image-preview-container mt-2">
              <input
                id="image"
                name="image"
                type="file"
                className="form-control"
                onChange={handleFileChange}
                ref={imageRef}
              />
              {formik.touched.image && formik.errors.image ? (
                <div className="text-danger text-xs mt-2">
                  {formik.errors.image}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="form-group w-full">
          <div className="label">
            <span className="label-text font-semibold">First Name</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            id="first_name"
            name="first_name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.first_name}
            className="form-control input input-bordered w-full"
          />
          {formik.touched.first_name && formik.errors.first_name ? (
            <div className="text-danger text-xs mt-2">
              {formik.errors.first_name}
            </div>
          ) : null}
        </div>
        <div className="form-group w-full">
          <div className="label">
            <span className="label-text font-semibold">Last Name</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            id="last_name"
            name="last_name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.last_name}
            className="form-control input input-bordered w-full"
          />
          {formik.touched.last_name && formik.errors.last_name ? (
            <div className="text-danger text-xs mt-2">
              {formik.errors.last_name}
            </div>
          ) : null}
        </div>
        <div className="form-group w-full">
          <div className="label">
            <span className="label-text font-semibold">Email Address</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            id="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className=" file-input file-input-bordered w-full"
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-danger text-xs mt-2">
              {formik.errors.email}
            </div>
          ) : null}
        </div>

        <div className="form-group mt-4">
          <button type="button" className="btn btn-dark">
            Save Changes
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default EditProfileForm;
