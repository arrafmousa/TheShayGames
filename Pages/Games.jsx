import React, { useState, useCallback } from "react";
import { Upload, Play, Trophy, Puzzle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import ImageUploader from "../components/games/ImageUploader";
import MemoryMatch from "../components/games/MemoryMatch";
import FloppyShay from "../components/games/FloppyShay";
import JigsawPuzzle from "../components/games/JigsawPuzzle";

export default function GamesPage() {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [gameStats, setGameStats] = useState({
    memoryMatch: { bestTime: null, gamesPlayed: 0 },
    floppyShay: { highScore: 0, gamesPlayed: 0 },
    jigsawPuzzle: { completions: 0, bestTime: null }
  });

  const handleImagesUploaded = useCallback((images) => {
    setUploadedImages(images);
  }, []);

  const handleGameComplete = useCallback((gameType, result) => {
    setGameStats(prev => {
      const newStats = { ...prev };
      newStats[gameType].gamesPlayed += 1;
      
      if (gameType === 'memoryMatch' && result.time) {
        if (!newStats[gameType].bestTime || result.time < newStats[gameType].bestTime) {
          newStats[gameType].bestTime = result.time;
        }
      } else if (gameType === 'floppyShay' && result.score > newStats[gameType].highScore) {
        newStats[gameType].highScore = result.score;
      } else if (gameType === 'jigsawPuzzle') {
        newStats[gameType].completions += 1;
        if (result.time && (!newStats[gameType].bestTime || result.time < newStats[gameType].bestTime)) {
          newStats[gameType].bestTime = result.time;
        }
      }
      
      return newStats;
    });
  }, []);

  const formatTime = (seconds) => {
    if (!seconds) return '--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (uploadedImages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto">
          <ImageUploader onImagesUploaded={handleImagesUploaded} />
        </div>
      </div>
    );
  }

  if (currentGame) {
    const GameComponent = {
      memory: MemoryMatch,
      floppy: FloppyShay,
      jigsaw: JigsawPuzzle
    }[currentGame];

    return (
      <GameComponent 
        images={uploadedImages}
        onBack={() => setCurrentGame(null)}
        onComplete={(result) => handleGameComplete(currentGame === 'memory' ? 'memoryMatch' : currentGame === 'floppy' ? 'floppyShay' : 'jigsawPuzzle', result)}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Choose Your Game
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three personalized games featuring Shay's photos. Each one is crafted with love as a special farewell gift.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="game-card group hover:glow-effect transition-all duration-500 cursor-pointer border-0 rounded-3xl overflow-hidden"
                onClick={() => setCurrentGame('memory')}>
            <CardContent className="p-8 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Memory Match</h3>
                <p className="text-gray-600 mb-6">
                  Find matching pairs of Shay's photos in this classic memory game. Test your recall and enjoy the memories!
                </p>
                <div className="space-y-2 text-sm text-gray-500 mb-6">
                  <div>Games Played: {gameStats.memoryMatch.gamesPlayed}</div>
                  <div>Best Time: {formatTime(gameStats.memoryMatch.bestTime)}</div>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg">
                  <Play className="w-5 h-5 mr-2" />
                  Play Memory Match
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="game-card group hover:glow-effect transition-all duration-500 cursor-pointer border-0 rounded-3xl overflow-hidden"
                onClick={() => setCurrentGame('floppy')}>
            <CardContent className="p-8 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <span className="text-indigo-500 font-bold text-xl">S</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Floppy Shay</h3>
                <p className="text-gray-600 mb-6">
                  Help Shay fly through obstacles in this fun physics-based game. Tap to keep him airborne!
                </p>
                <div className="space-y-2 text-sm text-gray-500 mb-6">
                  <div>Games Played: {gameStats.floppyShay.gamesPlayed}</div>
                  <div>High Score: {gameStats.floppyShay.highScore}</div>
                </div>
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg">
                  <Play className="w-5 h-5 mr-2" />
                  Play Floppy Shay
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="game-card group hover:glow-effect transition-all duration-500 cursor-pointer border-0 rounded-3xl overflow-hidden"
                onClick={() => setCurrentGame('jigsaw')}>
            <CardContent className="p-8 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Puzzle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Jigsaw Puzzle</h3>
                <p className="text-gray-600 mb-6">
                  Piece together one of Shay's photos in this relaxing puzzle game. Choose your difficulty level!
                </p>
                <div className="space-y-2 text-sm text-gray-500 mb-6">
                  <div>Completions: {gameStats.jigsawPuzzle.completions}</div>
                  <div>Best Time: {formatTime(gameStats.jigsawPuzzle.bestTime)}</div>
                </div>
                <Button className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg">
                  <Play className="w-5 h-5 mr-2" />
                  Play Jigsaw Puzzle
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="game-card border-0 rounded-3xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Your Images</h3>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="aspect-square rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={image.url} 
                    alt={`Shay ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              onClick={() => setUploadedImages([])}
              className="mt-6 border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 text-purple-600 font-semibold"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Different Images
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
