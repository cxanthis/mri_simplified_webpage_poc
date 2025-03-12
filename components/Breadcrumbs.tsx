import Link from "next/link";
import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex space-x-2 text-sm text-gray-500">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="flex items-center">
            {breadcrumb.href ? (
              <Link href={breadcrumb.href} className="hover:text-gray-700">
                {breadcrumb.label}
              </Link>
            ) : (
              <span>{breadcrumb.label}</span>
            )}
            {index < breadcrumbs.length - 1 && (
              <span className="mx-2">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
