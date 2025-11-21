import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      
      <main className="pt-24 pb-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8">Contact Us</h1>
        
        <div className="space-y-12">
          <section>
            <p className="text-lg text-gray-600 mb-8">
              We are here to help. Reach out to us for any inquiries regarding your order, our products, or just to say hello.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold uppercase tracking-widest mb-2">Customer Service</h3>
                <p className="text-gray-500">support@store.com</p>
                <p className="text-gray-500">+1 (555) 123-4567</p>
              </div>
              <div>
                <h3 className="font-bold uppercase tracking-widest mb-2">Press & Wholesale</h3>
                <p className="text-gray-500">press@store.com</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold uppercase tracking-tighter mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Name</label>
                  <input type="text" className="w-full border-b border-gray-300 py-2 focus:border-black focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Email</label>
                  <input type="email" className="w-full border-b border-gray-300 py-2 focus:border-black focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Message</label>
                <textarea rows={4} className="w-full border-b border-gray-300 py-2 focus:border-black focus:outline-none transition-colors"></textarea>
              </div>
              <button type="submit" className="bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors">
                Send Message
              </button>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
