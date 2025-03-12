import SanityArticlesMRIFundamentals from "../../../components/SanityArticlesMRIFundamentals";

export default function LearnMRI() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start mt-[-40px]">
        <h1 className="text-3xl font-bold">MRI Fundamentals</h1>
        <div className="max-w-4xl space-y-4">
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
        <SanityArticlesMRIFundamentals />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {/* Footer content here */}
      </footer>
    </div>
  );
}
