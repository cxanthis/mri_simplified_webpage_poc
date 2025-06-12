import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-6 mt-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-4">
        <p>&copy; {new Date().getFullYear()} MRI simplified. All rights reserved.</p>
        <nav className="mt-2 md:mt-0">
          <ul className="flex space-x-4">
          <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
