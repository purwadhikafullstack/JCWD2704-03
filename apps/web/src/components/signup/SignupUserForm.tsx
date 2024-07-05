'use client';
import React, { useState } from 'react';
import * as Yup from 'yup';
import YupPassword from 'yup-password';
import { useFormik } from 'formik';
import { axiosInstance } from '@/libs/axios.config';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';

function SignupUserForm() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  YupPassword(Yup);

  const initialValues = {
    email: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required('Email is required')
        .email('Invalid email address'),
    }),
    onSubmit: async (values, formikHelpers) => {
      try {
        console.log('Sign up as user starts');

        await axiosInstance().post('/api/users/v1', values);

        router.push(`/verification?email=${values.email}`);
      } catch (error) {
        console.error('Error signing up:', error);
        Swal.fire({
          icon: 'error',
          title: 'Sign Up Failed',
          text: 'An error occurred while signing up. Please try again later.',
        });
      }
    },
  });

  const isSubmitDisabled =
    !isChecked || !formik.values.email || !!formik.errors.email;

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        {/* HEADER SECTION */}
        <div className=" mb-3 flex items-center justify-center flex-col">
          <img
            src="https://i.ibb.co.com/QPvYKBk/1.png"
            alt=""
            className="w-24"
          />
          <h2 className="font-bold">Create your account</h2>
          <div className="text-zinc-400">Let's get started with Atcasa</div>
        </div>

        {/* login google */}
        <div>
          <button className="btn btn-outline-dark w-full " type="submit">
            <div className="flex flex-row justify-center items-center gap-1">
              <div>
                <img
                  src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                  className="w-8 h-8"
                  alt=""
                />
              </div>

              <div className="font-semibold">Login with Google</div>
            </div>
          </button>

          {/* OR SECTION */}
          <div className="flex flex-row justify-center items-center my-3">
            <div className="text-xs">
              <span className="text-zinc-400">—————————</span>
              <span> or </span>
              <span className="text-zinc-400">—————————</span>
            </div>
          </div>

          {/* FORM SUBMIT EMAIL */}
          <form onSubmit={formik.handleSubmit} className="flex flex-col w-60">
            <div className="form-floating w-full">
              <input
                type="email"
                className="form-control mb-3"
                id="floatingInput"
                placeholder="name@example.com"
                {...formik.getFieldProps('email')}
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-700 text-xs mb-3">
                {formik.errors.email}
              </div>
            ) : null}

            {/* // TERMS AND CONDITION */}
            <div className="flex flex-row  gap-2 items-center">
              <input
                type="checkbox"
                className="checkbox"
                onChange={() => setIsChecked(!isChecked)}
              />
              <div className="text-xs">
                I agree to
                <span className="font-semibold text-[#263C94] cursor-pointer">
                  {' '}
                  Terms & Privacy Policy
                </span>
              </div>
            </div>
            {/* TODO: BIKIN KALO BLM CENTANG GAK BISA SUBMIT */}
            <button
              className="btn bsb-btn-xl btn-dark w-full my-3"
              type="submit"
              disabled={isSubmitDisabled}
            >
              Sign up
            </button>
          </form>

          <div className="text-xs flex flex-row gap-1">
            <div>Already have an account?</div>
            <Link
              href="/auth/login/user"
              className="font-semibold text-[#263C94] no-underline"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupUserForm;
