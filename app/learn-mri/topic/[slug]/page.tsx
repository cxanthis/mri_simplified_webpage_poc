import { notFound } from "next/navigation";
import Head from "next/head";
import { Metadata } from "next";
import Image from "next/image";
import client from "../../../../sanityClient";
import styles from "./page.module.css";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import SanityArticlesMenuServer from "../../../../components/SanityArticlesMenuServer";
import SidebarToggleLayout from "../../../../components/SidebarToggleLayout";
import Link from "next/link";
import MarkCompleteButton from "@/components/MarkCompleteButton";

interface SEO {
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  canonicalUrl?: string;
  structuredData?: string;
  metaRobots?: string;
  og?: {
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: {
      asset?: { url: string };
    };
  };
  twitter?: {
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: {
      asset?: { url: string };
    };
  };
}

interface ArticleNavigation {
  title: string;
  slug: string;
  articleType?: "part" | "chapter" | "section" | "sub-section" | "topic";
}

interface Item {
  title: string;
  body: string;
  advanced: string;
  clinical: string;
  images?: {
    position: number;
    image: {
      asset: { url: string };
      caption?: string;
    };
  }[];
  seo?: SEO;
  previousArticle?: ArticleNavigation;
  nextArticle?: ArticleNavigation;
  parentArticle?: ArticleNavigation;
  chapter_id: string;
}

// Return type for generateMetadata
type ArticleMeta = {
  title: string;
  seo?: SEO;
  previousArticle?: ArticleNavigation;
  nextArticle?: ArticleNavigation;
  parentArticle?: ArticleNavigation;
};

