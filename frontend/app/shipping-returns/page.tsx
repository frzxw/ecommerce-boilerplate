import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      
      <main className="pt-24 pb-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-12">Shipping & Returns</h1>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold uppercase tracking-tighter mb-4">Shipping Policy</h2>
            <div className="prose prose-zinc max-w-none text-gray-600">
              <p className="mb-4">
                We offer free standard shipping on all orders over $200. For orders under $200, a flat rate of $15 applies.
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li><strong>Standard Shipping:</strong> 3-5 business days</li>
                <li><strong>Express Shipping:</strong> 1-2 business days ($25)</li>
                <li><strong>International Shipping:</strong> 7-14 business days (Rates vary by location)</li>
              </ul>
              <p>
                Orders are processed Monday through Friday, excluding holidays. Orders placed after 2 PM EST will be processed the following business day.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold uppercase tracking-tighter mb-4">Returns & Exchanges</h2>
            <div className="prose prose-zinc max-w-none text-gray-600">
              <p className="mb-4">
                We want you to be completely satisfied with your purchase. If for any reason you are not, we accept returns within 30 days of delivery.
              </p>
              <p className="mb-4">
                To be eligible for a return, your item must be:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Unworn and unwashed</li>
                <li>In the original packaging with all tags attached</li>
                <li>Accompanied by the receipt or proof of purchase</li>
              </ul>
              <p>
                To initiate a return, please visit our <a href="/contact" className="underline">Contact page</a> or email us at support@store.com.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
