import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      
      <main className="pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-12">Size Guide</h1>
        
        <div className="space-y-16">
          <section>
            <h2 className="text-2xl font-bold uppercase tracking-tighter mb-6">Menswear</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs font-bold uppercase tracking-widest border-b border-black">
                  <tr>
                    <th className="py-4 pr-8">Size</th>
                    <th className="py-4 pr-8">Chest (in)</th>
                    <th className="py-4 pr-8">Waist (in)</th>
                    <th className="py-4 pr-8">Hips (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-4 font-bold">S</td>
                    <td className="py-4">36 - 38</td>
                    <td className="py-4">29 - 31</td>
                    <td className="py-4">35 - 37</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-bold">M</td>
                    <td className="py-4">39 - 41</td>
                    <td className="py-4">32 - 34</td>
                    <td className="py-4">38 - 40</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-bold">L</td>
                    <td className="py-4">42 - 44</td>
                    <td className="py-4">35 - 37</td>
                    <td className="py-4">41 - 43</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-bold">XL</td>
                    <td className="py-4">45 - 48</td>
                    <td className="py-4">38 - 41</td>
                    <td className="py-4">44 - 46</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold uppercase tracking-tighter mb-6">Womenswear</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs font-bold uppercase tracking-widest border-b border-black">
                  <tr>
                    <th className="py-4 pr-8">Size</th>
                    <th className="py-4 pr-8">Bust (in)</th>
                    <th className="py-4 pr-8">Waist (in)</th>
                    <th className="py-4 pr-8">Hips (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-4 font-bold">XS</td>
                    <td className="py-4">31 - 32</td>
                    <td className="py-4">24 - 25</td>
                    <td className="py-4">34 - 35</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-bold">S</td>
                    <td className="py-4">33 - 34</td>
                    <td className="py-4">26 - 27</td>
                    <td className="py-4">36 - 37</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-bold">M</td>
                    <td className="py-4">35 - 36</td>
                    <td className="py-4">28 - 29</td>
                    <td className="py-4">38 - 39</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-bold">L</td>
                    <td className="py-4">37 - 39</td>
                    <td className="py-4">30 - 32</td>
                    <td className="py-4">40 - 42</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold uppercase tracking-tighter mb-4">How to Measure</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-600">
              <div>
                <h3 className="font-bold uppercase tracking-widest mb-2 text-black">Chest / Bust</h3>
                <p>Measure under your arms at the fuller part of your chest, keeping the tape level across your back.</p>
              </div>
              <div>
                <h3 className="font-bold uppercase tracking-widest mb-2 text-black">Waist</h3>
                <p>Measure around your natural waistline, keeping the tape comfortably loose.</p>
              </div>
              <div>
                <h3 className="font-bold uppercase tracking-widest mb-2 text-black">Hips</h3>
                <p>Stand with your feet together and measure around the fullest part of your hips.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
