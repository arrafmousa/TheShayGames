import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, RotateCcw, Trophy, Timer, Grid3X3, Grid2X2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function JigsawPuzzle({ images, onBack, onComplete }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [difficulty, setDifficulty] = useState(3); // 3x3 or 4x4
  const [pieces, setPieces] = useState([]);
  const [board, setBoard] = useState([]);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  // Timer effect
  useEffect(() => {
    if (startTime && !gameComplete) {
      const interval = setInterval(() => {
        setCurrentTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, gameComplete]);

  // Initialize puzzle
  const initializePuzzle = useCallback(() => {
    if (!selectedImage) return;

    const totalPieces = difficulty * difficulty;
    const newPieces = [];
    const newBoard = Array(totalPieces).fill(null);

    // Create pieces
    for (let i = 0; i < totalPieces; i++) {
      const row = Math.floor(i / difficulty);
      const col = i % difficulty;
      newPieces.push({
        id: i,
        correctPosition: i,
        row,
        col,
        imageUrl: selectedImage.url
      });
    }

    // Shuffle pieces
    const shuffledPieces = [...newPieces].sort(() => Math.random() - 0.5);
    
    setPieces(shuffledPieces);
    setBoard(newBoard);
    setGameComplete(false);
    setStartTime(Date.now());
    setCurrentTime(0);
    setGameStarted(true);
  }, [selectedImage, difficulty]);

  // Handle drag start
  const handleDragStart = useCallback((e, piece) => {
    setDraggedPiece(piece);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  // Handle drag over
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop
  const handleDrop = useCallback((e, targetIndex) => {
    e.preventDefault();
    
    if (!draggedPiece) return;

    // Check if the piece is dropped in the correct position
    if (draggedPiece.correctPosition === targetIndex) {
      setBoard(prev => {
        const newBoard = [...prev];
        newBoard[targetIndex] = draggedPiece;
        return newBoard;
      });
      
      setPieces(prev => prev.filter(piece => piece.id !== draggedPiece.id));
    }
    
    setDraggedPiece(null);
  }, [draggedPiece]);

  // Check for completion
  useEffect(() => {
    const filledSlots = board.filter(slot => slot !== null).length;
    if (filledSlots === difficulty * difficulty && filledSlots > 0) {
      setGameComplete(true);
      onComplete({ time: currentTime });
    }
  }, [board, difficulty, currentTime, onComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Image selection screen
  if (!selectedImage) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
                Jigsaw Puzzle
              </h1>
              <p className="text-gray-600">Choose a photo and difficulty level</p>
            </div>
            
            <div className="w-32"></div>
          </div>

          <Card className="game-card border-0 rounded-3xl mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-6">Select Difficulty</h2>
              <div className="flex justify-center gap-4 mb-8">
                <Button
                  variant={difficulty === 3 ? "default" : "outline"}
                  onClick={() => setDifficulty(3)}
                  className={difficulty === 3 ? "bg-gradient-to-r from-pink-500 to-orange-500" : "border-2 border-pink-300 text-pink-600 hover:bg-pink-50"}
                >
                  <Grid2X2 className="w-4 h-4 mr-2" />
                  3x3 (Easy)
                </Button>
                <Button
                  variant={difficulty === 4 ? "default" : "outline"}
                  onClick={() => setDifficulty(4)}
                  className={difficulty === 4 ? "bg-gradient-to-r from-pink-500 to-orange-500" : "border-2 border-orange-300 text-orange-600 hover:bg-orange-50"}
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  4x4 (Hard)
                </Button>
              </div>
              
              <h3 className="text-xl font-semibold text-center mb-6">Choose Shay's Photo</h3>
              <div className="grid grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img 
                      src={image.url} 
                      alt={`Shay ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Game not started screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="outline" 
              onClick={() => setSelectedImage(null)}
              className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Choose Different Photo
            </Button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
                {difficulty}x{difficulty} Jigsaw Puzzle
              </h1>
              <p className="text-gray-600">Ready to solve the puzzle?</p>
            </div>
            
            <div className="w-32"></div>
          </div>

          <div className="text-center">
            <div className="max-w-md mx-auto mb-8">
              <img 
                src={selectedImage.url} 
                alt="Selected"
                className="w-full rounded-2xl shadow-xl"
              />
            </div>
            
            <Button 
              onClick={initializePuzzle}
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold py-3 px-8 rounded-xl text-lg"
            >
              Start Puzzle
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main game screen
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => setGameStarted(false)}
            className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
              {difficulty}x{difficulty} Puzzle
            </h1>
            <div className="flex items-center justify-center gap-4 text-lg font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-pink-500" />
                {formatTime(currentTime)}
              </div>
              <div>
                Pieces Left: {pieces.length}
              </div>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={initializePuzzle}
            className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Puzzle Board */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Puzzle Board</h3>
            <div 
              className={`grid gap-2 p-4 bg-white rounded-2xl shadow-lg max-w-md mx-auto`}
              style={{ gridTemplateColumns: `repeat(${difficulty}, 1fr)` }}
            >
              {board.map((slot, index) => (
                <div
                  key={index}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden"
                  onDrop={(e) => handleDrop(e, index)}
                  onDragOver={handleDragOver}
                >
                  {slot ? (
                    <div 
                      className="w-full h-full relative"
                      style={{
                        backgroundImage: `url(${slot.imageUrl})`,
                        backgroundSize: `${difficulty * 100}% ${difficulty * 100}%`,
                        backgroundPosition: `-${(slot.col * 100)}% -${(slot.row * 100)}%`
                      }}
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">{index + 1}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pieces Tray */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Pieces Tray</h3>
            <div className="bg-white rounded-2xl shadow-lg p-4 min-h-96">
              <div className="grid grid-cols-4 gap-3">
                {pieces.map((piece) => (
                  <div
                    key={piece.id}
                    className="aspect-square border border-gray-200 rounded-lg cursor-move hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                    draggable
                    onDragStart={(e) => handleDragStart(e, piece)}
                  >
                    <div 
                      className="w-full h-full"
                      style={{
                        backgroundImage: `url(${piece.imageUrl})`,
                        backgroundSize: `${difficulty * 100}% ${difficulty * 100}%`,
                        backgroundPosition: `-${(piece.col * 100)}% -${(piece.row * 100)}%`
                      }}
                    />
                  </div>
                ))}
              </div>
              {pieces.length === 0 && (
                <div className="text-center text-gray-500 py-20">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                  <p className="text-lg">All pieces placed!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success Dialog */}
        <Dialog open={gameComplete} onOpenChange={() => setGameComplete(false)}>
          <DialogContent className="game-card border-0 rounded-3xl">
            <DialogHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Puzzle Complete!
              </DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-600">
                Congratulations! You've successfully completed the {difficulty}x{difficulty} puzzle!
              </p>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">{formatTime(currentTime)}</div>
                <p className="text-sm text-gray-500">Completion Time</p>
              </div>
              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={() => setSelectedImage(null)}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white"
                >
                  New Puzzle
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
