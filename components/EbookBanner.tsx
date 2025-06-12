import { SignedIn, SignedOut } from '@clerk/nextjs';
import Image from 'next/image';

export default function Banner() {
    return (
        <div className="w-full bg-black text-white p-8 mt-16 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side text content */}
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold">Are you about to take the ARRT exam?</h2>
            <p className="mt-3 text-lg">
              If you want the physical copy of the MRI ebook (MRI Fundamentals, MRI Procedures and MRI Safety), you can download it here.
            </p>
            <SignedIn>
              <button className="mt-6 bg-white text-black px-6 py-2 text-lg hover:bg-gray-300">
                Download Ebook
              </button>
            </SignedIn>
            <SignedOut>
              <button className="mt-6 bg-gray-600 text-gray-300 px-6 py-2 text-lg cursor-not-allowed" disabled>
                Sign in first to get access (it is free)
              </button>
            </SignedOut>
          </div>
    
          {/* Right side image (optional) */}
          <div className="hidden md:block pr-8">
            <Image 
              src="/download_pdf.png" // Ensure the image is in your public folder
              alt="Banner Image"
              width={180} // Adjust as needed
              height={180} // Adjust as needed
            />
          </div>
        </div>
      );
    }
