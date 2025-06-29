import React, { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, RotateCcw, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function FloppyShay({ images, onBack, onComplete }) {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'gameOver'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameData, setGameData] = useState({
    shay: { x: 100, y: 200, velocity: 0 },
    pipes: [],
    lastPipeTime: 0
  });

  const GRAVITY = 0.5;
  const JUMP_FORCE = -8;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 200;
  const PIPE_SPEED = 2;
  const SHAY_SIZE = 40;

  // Game initialization
  const initGame = useCallback(() => {
    setGameData({
      shay: { x: 100, y: 200, velocity: 0 },
      pipes: [],
      lastPipeTime: 0
    });
    setScore(0);
  }, []);

  // Handle jump
  const jump = useCallback(() => {
    if (gameState === 'playing') {
      setGameData(prev => ({
        ...prev,
        shay: { ...prev.shay, velocity: JUMP_FORCE }
      }));
    }
  }, [gameState]);

  // Start game
  const startGame = useCallback(() => {
    initGame();
    setGameState('playing');
  }, [initGame]);

  // Game over
  const gameOver = useCallback(() => {
    setGameState('gameOver');
    if (score > highScore) {
      setHighScore(score);
    }
    onComplete({ score });
  }, [score, highScore, onComplete]);

  // Main game loop
  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    setGameData(prev => {
      const newData = { ...prev };
      
      // Update Shay physics
      newData.shay.velocity += GRAVITY;
      newData.shay.y += newData.shay.velocity;

      // Check bounds
      if (newData.shay.y < 0 || newData.shay.y > canvasHeight - SHAY_SIZE) {
        setTimeout(gameOver, 0);
        return prev;
      }

      // Generate pipes
      const currentTime = Date.now();
      if (currentTime - newData.lastPipeTime > 2000) {
        const gapY = Math.random() * (canvasHeight - PIPE_GAP - 200) + 100;
        newData.pipes.push({
          x: canvasWidth,
          topHeight: gapY,
          bottomY: gapY + PIPE_GAP,
          passed: false
        });
        newData.lastPipeTime = currentTime;
      }

      // Update pipes
      newData.pipes = newData.pipes.filter(pipe => {
        pipe.x -= PIPE_SPEED;
        
        // Check collision
        if (pipe.x < newData.shay.x + SHAY_SIZE && pipe.x + PIPE_WIDTH > newData.shay.x) {
          if (newData.shay.y < pipe.topHeight || newData.shay.y + SHAY_SIZE > pipe.bottomY) {
            setTimeout(gameOver, 0);
            return true;
          }
        }

        // Score when passing pipe
        if (!pipe.passed && pipe.x + PIPE_WIDTH < newData.shay.x) {
          pipe.passed = true;
          setTimeout(() => setScore(s => s + 1), 0);
        }

        return pipe.x > -PIPE_WIDTH;
      });

      return newData;
    });
  }, [gameState, gameOver]);

  // Render game
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (gameState === 'playing') {
      // Draw pipes
      ctx.fillStyle = '#228B22';
      gameData.pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, canvasHeight - pipe.bottomY);
      });

      // Draw Shay
      if (images.length > 0) {
        const img = new Image();
        img.onload = () => {
          ctx.save();
          ctx.translate(gameData.shay.x + SHAY_SIZE/2, gameData.shay.y + SHAY_SIZE/2);
          ctx.rotate(Math.max(-0.5, Math.min(0.5, gameData.shay.velocity * 0.1)));
          ctx.drawImage(img, -SHAY_SIZE/2, -SHAY_SIZE/2, SHAY_SIZE, SHAY_SIZE);
          ctx.restore();
        };
        img.src = images[0].url;
      } else {
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(gameData.shay.x, gameData.shay.y, SHAY_SIZE, SHAY_SIZE);
      }

      // Draw score
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(score.toString(), canvasWidth / 2, 50);
    }
  }, [gameState, gameData, images, score]);

  // Game loop effect
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(() => {
        gameLoop();
        render();
      }, 16); // ~60fps
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop, render]);

  // Input handlers
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  // Initial render
  useEffect(() => {
    render();
  }, [render]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Floppy Shay
            </h1>
            <p className="text-gray-600">Tap or press SPACE to fly!</p>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-gray-800">High Score: {highScore}</div>
            <div className="text-sm text-gray-500">Current: {score}</div>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="flex justify-center mb-8">
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="block cursor-pointer"
              onClick={jump}
            />
            
            {gameState === 'menu' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Ready to Fly?</h2>
                  <p className="text-lg mb-6">Help Shay navigate through the obstacles!</p>
                  <Button 
                    onClick={startGame}
                    className="bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-xl"
                  >
                    Start Game
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            <strong>How to Play:</strong> Tap the screen or press SPACE to make Shay fly up. 
            Avoid the green pipes and try to get the highest score possible!
          </p>
        </div>

        {/* Game Over Dialog */}
        <Dialog open={gameState === 'gameOver'} onOpenChange={() => setGameState('menu')}>
          <DialogContent className="game-card border-0 rounded-3xl">
            <DialogHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Game Over!
              </DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-600">Nice flying, Shay made it through {score} pipes!</p>
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">{score}</div>
                  <p className="text-sm text-gray-500">Final Score</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">{highScore}</div>
                  <p className="text-sm text-gray-500">High Score</p>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={startGame}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onBack}
                  className="flex-1 border-2 border-gray-300 hover:bg-gray-50"
                >
                  Back to Games
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
