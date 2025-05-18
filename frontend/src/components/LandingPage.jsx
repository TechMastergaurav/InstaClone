import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left: Image or carousel */}
      <div className="flex-1 bg-gradient-to-br from-pink-200 to-blue-200 flex items-center justify-center">
        <img
          src="https://www.instagram.com/static/images/homepage/home-phones.png/43cc71bb1b43.png"
          alt="App preview"
          className="max-h-[600px] w-auto"
        />
      </div>
      {/* Right: Signup/Login */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white">
        <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">ChitChat</h1>
        <p className="mb-8 text-lg text-gray-600">Connect with friends and the world around you.</p>
        <Link to="/signup" className="w-64 mb-4">
          <button className="w-full py-3 bg-blue-500 text-white rounded font-semibold text-lg hover:bg-blue-600 transition">Sign Up</button>
        </Link>
        <Link to="/login" className="w-64">
          <button className="w-full py-3 bg-white border border-blue-500 text-blue-500 rounded font-semibold text-lg hover:bg-blue-50 transition">Log In</button>
        </Link>
      </div>
    </div>
  );
} 