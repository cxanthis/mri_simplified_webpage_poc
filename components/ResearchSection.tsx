import Link from 'next/link';
import client from '../sanityClient'; // Adjust the path if needed

interface ResearchItem {
  category: string;
  researchType: string;
  title: string;
  slug: {
    current: string;
  };
}

export default async function ResearchSection() {
  // Query the latest three researchTopics ordered by date (newest first)
  const query = `*[_type == "researchTopics"] | order(createdAt desc)[0...3]{
    title,
    category,
    researchType,
    slug
  }`;
  const researchData: ResearchItem[] = await client.fetch(query);

  return (
    <section className="w-full mt-16">
      {/* Black horizontal divider line */}
      <div className="w-full h-[1px] bg-black mb-6"></div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Research topics</h2>
        <Link
          href="/research-topic"
          className="text-black-600 hover:underline flex items-center"
        >
          More Research topics &rarr;
        </Link>
      </div>
      <div className="border-t border-gray-200">
        {researchData.map((item, index) => (
          <div key={index} className="py-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-red-600 font-medium">
                    {item.category}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">
                    {item.researchType}
                  </span>
                </div>
                <Link href={`/research-topic/${item.slug.current}`} className="group">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
