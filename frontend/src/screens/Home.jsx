import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        /* FIX: Added flex and flex-col to make the children fill the height */
        <div className="min-h-screen bg-[#10192d] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden flex flex-col">
            
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-[#0D1321]/90 backdrop-blur-md px-6 py-4 border-b border-gray-800/20">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 text-2xl font-extrabold tracking-tight font-['Nunito']">
                        <span className="text-blue-500 font-mono">{"< >"}</span>
                        <span>CONVODE</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="bg-blue-600 px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition">
                            Sign In
                        </Link>
                        <Link to="/register" className="bg-blue-600 px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Added flex-grow to push footer to the absolute bottom */}
            <main className="relative pt-44 pb-20 flex flex-col items-center text-center px-6 flex-grow">
                
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-blue-500/10 blur-[120px] -z-10"></div>

                <h1 className="text-5xl md:text-7xl font-bold font-['Nunito'] tracking-tight mb-6 leading-tight">
                    Code. Collaborate. <span className="text-blue-500">Create.</span>
                </h1>
                
                <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-10 leading-relaxed font-['Nunito']">
                    The ultimate online IDE for Web Development with instant <br className="hidden md:block"/> 
                    AI execution and real-time collaborative workspace.
                </p>

                <Link to="/register" className="bg-blue-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 font-['Nunito']">
                    Start Coding for Free
                </Link>

                {/* Feature Cards */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl w-full font-['Nunito']">
                    <div className="bg-[#161b2b] p-8 rounded-2xl border border-gray-800/50 text-left hover:border-blue-500/50 transition-all shadow-xl">
                        <div className="text-yellow-400 text-3xl mb-4">
                            <i className="ri-flashlight-fill"></i>
                        </div>
                        <h3 className="text-xl font-bold mb-3 font-sans">Instant Execution</h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-sans">
                            Run your code instantly with support for MERN stack, including backend servers and frontend previews.
                        </p>
                    </div>

                    <div className="bg-[#161b2b] p-8 rounded-2xl border border-gray-800/50 text-left hover:border-blue-500/50 transition-all shadow-xl">
                        <div className="text-green-400 text-3xl mb-4">
                            <i className="ri-group-fill"></i>
                        </div>
                        <h3 className="text-xl font-bold mb-3 font-sans">Real-time Collaboration</h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-sans">
                            Share your projects with teammates and collaborate in real-time with integrated chat and live editing.
                        </p>
                    </div>

                    <div className="bg-[#161b2b] p-8 rounded-2xl border border-gray-800/50 text-left hover:border-blue-500/50 transition-all shadow-xl">
                        <div className="text-blue-400 text-3xl mb-4">
                            <i className="ri-shield-fill"></i>
                        </div>
                        <h3 className="text-xl font-bold mb-3 font-sans">Secure & Private</h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-sans">
                            Your code is secure with Google OAuth authentication and private project workspaces.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer - Removed extra margins and set background color precisely */}
            <footer className="w-full py-8 border-t border-gray-800/30 text-center text-gray-500 text-sm bg-[#10192d] mt-auto">
                © {new Date().getFullYear()} Convode.ai • Built for the modern web.
            </footer>
        </div>
    );
};

export default Home;