import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      
      <main className="pt-24 pb-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-12">Terms & Conditions</h1>
        
        <div className="prose prose-zinc max-w-none text-gray-600">
          <p className="text-sm text-gray-400 mb-8">Last Updated: November 21, 2025</p>
          
          <h3 className="text-black font-bold uppercase tracking-widest">1. Agreement to Terms</h3>
          <p>
            These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and STORE (“we,” “us” or “our”), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).
          </p>

          <h3 className="text-black font-bold uppercase tracking-widest mt-8">2. Intellectual Property Rights</h3>
          <p>
            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
          </p>

          <h3 className="text-black font-bold uppercase tracking-widest mt-8">3. User Representations</h3>
          <p>
            By using the Site, you represent and warrant that:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>All registration information you submit will be true, accurate, current, and complete.</li>
            <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
            <li>You have the legal capacity and you agree to comply with these Terms and Conditions.</li>
            <li>You are not a minor in the jurisdiction in which you reside.</li>
          </ul>

          <h3 className="text-black font-bold uppercase tracking-widest mt-8">4. Products</h3>
          <p>
            We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products.
          </p>

          <h3 className="text-black font-bold uppercase tracking-widest mt-8">5. Purchases and Payment</h3>
          <p>
            We accept the following forms of payment: Visa, Mastercard, American Express, PayPal. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
