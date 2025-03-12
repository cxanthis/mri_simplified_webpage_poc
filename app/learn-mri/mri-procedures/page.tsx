import SanityArticlesMRIProcedures from "../../../components/SanityArticlesMRIProcedures";

export default function LearnMRI() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start mt-[-40px]">
        <h1 className="text-3xl font-bold">MRI Procedures</h1>
        <div className="max-w-4xl space-y-4">
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
        <SanityArticlesMRIProcedures />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {/* Footer content here */}
      </footer>
    </div>
  );
}
