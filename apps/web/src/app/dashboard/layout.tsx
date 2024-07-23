import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.css';
import SidebarDash from '@/components/SidebarDash';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Atcasa',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} flex h-screen`}>
      <SidebarDash />
      <main className="flex-grow p-4 overflow-auto">{children}</main>
    </div>
  );
}
