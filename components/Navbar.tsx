"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  const linkClass = (path: string) =>
    `font-medium ${isActive(path) ? 'text-[#dc2626] border-b-2 border-[#dc2626]' : 'text-gray-900 hover:text-[#dc2626]'}`;

  return (
    <nav className="border-b border-gray-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <button
              className="lg:hidden p-2 mr-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <Link href="/" className="text-3xl font-bold">
              MRI simplified
            </Link>
          </div>

          <div className="hidden lg:flex space-x-8">
            <Link href="/learn-mri" className={linkClass('/learn-mri')}>
              Learn MRI
            </Link>
            <Link href="/news" className={linkClass('/news')}>
              News
            </Link>
            <Link href="/research-topic" className={linkClass('/research-topic')}>
              Research
            </Link>
            <Link href="/podcasts" className={linkClass('/podcasts')}>
              Podcasts
            </Link>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="absolute top-20 left-0 w-full bg-white border-b lg:hidden z-10">
              <div className="flex flex-col p-4 space-y-2">
                <Link href="/learn-mri" className={linkClass('/learn-mri')}
                  onClick={() => setMenuOpen(false)}>
                  Learn MRI
                </Link>
                <Link href="/news" className={linkClass('/news')}
                  onClick={() => setMenuOpen(false)}>
                  News
                </Link>
                <Link href="/research-topic" className={linkClass('/research-topic')}
                  onClick={() => setMenuOpen(false)}>
                  Research
                </Link>
                <Link href="/podcasts" className={linkClass('/podcasts')}
                  onClick={() => setMenuOpen(false)}>
                  Podcasts
                </Link>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <button className="p-2 mr-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-[#000000] text-white px-4 py-2 rounded-md font-medium mr-2">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-navy text-white px-4 py-2 rounded-md font-medium hidden md:block">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}