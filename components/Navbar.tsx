"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaSignInAlt } from 'react-icons/fa';
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
            <Link
              href="/"
              className="text-xl sm:text-2xl md:text-3xl font-bold whitespace-nowrap"
            >
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
            <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white border rounded-lg shadow-lg max-w-[90vw] lg:hidden z-10">
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
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="bg-navy text-white px-4 py-2 rounded-md font-medium hidden md:block">
                  Sign Up
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button
                  className="bg-[#000000] text-white px-4 py-2 rounded-md font-medium mr-2 flex items-center justify-center whitespace-nowrap"
                >
                  <FaSignInAlt className="h-5 w-5 max-[350px]:block hidden" />
                  <span className="max-[350px]:hidden">Sign In</span>
                </button>
              </SignInButton>
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