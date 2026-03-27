import { Link, useNavigate } from 'react-router-dom';
import { Camera, Flower } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9F8F6] font-sans selection:bg-[#B3A398] selection:text-white">
      {/* Header */}
      <nav className="absolute top-0 w-full z-10 px-8 py-6 flex items-center justify-between text-white mix-blend-difference">
        <div className="gap-12 text-xs uppercase tracking-widest hidden md:flex">
          <a href="#" className="hover:text-stone-300 transition-colors">About</a>
          <a href="#" className="hover:text-stone-300 transition-colors">Services</a>
        </div>
        <div className="text-2xl font-serif tracking-[0.2em] uppercase w-full md:w-auto text-center">
          DreamDay
        </div>
        <div className="gap-12 text-xs uppercase tracking-widest hidden md:flex">
          <a href="#" className="hover:text-stone-300 transition-colors">Portfolio</a>
          <a href="#" className="hover:text-stone-300 transition-colors">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative h-[95vh] w-full overflow-hidden flex flex-col items-center justify-center text-center"
        style={{ borderBottomLeftRadius: '50% 10%', borderBottomRightRadius: '50% 10%' }}
      >
        <img 
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80" 
          alt="Wedding Couple"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-stone-900/30"></div>
        <div className="relative z-10 px-4 mt-20 max-w-4xl flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white uppercase leading-tight mb-6 mt-12">
            Turning Your Wedding Dreams<br/>Into Ultimate Reality
          </h1>
          <p className="text-white/90 text-sm md:text-base font-light tracking-wide mb-10 max-w-xl">
            Crafting every detail to shape your perfect wedding day.
          </p>
          <Button 
            onClick={() => navigate('/PlannerDashboard')}
            className="bg-white text-stone-900 hover:bg-stone-100 rounded-none px-10 py-6 text-xs uppercase tracking-widest transition-transform hover:scale-105"
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <Flower className="text-[#8C7B6D] mb-12 w-12 h-12 stroke-[1]" />
        
        <div className="max-w-4xl relative mb-16">
          <div className="absolute left-1/2 -top-12 bottom-0 w-[1px] bg-[#8C7B6D]/30 transform -translate-x-1/2 h-8"></div>
          <h2 className="text-2xl md:text-4xl font-serif text-[#8C7B6D] leading-snug">
            WE ARE <span className="font-bold">PASSIONATE</span> ABOUT UNLEASHING ONLY<br/>
            THE BEST WEDDINGS, WITH YEARS OF <span className="font-bold">EXPERIENCE</span><br/>
            AND A <span className="font-bold">PORTFOLIO</span> OF COUNTLESS WORKS.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-stone-500 font-light text-left max-w-5xl mx-auto leading-relaxed">
          <div>
            Here, we understand that your wedding day is a chapter in your love story, and we're here to ensure it's a masterpiece. With years of expertise in orchestrating dream weddings, we've earned a reputation for creating unforgettable love moments.
          </div>
          <div className="relative">
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-3 h-[1px] bg-stone-300 hidden md:block"></div>
            Our journey is woven with a passion for love, design, and meticulous planning. We are not casual event planners; we are professional memory curators dedicated to making your special day a reflection of your love story.
            
            <div className="mt-8 flex flex-col items-start">
              <span className="text-[10px] uppercase tracking-widest text-[#8C7B6D] mb-2">With love,</span>
              <span className="font-script text-4xl text-stone-800 -rotate-2">Cathy S.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 max-w-7xl mx-auto px-8 relative">
        <div className="absolute left-0 right-0 top-32 bottom-0 bg-white/60 -z-10"></div>
        <div className="text-center mb-16">
          <h3 className="text-xl font-serif uppercase tracking-[0.2em] text-[#8C7B6D]">Our Services</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
          {/* Venue */}
          <div className="flex flex-col items-center group cursor-pointer relative top-0 md:top-8">
            <div className="relative w-full aspect-[4/5] rounded-t-full overflow-hidden mb-6 shadow-xl shadow-stone-200/50">
              <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80" alt="Venue" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/0"></div>
              <div className="absolute bottom-6 left-0 right-0 text-center uppercase tracking-[0.3em] text-white text-sm">Venue</div>
            </div>
          </div>

          {/* Catering */}
          <div className="flex flex-col items-center group cursor-pointer relative top-0 md:-top-8">
            <div className="relative w-full aspect-[4/5] rounded-t-full overflow-hidden mb-6 shadow-xl shadow-stone-200/50">
              <img src="https://images.unsplash.com/photo-1555507036-ab1d4075c6f5?auto=format&fit=crop&q=80" alt="Catering" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/0"></div>
              <div className="absolute bottom-6 left-0 right-0 text-center uppercase tracking-[0.3em] text-white text-sm">Catering</div>
            </div>
          </div>

          {/* Decor */}
          <div className="flex flex-col items-center group cursor-pointer relative top-0 md:top-8">
            <div className="relative w-full aspect-[4/5] rounded-t-full overflow-hidden mb-6 shadow-xl shadow-stone-200/50">
              <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80" alt="Decor" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/0"></div>
              <div className="absolute bottom-6 left-0 right-0 text-center uppercase tracking-[0.3em] text-white text-sm">Decor</div>
            </div>
          </div>

          {/* Attire */}
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="relative w-full aspect-[4/5] rounded-t-full overflow-hidden mb-6 shadow-xl shadow-stone-200/50">
              <img src="https://images.unsplash.com/photo-1594552072238-16e09c1d0449?auto=format&fit=crop&q=80" alt="Attire" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/0"></div>
              <div className="absolute bottom-6 left-0 right-0 text-center uppercase tracking-[0.3em] text-white text-sm">Attire</div>
            </div>
          </div>

          {/* Media (Text Card) */}
          <div className="flex flex-col items-center relative top-0 md:-top-16">
            <div className="w-full aspect-[4/5] rounded-t-full border border-[#8C7B6D]/30 bg-[#F9F8F6] flex flex-col items-center justify-center p-8 text-center shadow-md">
              <Camera className="text-[#8C7B6D] mb-4 w-8 h-8 stroke-[1]" />
              <h4 className="font-serif uppercase tracking-[0.2em] text-[#8C7B6D] mb-4">Media</h4>
              <p className="text-xs text-stone-500 leading-relaxed mb-8 font-light">
                Capture every moment with the artistry of our talented on-site photographers & videographers.
              </p>
              <Button className="bg-[#8C7B6D] hover:bg-[#7A6A5C] text-white rounded-none w-full text-xs uppercase tracking-widest h-12">
                Book Now
              </Button>
            </div>
          </div>

          {/* Music */}
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="relative w-full aspect-[4/5] rounded-t-full overflow-hidden mb-6 shadow-xl shadow-stone-200/50">
              <img src="https://images.unsplash.com/photo-1525926477800-7a3b10316ac6?auto=format&fit=crop&q=80" alt="Music" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/0"></div>
              <div className="absolute bottom-6 left-0 right-0 text-center uppercase tracking-[0.3em] text-white text-sm">Music</div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-[#F4F2F0]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Image (Large) */}
            <div className="relative bg-white p-4 pb-16 shadow-lg rotate-[-2deg] hover:rotate-0 transition-transform duration-700 max-w-md mx-auto w-full z-10">
              <img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80" alt="Latest Wedding" className="w-full aspect-[3/4] object-cover" />
              <div className="absolute bottom-6 left-4">
                <p className="font-serif text-sm text-stone-800">Gerald Johnson & Erica Steward</p>
                <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-widest">(2023)</p>
              </div>
            </div>

            {/* Right Content */}
            <div className="flex flex-col lg:pl-12">
              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-4 font-semibold">Gallery</p>
                <h2 className="text-3xl md:text-5xl font-serif text-[#8C7B6D] uppercase mb-16 leading-tight">
                  Latest<br/>Weddings
                </h2>
              </div>

              <div className="flex gap-6 relative items-start justify-end w-full">
                {/* Details images */}
                <div className="bg-white p-2 pb-8 shadow-md rotate-[3deg] hover:rotate-[1deg] transition-transform duration-500 mt-20 w-48 shrink-0 z-20">
                  <img src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80" alt="Wedding Details" className="w-full aspect-[3/4] object-cover" />
                </div>
                <div className="bg-white p-2 pb-8 shadow-md rotate-[-2deg] hover:rotate-[0deg] transition-transform duration-500 w-40 shrink-0">
                  <img src="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80" alt="Wedding Rings" className="w-full aspect-[1/2] object-cover" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer (Minimal) */}
      <footer className="bg-stone-900 text-white py-16 text-center text-[10px] uppercase tracking-widest font-light">
        <p className="text-stone-400">© 2026 DreamDay Weddings. All rights reserved.</p>
      </footer>
    </div>
  );
}