// Helper to trim nav titles
function trimTitle(title: string, length = 20) {
  return title.length > length ? `${title.substr(0, length)}…` : title;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const query = `*[slug.current == $slug][0]{ 
    title,
    seo {
      seoTitle,
      seoDescription,
      seoKeywords,
      canonicalUrl,
      structuredData,
      metaRobots,
      og {
        ogTitle,
        ogDescription,
        ogImage{ asset->{ url } }
      },
      twitter {
        twitterTitle,
        twitterDescription,
        twitterImage{ asset->{ url } }
      }
    },
    previousArticle->{
      title,
      "slug": slug.current,
      articleType
    },
    nextArticle->{
      title,
      "slug": slug.current,
      articleType
    },
    parentArticle->{
      title,
      "slug": slug.current,
      articleType
    }
  }`;

  // typed fetch to avoid `any`
  const article = await client.fetch<ArticleMeta | null>(query, { slug });
  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article was not found.",
    };
  }
  const seo = article.seo ?? {};
  return {
    title: seo.seoTitle || article.title,
    description: seo.seoDescription || "",
    keywords: seo.seoKeywords,
    alternates: { canonical: seo.canonicalUrl },
    robots: seo.metaRobots,
    openGraph: {
      title: seo.og?.ogTitle || seo.seoTitle || article.title,
      description: seo.og?.ogDescription || seo.seoDescription || "",
      images: seo.og?.ogImage?.asset?.url
        ? [{ url: seo.og.ogImage.asset.url }]
        : undefined,
    },
    twitter: {
      title: seo.twitter?.twitterTitle || seo.seoTitle || article.title,
      description: seo.twitter?.twitterDescription || seo.seoDescription || "",
      images: seo.twitter?.twitterImage?.asset?.url
        ? [{ url: seo.twitter.twitterImage.asset.url }]
        : undefined,
    },
  };
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Static pages
  if (slug === "mri-fundamentals") {
    return (
      <>
        <Head>
          <title>MRI Fundamentals</title>
          <meta
            name="description"
            content="Learn the core principles, physics, and instrumentation behind MRI technology."
          />
        </Head>
        <SidebarToggleLayout
          sidebar={<SanityArticlesMenuServer activeSlug={slug} />}
          main={
            <article className={styles.tiles}>
              <h2 className={styles.title}>MRI Fundamentals</h2>
              <div className={styles.tile}>
                <p>
                  The MRI Fundamentals section is the cornerstone of this book,
                  laying the groundwork for a thorough understanding of magnetic
                  resonance imaging. Here, you will explore the core principles,
                  physics, and instrumentation behind MRI technology.
                </p>
                <p>
                  This part of the book is distinct from the sections covering MRI
                  Procedures and MRI Safety. While the latter focus on the practical
                  application and risk management in clinical settings, the
                  fundamentals ensure that you have a solid grasp of the theoretical
                  concepts essential for interpreting and exec
                </p>
                <p>
                  Whether you are a student, researcher, or medical professional, a
                  deep understanding of MRI Fundamentals will enhance your ability to
                  comprehend the more technical aspects of MRI procedures and maintain
                  high standards of safety in practice.
                </p>
              </div>
            </article>
          }
        />
      </>
    );
  } else if (slug === "mri-procedures") {
    return (
      <>
        <Head>
          <title>MRI Procedures</title>
          <meta
            name="description"
            content="Discover detailed guidelines on patient preparation, imaging sequences, and protocols for accurate MRI diagnostics."
          />
        </Head>
        <SidebarToggleLayout
          sidebar={<SanityArticlesMenuServer activeSlug={slug} />}
          main={
            <article className={styles.tiles}>
              <h2 className={styles.title}>MRI Procedures</h2>
              <div className={styles.tile}>
                <p>
                  The MRI Procedures section provides a detailed overview of the
                  operational protocols involved in MRI imaging. In this section,
                  you will find comprehensive guidelines on patient preparation,
                  imaging sequences, and scanning techniques that ensure accurate
                  and high-quality diagnostic results.
                </p>
                <p>
                  This part of the book is dedicated to the practical application of
                  MRI technology. It bridges the gap between the theoretical foundations
                  covered in the MRI Fundamentals section and the real-world execution
                  of imaging procedures, offering step-by-step instructions and best
                  practices.
                </p>
                <p>
                  Whether you are a technician, radiologist, or student, this section
                  equips you with the essential tools and techniques to perform MRI scans
                  safely and effectively, making it an indispensable resource for
                  mastering clinical imaging.
                </p>
              </div>
            </article>
          }
        />
      </>
    );
  } else if (slug === "mri-safety") {
    return (
      <>
        <Head>
          <title>MRI Safety</title>
          <meta
            name="description"
            content="Explore protocols and best practices designed to maintain a secure MRI imaging environment."
          />
        </Head>
        <SidebarToggleLayout
          sidebar={<SanityArticlesMenuServer activeSlug={slug} />}
          main={
            <article className={styles.tiles}>
              <h2 className={styles.title}>MRI Safety</h2>
              <div className={styles.tile}>
                <p>
                  The MRI Safety section is focused on the protocols and best practices
                  necessary to maintain a secure imaging environment. It covers essential
                  safety guidelines designed to prevent accidents and protect both
                  patients and healthcare professionals.
                </p>
                <p>
                  In this section, you will learn about the potential hazards associated
                  with MRI technology—including strong magnetic fields and radiofrequency
                  energy—and how to mitigate these risks through proper screening,
                  training, and operational procedures.
                </p>
                <p>
                  Whether you are a clinician, facility manager, or support staff, the
                  insights provided here will help you establish and maintain a safe
                  working environment, complementing the detailed discussions on MRI
                  Fundamentals and Procedures.
                </p>
              </div>
            </article>
          }
        />
      </>
    );
  }

  // Dynamic content
  const query = `*[_type == "articles" && slug.current == $slug][0]{
    title,
    body,
    advanced,
    clinical,
    images[]{
      position,
      image{
        asset->{
          url
        },
        caption
      }
    },
    seo {
      seoTitle,
      seoDescription,
      seoKeywords,
      canonicalUrl,
      structuredData,
      metaRobots,
      og {
        ogTitle,
        ogDescription,
        ogImage{ asset->{ url } }
      },
      twitter {
        twitterTitle,
        twitterDescription,
        twitterImage{ asset->{ url } }
      }
    },
    previousArticle->{
      title,
      "slug": slug.current,
      articleType
    },
    nextArticle->{
      title,
      "slug": slug.current,
      articleType
    },
    parentArticle->{
      title,
      "slug": slug.current,
      articleType
    },
    chapter_id
  }`;

  const item: Item | null = await client.fetch(query, { slug });
  if (!item) notFound();

  const seo = item.seo;

  const articleNavigation = (
    <nav className={styles.articleNav}>
      <div className={styles.navItem}>
        {item.previousArticle &&
        !["part", "chapter"].includes(item.previousArticle.articleType || "") ? (
          <Link
            href={`/learn-mri/topic/${item.previousArticle.slug}`}
            className={styles.navLink}
          >
            &larr; {trimTitle(item.previousArticle.title)}
          </Link>
        ) : (
          <span />
        )}
      </div>
      <div className={styles.navItem} style={{ textAlign: "center" }}>
        {item.parentArticle &&
        !["part", "chapter"].includes(item.parentArticle.articleType || "") ? (
          <Link
            href={`/learn-mri/topic/${item.parentArticle.slug}`}
            className={styles.navLink}
          >
            Up: {trimTitle(item.parentArticle.title)}
          </Link>
        ) : (
          <span />
        )}
      </div>
      <div className={styles.navItem} style={{ textAlign: "right" }}>
        {item.nextArticle &&
        !["part", "chapter"].includes(item.nextArticle.articleType || "") ? (
          <Link
            href={`/learn-mri/topic/${item.nextArticle.slug}`}
            className={styles.navLink}
          >
            {trimTitle(item.nextArticle.title)} &rarr;
          </Link>
        ) : (
          <span />
        )}
      </div>
    </nav>
  );

  const allChapterIds: string[] = await client
    .fetch(`*[_type == "articles"][]{ "id": chapter_id }`)
    .then((results: { id: string }[]) => results.map((r) => r.id));
  const { chapter_id } = (await client.fetch(
    `*[_type == "articles" && slug.current == $slug][0]{ chapter_id }`,
    { slug }
  )) as { chapter_id: string };
  const isLeaf = !allChapterIds.some((id) => id.startsWith(`${chapter_id}.`));

  // Sort images by their declared position
  const images = item.images || [];
  const sortedImages = images.slice().sort((a, b) => a.position - b.position);
  let paragraphIndex = 1;

  return (
    <>
      {seo?.structuredData && (
        <Head>
          <script type="application/ld+json">{seo.structuredData}</script>
        </Head>
      )}
      <SidebarToggleLayout
        sidebar={<SanityArticlesMenuServer activeSlug={slug} />}
        main={
          <article className={styles.tiles}>
            <h2 className={styles.title}>{item.title}</h2>

            {/* BODY with injected images */}
            <div className={styles.tile}>
              {(() => {
                const elements: React.ReactNode[] = [];
                const paragraphs = item.body.match(/<p>.*?<\/p>/gi) || [];
                paragraphs.forEach((para, idx) => {
                  sortedImages.forEach((img) => {
                    if (img.position === paragraphIndex) {
                      elements.push(
                        <figure
                          key={`img-body-${idx}`}
                          className={styles.imageFigure}
                        >
                          <Image
                            src={img.image.asset.url}
                            alt={img.image.caption ?? ""}
                            width={800}
                            height={600}
                            className={styles.articleImage}
                          />
                          {img.image.caption && (
                            <figcaption
                              className={styles.imageCaption}
                              dangerouslySetInnerHTML={{ __html: img.image.caption }}
                            />
                          )}
                        </figure>
                      );
                    }
                  });
                  elements.push(
                    <div
                      key={`body-para-${idx}`}
                      dangerouslySetInnerHTML={{ __html: para }}
                    />
                  );
                  paragraphIndex++;
                });
                return elements;
              })()}
            </div>

            {/* ADVANCED with injected images */}
            <div className={styles.tile}>
              <h2>Advanced Concepts for the Enthusiast</h2>
              {(() => {
                const elements: React.ReactNode[] = [];
                const paragraphs = item.advanced.match(/<p>.*?<\/p>/gi) || [];
                paragraphs.forEach((para, idx) => {
                  sortedImages.forEach((img) => {
                    if (img.position === paragraphIndex) {
                      elements.push(
                        <figure
                          key={`img-adv-${idx}`}
                          className={styles.imageFigure}
                        >
                          <Image
                            src={img.image.asset.url}
                            alt={img.image.caption ?? ""}
                            width={800}
                            height={600}
                            className={styles.articleImage}
                          />
                          {img.image.caption && (
                            <figcaption
                              className={styles.imageCaption}
                              dangerouslySetInnerHTML={{ __html: img.image.caption }}
                            />
                          )}
                        </figure>
                      );
                    }
                  });
                  elements.push(
                    <div
                      key={`adv-para-${idx}`}
                      dangerouslySetInnerHTML={{ __html: para }}
                    />
                  );
                  paragraphIndex++;
                });
                return elements;
              })()}
            </div>

            {/* CLINICAL with injected images */}
            <div className={styles.tile}>
              <h2>Clinical Relevance</h2>
              <SignedIn>
                {(() => {
                  const elements: React.ReactNode[] = [];
                  const paragraphs = item.clinical.match(/<p>.*?<\/p>/gi) || [];
                  paragraphs.forEach((para, idx) => {
                    sortedImages.forEach((img) => {
                      if (img.position === paragraphIndex) {
                        elements.push(
                          <figure
                            key={`img-clin-${idx}`}
                            className={styles.imageFigure}
                          >
                            <Image
                              src={img.image.asset.url}
                              alt={img.image.caption ?? ""}
                              width={800}
                              height={600}
                              className={styles.articleImage}
                            />
                            {img.image.caption && (
                              <figcaption
                                className={styles.imageCaption}
                                dangerouslySetInnerHTML={{ __html: img.image.caption }}
                              />
                            )}
                          </figure>
                        );
                      }
                    });
                    elements.push(
                      <div
                        key={`clin-para-${idx}`}
                        dangerouslySetInnerHTML={{ __html: para }}
                      />
                    );
                    paragraphIndex++;
                  });
                  return elements;
                })()}
              </SignedIn>
              <SignedOut>
                <p>
                  This section is available for free to registered users. Sign up
                  using the options that appear at the top of this page.
                </p>
              </SignedOut>
            </div>

            <div className={styles.tile}>
              {isLeaf && <MarkCompleteButton slug={slug} isLeaf={true} />}
              {articleNavigation}
            </div>
          </article>
        }
      />
    </>
  );
}
