import Link from 'next/link';

interface ResearchItem {
  category: string;
  analysisType: string;
  title: string;
  date: string;
  link: string;
}

const researchData: ResearchItem[] = [
  {
    category: 'MRI Fundamentals',
    analysisType: 'Literature review',
    title: "What is the effect of magnetic field strength on MRI image quality?",
    date: 'February 28, 2025',
    link: '/research-topic/what-is-the-effect-of-magnetic-field-strength-on-mri-image-quality'
  },
  {
    category: 'Deeptech',
    analysisType: 'Case study',
    title: 'What is the difference between the different types of MRI simulators?',
    date: 'February 26, 2025',
    link: '/research/mri-simulators'
  },
  {
    category: 'MR protocols',
    analysisType: 'Literature review',
    title: 'The use of T1 mapping in the diagnosis of myocardial infarction',
    date: 'February 12, 2025',
    link: '/research/t1-mapping-myocardial-infarction'
  }
];

export default function ResearchSection() {
  return (
    <section className="w-full mt-16">
      {/* Black horizontal divider line */}
      <div className="w-full h-[1px] bg-black mb-6"></div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Research topics</h2>
        <Link href="/research" className="text-black-600 hover:underline flex items-center">
          More Research topics &rarr;
        </Link>
      </div>
      <div className="border-t border-gray-200">
        {researchData.map((item, index) => (
          <div key={index} className="py-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-red-600 font-medium">{item.category}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">{item.analysisType}</span>
                </div>
                <Link href={item.link} className="group">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}