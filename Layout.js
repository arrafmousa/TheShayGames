import React from "react";
import { Gamepad2, Heart } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
      <style>
        {`
          :root {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --accent: #ec4899;
            --warm: #f59e0b;
            --success: #10b981;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }
          
          .game-card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }
          
          .glow-effect {
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
          }
          
          .flip-card {
            transform-style: preserve-3d;
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .flip-card.flipped {
            transform: rotateY(180deg);
          }
          
          .flip-card-front,
          .flip-card-back {
            backface-visibility: hidden;
            position: absolute;
            top: 0;
            left: 0;
          }
          
          .flip-card-back {
            transform: rotateY(180deg);
          }
          
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
              animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
              transform: translate3d(0, 0, 0);
            }
            40%, 43% {
              animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
              transform: translate3d(0, -20px, 0);
            }
            70% {
              animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
              transform: translate3d(0, -10px, 0);
            }
            90% {
              transform: translate3d(0, -4px, 0);
            }
          }
          
          .bounce {
            animation: bounce 1s;
          }
        `}
      </style>
      
      <header className="relative overflow-hidden bg-white/80 backdrop-blur-xl border-b border-white/20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-pink-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
                Shay's Games
              </h1>
              <p className="text-gray-600 flex items-center justify-center gap-2 mt-2">
                <Heart className="w-4 h-4 text-pink-500" />
                A Farewell Gift
                <Heart className="w-4 h-4 text-pink-500" />
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        {children}
      </main>
    </div>
  );
}
