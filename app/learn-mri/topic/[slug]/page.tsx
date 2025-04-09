import { notFound } from "next/navigation";
import client from "../../../../sanityClient";
import styles from "./page.module.css";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import SanityArticlesMenuServer from "../../../../components/SanityArticlesMenuServer";
import SidebarToggleLayout from "../../../../components/SidebarToggleLayout";
import Link from "next/link";

interface Item {
  title: string;
  body: string;
  advanced: string;
  clinical: string;
  previousArticle?: {
    title: string;
    slug: string;
  };
  nextArticle?: {
    title: string;
    slug: string;
  };
  parentArticle?: {
    title: string;
    slug: string;
  };
}

// Helper function to trim article titles to a maximum number of characters.
const trimTitle = (title: string, maxLength: number = 25): string => {
  return title.length > maxLength ? title.substring(0, maxLength) + "..." : title;
};

export default async function ItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // If the slug is one of the static pages, render the static content.
  if (slug === "mri-fundamentals") {
    return (
      <SidebarToggleLayout
        sidebar={<SanityArticlesMenuServer activeSlug={slug} />}
        main={
          <article className={styles.tiles}>
            <h2 className={styles.title}>MRI Fundamentals</h2>
            <div className={styles.tile}>
              <p>
                The MRI Fundamentals section is the cornerstone of this book, laying the groundwork for a thorough understanding of magnetic resonance imaging. Here, you will explore the core principles, physics, and instrumentation behind MRI technology.
              </p>
              <p>
                This part of the book is distinct from the sections covering MRI Procedures and MRI Safety. While the latter focus on the practical application and risk management in clinical settings, the fundamentals ensure that you have a solid grasp of the theoretical concepts essential for interpreting and executing advanced imaging techniques.
              </p>
              <p>
                Whether you are a student, researcher, or medical professional, a deep understanding of MRI Fundamentals will enhance your ability to comprehend the more technical aspects of MRI procedures and maintain high standards of safety in practice.
              </p>
            </div>
          </article>
        }
      />
    );
  } else if (slug === "mri-procedures") {
    return (
      <SidebarToggleLayout
        sidebar={<SanityArticlesMenuServer activeSlug={slug} />}
        main={
          <article className={styles.tiles}>
            <h2 className={styles.title}>MRI Procedures</h2>
            <div className={styles.tile}>
              <p>
                The MRI Procedures section provides a detailed overview of the operational protocols involved in MRI imaging. In this section, you will find comprehensive guidelines on patient preparation, imaging sequences, and scanning techniques that ensure accurate and high-quality diagnostic results.
              </p>
              <p>
                This part of the book is dedicated to the practical application of MRI technology. It bridges the gap between the theoretical foundations covered in the MRI Fundamentals section and the real-world execution of imaging procedures, offering step-by-step instructions and best practices.
              </p>
              <p>
                Whether you are a technician, radiologist, or student, this section equips you with the essential tools and techniques to perform MRI scans safely and effectively, making it an indispensable resource for mastering clinical imaging.
              </p>
            </div>
          </article>
        }
      />
    );
  } else if (slug === "mri-safety") {
    return (
      <SidebarToggleLayout
        sidebar={<SanityArticlesMenuServer activeSlug={slug} />}
        main={
          <article className={styles.tiles}>
            <h2 className={styles.title}>MRI Safety</h2>
            <div className={styles.tile}>
              <p>
                The MRI Safety section is focused on the protocols and best practices necessary to maintain a secure imaging environment. It covers essential safety guidelines designed to prevent accidents and protect both patients and healthcare professionals.
              </p>
              <p>
                In this section, you will learn about the potential hazards associated with MRI technology—including strong magnetic fields and radiofrequency energy—and how to mitigate these risks through proper screening, training, and operational procedures.
              </p>
              <p>
                Whether you are a clinician, facility manager, or support staff, the insights provided here will help you establish and maintain a safe working environment, complementing the detailed discussions on MRI Fundamentals and Procedures.
              </p>
            </div>
          </article>
        }
      />
    );
  }

  // Fetch the dynamic article from Sanity, including the navigation references.
  const query = `*[slug.current == $slug][0]{
    title,
    body,
    advanced,
    clinical,
    previousArticle->{
      title,
      "slug": slug.current
    },
    nextArticle->{
      title,
      "slug": slug.current
    },
    parentArticle->{
      title,
      "slug": slug.current
    }
  }`;

  const item: Item | null = await client.fetch(query, { slug });
  if (!item) {
    notFound();
  }

  // Render a fixed three-column navigation bar. Even if a reference is missing, an empty placeholder is used to hold the position.
  const articleNavigation = (
    <nav className={styles.articleNav}>
      <div className={styles.navItem}>
        {item.previousArticle ? (
          <Link
            href={`/learn-mri/topic/${item.previousArticle.slug}`}
            className={styles.navLink}
          >
            &larr; {trimTitle(item.previousArticle.title)}
          </Link>
        ) : (
          <span></span>
        )}
      </div>
      <div className={styles.navItem} style={{ textAlign: "center" }}>
        {item.parentArticle ? (
          <Link
            href={`/learn-mri/topic/${item.parentArticle.slug}`}
            className={styles.navLink}
          >
            Up: {trimTitle(item.parentArticle.title)}
          </Link>
        ) : (
          <span></span>
        )}
      </div>
      <div className={styles.navItem} style={{ textAlign: "right" }}>
        {item.nextArticle ? (
          <Link
            href={`/learn-mri/topic/${item.nextArticle.slug}`}
            className={styles.navLink}
          >
            {trimTitle(item.nextArticle.title)} &rarr;
          </Link>
        ) : (
          <span></span>
        )}
      </div>
    </nav>
  );

  return (
    <SidebarToggleLayout
      sidebar={<SanityArticlesMenuServer activeSlug={slug} />}
      main={
        <article className={styles.tiles}>
          <h2 className={styles.title}>{item.title}</h2>
          <div className={styles.tile}>
            <div dangerouslySetInnerHTML={{ __html: item.body }} />
          </div>
          <div className={styles.tile}>
            <h2>Advanced Concepts for the Enthusiast</h2>
            <div dangerouslySetInnerHTML={{ __html: item.advanced }} />
          </div>
          <div className={styles.tile}>
            <h2>Clinical Relevance</h2>
            <SignedIn>
              <div dangerouslySetInnerHTML={{ __html: item.clinical }} />
            </SignedIn>
            <SignedOut>
              <p>
                This section is available for free to registered users. Sign up using the options that appear at the top of this page.
              </p>
            </SignedOut>
          </div>          
          {articleNavigation}
        </article>
      }
    />
  );
}
