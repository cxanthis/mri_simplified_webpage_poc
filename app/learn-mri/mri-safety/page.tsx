import SanityArticlesMRISafety from "../../../components/SanityArticlesMRISafety";

export default function LearnMRI() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start mt-[-40px]">
        <h1 className="text-3xl font-bold">MRI Safety</h1>
        <div className="max-w-4xl space-y-4">
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
        <SanityArticlesMRISafety />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {/* Footer content here */}
      </footer>
    </div>
  );
}
