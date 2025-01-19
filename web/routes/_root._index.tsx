import { Link, useOutletContext } from "@remix-run/react";
import { RootOutletContext } from "../root";
import { ChevronDown, Search } from "lucide-react";
 

export default function() {
  const { gadgetConfig } = useOutletContext<RootOutletContext>();

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <div className="text-white w-full h-full overflow-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-gray-800/95 shadow-md py-4 px-8 flex justify-between items-center w-full border-b border-gray-700">
        <div className="flex items-center w-[180px] flex-shrink-0"> 
          <svg
            viewBox="0 0 40 40"
            className="w-10 h-10 mr-2"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path d="M8 32l6-8l8 4l6-16l4 8h8" />
          </svg>
          <h1 className="text-xl font-bold">STOCKL</h1>
        </div>
        <div className="flex justify-center w-[560px] px-4">
          <div className="relative w-full max-w-[480px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="quick search"
              className="pl-10 pr-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none w-full"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4 w-[180px] justify-end flex-shrink-0">
          <Link to="/sign-in" className="text-white hover:underline">Log In</Link>
          <Link to="/sign-up" className="bg-white text-gray-900 px-4 py-2 rounded hover:bg-gray-200">SIGN UP</Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative flex flex-col justify-center items-center text-center py-32 px-4 w-full flex-grow bg-[url('https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f')] bg-cover bg-center before:absolute before:inset-0 before:bg-black/50">
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-[4rem] font-bold mb-8 leading-tight text-white">
            TRACK YOUR STOCKS<br />ANYWHERE, ANYTIME
          </h2>
          <p className="text-xl italic mb-10 text-gray-200">Get real-time updates, trends, and insights for smarter investments</p>
          <Link 
            to="/sign-up" 
            className="bg-white text-gray-900 px-8 py-3 rounded font-bold hover:bg-gray-200 transition-colors"
          >
            GET STARTED NOW
          </Link>
          <button
            onClick={scrollToFeatures}
            className="mt-12 text-white hover:text-gray-200 transition-colors"
            aria-label="Scroll to features"
          >
            <ChevronDown className="w-8 h-8 animate-bounce" />
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-gray-800 w-full py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose STOCKL?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Real-Time Updates</h3>
              <p className="text-gray-300">Get instant notifications and live stock updates to stay ahead of market movements</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Advanced Analytics</h3>
              <p className="text-gray-300">Make informed decisions with our comprehensive analysis tools and market insights</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Portfolio Tracking</h3>
              <p className="text-gray-300">Easily monitor and manage your investments in one centralized dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
