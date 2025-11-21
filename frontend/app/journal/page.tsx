import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import Link from 'next/link';
import Image from 'next/image';

const POSTS = [
  {
    id: 1,
    title: "The Art of Minimalism",
    excerpt: "Exploring how less can truly be more in your wardrobe and your life.",
    date: "October 12, 2023",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Sustainable Fabrics 101",
    excerpt: "A deep dive into organic cotton, linen, and why material matters.",
    date: "September 28, 2023",
    category: "Education",
    image: "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Fall Collection Lookbook",
    excerpt: "Behind the scenes of our latest campaign shoot in the Scottish Highlands.",
    date: "September 15, 2023",
    category: "News",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80"
  }
];

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-8">The Journal</h1>
          <p className="text-xl md:text-2xl text-gray-500 max-w-3xl leading-relaxed">
            Stories, interviews, and insights from the world of design and culture.
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {POSTS.map((post) => (
              <article key={post.id} className="group cursor-pointer">
                <div className="relative aspect-4/5 w-full bg-gray-100 mb-6 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <span>{post.category}</span>
                    <span>{post.date}</span>
                  </div>
                  <h2 className="text-2xl font-bold uppercase tracking-tighter mb-3 group-hover:underline underline-offset-4 decoration-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <Link href="#" className="text-xs font-bold uppercase tracking-widest underline underline-offset-4">
                    Read Story
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
