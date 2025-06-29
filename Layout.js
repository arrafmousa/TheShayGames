
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Gamepad2, Home, Trophy, Settings, Image as ImageIcon } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <style>{`
        :root {
          --primary: 147 51 234;
          --secondary: 59 130 246;
          --accent: 236 72 153;
          --background: 15 23 42;
          --surface: 30 41 59;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .game-card {
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(147, 51, 234, 0.2);
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .glow-purple {
          box-shadow: 0 0 30px rgba(147, 51, 234, 0.3);
        }
        
        .glow-blue {
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
        }
      `}</style>
      
      {/* Header */}
      <header className="glass-effect border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("GameHub")} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">GameVerse</h1>
                <p className="text-xs text-purple-300">Interactive Gaming Platform</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to={createPageUrl("GameHub")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentPageName === "GameHub"
                    ? "bg-purple-500/20 text-purple-300"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Home className="w-4 h-4" />
                Hub
              </Link>
              <Link
                to={createPageUrl("ImageManager")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentPageName === "ImageManager"
                    ? "bg-purple-500/20 text-purple-300"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Images
              </Link>
              <Link
                to={createPageUrl("Leaderboard")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentPageName === "Leaderboard"
                    ? "bg-purple-500/20 text-purple-300"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Trophy className="w-4 h-4" />
                Scores
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-effect border-t border-white/10 z-50">
        <div className="flex items-center justify-around py-2">
          <Link
            to={createPageUrl("GameHub")}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
              currentPageName === "GameHub"
                ? "text-purple-300"
                : "text-gray-400"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Hub</span>
          </Link>
          <Link
            to={createPageUrl("ImageManager")}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
              currentPageName === "ImageManager"
                ? "text-purple-300"
                : "text-gray-400"
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span className="text-xs">Images</span>
          </Link>
          <Link
            to={createPageUrl("Leaderboard")}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
              currentPageName === "Leaderboard"
                ? "text-purple-300"
                : "text-gray-400"
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-xs">Scores</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
