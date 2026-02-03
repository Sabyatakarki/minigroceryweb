import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-[#ffffff] text-gray-800 font-sans selection:bg-green-100">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 md:px-16 py-4 border-b border-green-100">
        <h1 className="text-2xl font-bold text-green-700 font-[cursive] tracking-tight">
          Fresh Picks
        </h1>

        <nav className="hidden md:flex gap-20 text-sm font-semibold text-green-800/70">
          <a href="#" className="hover:text-green-600 transition-colors">Home</a>
          <a href="#" className="hover:text-green-600 transition-colors">About us</a>
          <a href="#" className="hover:text-green-600 transition-colors">Categories</a>
          <a href="#" className="hover:text-green-600 transition-colors">Contact</a>
        </nav>

        <Link
          href="/register"
          className="bg-green-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all active:scale-95"
        >
          Get started
        </Link>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden px-6 md:px-16 py-24 lg:py-32 max-w-7xl mx-auto">
        {/* Background Decorative Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-100/50 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-emerald-50 rounded-full blur-3xl -z-10"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content Column */}
          <div className="relative z-10 space-y-8">

            <h2 className="text-2xl md:text-5xl font-black leading-[1.1] text-gray-900 tracking-tight">
              Your <br />
              <span className="relative inline-block">
                <span className="text-green-600">Daily Essentials</span>
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-green-200/60 -z-10" viewBox="0 0 200 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5C50 1 150 9 199 5" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                </svg>
              </span>, <br />
              Just a Click Away.
            </h2>

            <p className="text-gray-500 text-lg md:text-xl max-w-md leading-relaxed font-medium">
              Make healthier choices every day with fresh items carefully
              sourced to support your well-being.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-green-600 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl shadow-green-200 hover:bg-green-700 transition-all hover:-translate-y-1 active:scale-95">
                Shop Now
              </button>
              <button className="group flex items-center justify-center gap-2 border-2 border-green-100 text-gray-700 px-10 py-4 rounded-2xl font-bold hover:bg-white hover:border-green-600 transition-all">
                Explore more
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            {/* Features - Now styled as modern Glassmorphism cards */}
            <div className="flex flex-wrap gap-6 mt-12">
              <div className="group bg-white/60 backdrop-blur-sm border border-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-100/50 flex items-start gap-4 hover:bg-white transition-all">
                <div className="bg-green-100 p-3 rounded-2xl text-2xl group-hover:rotate-12 transition-transform">🥬</div>
                <div>
                  <p className="font-bold text-gray-900">Only fresh products</p>
                  <p className="text-xs text-gray-500 mt-1">Organic and pure for your health.</p>
                </div>
              </div>

              <div className="group bg-white/60 backdrop-blur-sm border border-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-100/50 flex items-start gap-4 hover:bg-white transition-all">
                <div className="bg-green-100 p-3 rounded-2xl text-2xl group-hover:rotate-12 transition-transform">🚚</div>
                <div>
                  <p className="font-bold text-gray-900">Fast Delivery</p>
                  <p className="text-xs text-gray-500 mt-1">Get what you need in less time.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Column - Added "The Stack" look */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Artistic Floating Shapes */}
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

            <div className="relative group">
              {/* Outer Glow/Border */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-green-100 to-emerald-50 rounded-[3rem] -rotate-3 transition-transform group-hover:rotate-0 duration-500"></div>
              
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] border-8 border-white">
                <img 
                  src="/websitelandingpage.jpg" 
                  alt="Grocery basket" 
                  className="w-full max-w-[480px] object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </div>

              {/* Floating Badge on Image */}
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-3xl shadow-2xl flex items-center gap-3 border border-green-50 animate-bounce-slow">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white font-bold">4.9</div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">Top Rated</p>
                  <p className="text-xs font-black text-gray-900">Grocery App</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR SECTION - Now set to Half Width (Grid of 2) */}
      <section className="px-6 md:px-16 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-extrabold mb-12 text-center md:text-left">
            Popular at Fresh Picks
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Item 1 */}
            <div className="group flex items-center gap-6 p-6 rounded-[2.5rem] bg-slate-50 border border-transparent hover:border-green-100 hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="w-24 h-24 flex-shrink-0">
                <img src="https://cdn-icons-png.flaticon.com/512/415/415733.png" className="w-full h-full object-contain" alt="Veggies" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-lg">Veggies and fruits</h4>
                <p className="text-xs text-gray-500 line-clamp-2">Fresh vegetables and fruits are the heart of every household’s grocery list.</p>
                <p className="text-red-500 font-bold text-sm">starting from Rs 99</p>
                <button className="mt-2 bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-green-700">Buy Now</button>
              </div>
            </div>

            {/* Item 2 */}
            <div className="group flex items-center gap-6 p-6 rounded-[2.5rem] bg-slate-50 border border-transparent hover:border-green-100 hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="w-24 h-24 flex-shrink-0">
                <img src="https://cdn-icons-png.flaticon.com/512/3050/3050156.png" className="w-full h-full object-contain" alt="Dairy" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-lg">Dairy Products</h4>
                <p className="text-xs text-gray-500 line-clamp-2">Dairy products are a daily essential in almost every home.</p>
                <p className="text-red-500 font-bold text-sm">starting from Rs 99</p>
                <button className="mt-2 bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-green-700">Buy Now</button>
              </div>
            </div>


              {/* Item 3 */}
            <div className="group flex items-center gap-6 p-6 rounded-[2.5rem] bg-slate-50 border border-transparent hover:border-green-100 hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="w-24 h-24 flex-shrink-0">
                <img src="https://cdn-icons-png.flaticon.com/512/3050/3050156.png" className="w-full h-full object-contain" alt="Dairy" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-lg">Dairy Products</h4>
                <p className="text-xs text-gray-500 line-clamp-2">Dairy products are a daily essential in almost every home.</p>
                <p className="text-red-500 font-bold text-sm">starting from Rs 99</p>
                <button className="mt-2 bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-green-700">Buy Now</button>
              </div>
            </div>

            {/* Item 4 */}
            <div className="group flex items-center gap-6 p-6 rounded-[2.5rem] bg-slate-50 border border-transparent hover:border-green-100 hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="w-24 h-24 flex-shrink-0">
                <img src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png" className="w-full h-full object-contain" alt="Meat" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-lg">Meat Products</h4>
                <p className="text-xs text-gray-500 line-clamp-2">Meat items are among the most frequently purchased essentials.</p>
                <p className="text-red-500 font-bold text-sm">starting from Rs 99</p>
                <button className="mt-2 bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-green-700">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="px-6 md:px-16 py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "🥬", title: "Fresh & Organic", desc: "Handpicked fresh products from trusted suppliers." },
            { icon: "🚚", title: "Fast Delivery", desc: "Get groceries delivered to your doorstep quickly." },
            { icon: "💳", title: "Secure Payments", desc: "Safe and reliable payment methods." }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] text-center shadow-sm hover:shadow-md transition-all">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h4 className="font-bold mb-2">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-6 md:mx-16 my-16 bg-green-600 rounded-[3rem] py-16 px-6 text-white text-center">
        <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to shop fresh groceries?</h3>
        <p className="text-green-50 mb-8 opacity-90">Join thousands of happy customers using Fresh Picks every day.</p>
        <button className="bg-white text-green-700 px-10 py-3.5 rounded-full font-bold shadow-lg hover:bg-green-50 transition-transform hover:scale-105">
          Start Shopping
        </button>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 md:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            { name: "Aarav Sharma", loc: "Kathmandu", text: "“Fresh Picks makes grocery shopping so easy. The vegetables are always fresh and delivery is super fast!”", img: "12" },
            { name: "Sneha Karki", loc: "Lalitpur", text: "“I love the dairy products here. Affordable prices and very hygienic packaging.”", img: "32" },
            { name: "Rohan Thapa", loc: "Bhaktapur", text: "“Fast delivery and great customer support. Fresh Picks is now my go-to grocery app.”", img: "45" }
          ].map((u, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-[2rem]">
              <p className="text-gray-600 italic text-sm leading-relaxed">{u.text}</p>
              <div className="flex items-center gap-4 mt-6">
                <img src={`https://i.pravatar.cc/100?img=${u.img}`} className="w-10 h-10 rounded-full" alt="user" />
                <div>
                  <p className="font-bold text-sm">{u.name}</p>
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">{u.loc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-green-800 text-white px-6 md:px-16 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="text-xl font-bold font-[cursive] mb-4">Fresh Picks</h4>
            <p className="text-green-100/70 text-sm">Your trusted source for fresh and healthy groceries.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="text-sm text-green-100/70 space-y-2">
              <li>Home</li><li>Categories</li><li>About us</li><li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-sm text-green-100/70">Email: support@freshpicks.com<br />Phone: +977 98XXXXXXX</p>
          </div>
        </div>
        <p className="text-center text-xs text-green-100/40 mt-16 pt-8 border-t border-green-700/50">
          © 2026 Fresh Picks. All rights reserved.
        </p>
      </footer>
    </div>
  );
}