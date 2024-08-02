import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { User } from '@/models/user.model';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('refresh_token')?.value || '';

  const response = NextResponse.next();

  const res = await fetch(
    process.env.NEXT_PUBLIC_BASE_API_URL + 'api/users/v7',
    {
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  )
    .then(async (res) => {
      console.log(res.status);

      if (res.status != 200) throw new Error('');
      const data = await res.json();
      response.cookies.set('access_token', data.access_token);
      return data;
    })
    .catch((err) => {
      return false;
    });

  const access_token = response.cookies.get('access_token')?.value || '';
  let decode = undefined;
  let isUser = false;
  let is_verified = false;
  try {
    decode = jwtDecode<User>(access_token);
    // console.log(decode, 'ini decode');

    isUser = decode.role === 'user';

    is_verified = !!decode.isVerified && !decode.isRequestingEmailChange;

    const not_verified = !decode.isVerified && !decode.isRequestingEmailChange;
  } catch (error) {
    console.error('Error decoding token:', error);
  }

  const validate = res ? true : false;

  console.log(res, validate, is_verified);
  console.log(pathname.startsWith('/dashboard'), validate, isUser);
  console.log(decode?.role);

  if (!token) {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/profile')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (pathname.startsWith('/reservation')) {
      return NextResponse.redirect(new URL('/auth/login/user', request.url));
    }
    return response;
  }

  // Added condition to handle redirect for the root path and dashboard path
  if (pathname === '/' && validate && is_verified && !isUser) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } else if (pathname === '/dashboard' && !validate) {
    return NextResponse.redirect(new URL('/', request.url));
  } else if (
    validate &&
    (pathname === '/' || pathname === '/dashboard') &&
    !is_verified
  ) {
    return NextResponse.redirect(new URL('/verification', request.url));
  }

  // Added condition to redirect users with the 'user' role from any dashboard path
  else if (pathname.startsWith('/dashboard') && validate && isUser) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Handle redirection for authentication paths based on user role
  else if (validate && pathname.startsWith('/auth')) {
    if (!isUser) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Handle redirection for verification path based on verification status and user role
  else if (validate && pathname === '/verification' && is_verified) {
    if (!isUser) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (
    validate &&
    !isUser &&
    (pathname.startsWith('/reservatiion') ||
      pathname.startsWith('/invoice') ||
      pathname.startsWith('/property') ||
      pathname.startsWith('/success') ||
      pathname.startsWith('/profile'))
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  if (!token && pathname.startsWith('/reservation')) {
    {
      return NextResponse.redirect(new URL('/auth/login/user', request.url));
    }
  }
  return response;
}

export const config = {
  matcher: [
    '/',
    '/auth/:path*',
    '/verification',
    '/dashboard/:path*',
    '/reservation/:path*',
    '/invoice/:path*',
    '/property/:path*',
    '/success',
    '/profile/:path*',
  ],
};
