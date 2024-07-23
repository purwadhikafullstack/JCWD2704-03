'use client';
import { useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { setCheckIn, setCheckOut } from '@/libs/redux/slices/checkInOut.slice';

export default function CheckInOutProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  const initializeCheckInOut = () => {
    dispatch(setCheckIn(new Date().toISOString().split('T')[0]));
    dispatch(
      setCheckOut(new Date(Date.now() + 86400000).toISOString().split('T')[0]),
    );
  };

  useEffect(() => {
    initializeCheckInOut();
  }, [dispatch]);

  return <>{children}</>;
}
