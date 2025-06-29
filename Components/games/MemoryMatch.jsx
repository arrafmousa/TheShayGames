import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, RotateCcw, Trophy, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function MemoryMatch({ images, onBack, onComplete }) {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Initialize game
  const initializeGame = useCallback(() => {
    // Create pairs of cards
    const cardPairs = [];
    images.forEach((image, index) => {
      cardPairs.push(
        { id: `${index}-a`, imageUrl: image.url, pairId: index },
        { id: `${index}-b`, imageUrl: image.url, pairId: index }
      );
    });
    
    // Shuffle cards
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameComplete(false);
    setStartTime(Date.now());
    setCurrentTime(0);
  }, [images]);

  // Timer effect
  useEffect(() => {
    if (startTime && !gameComplete) {
      const interval = setInterval(() => {
        setCurrentTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, gameComplete]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Handle card flip
  const flipCard = useCallback((cardId) => {
    if (isChecking || flippedCards.includes(cardId) || matchedPairs.some(pair => pair.includes(cardId))) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      setIsChecking(true);

      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = cards.find(card => card.id === secondCardId);

      if (firstCard.pairId === secondCard.pairId) {
        // Match found
        setTimeout(() => {
          setMatchedPairs(prev => [...prev, firstCardId, secondCardId]);
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [flippedCards, matchedPairs, cards, isChecking]);

  // Check for game completion
  useEffect(() => {
    if (matchedPairs.length === cards.length && cards.length > 0) {
      setGameComplete(true);
      onComplete({ time: currentTime, moves });
    }
  }, [matchedPairs.length, cards.length, currentTime, moves, onComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isCardVisible = (cardId) => {
    return flippedCards.includes(cardId) || matchedPairs.includes(cardId);
  };

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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Memory Match
            </h1>
            <p className="text-gray-600">Find all the matching pairs!</p>
          </div>

          <Button 
            variant="outline" 
            onClick={initializeGame}
            className="border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-700">
              <Timer className="w-5 h-5 text-purple-500" />
              {formatTime(currentTime)}
            </div>
            <p className="text-sm text-gray-500">Time</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700">{moves}</div>
            <p className="text-sm text-gray-500">Moves</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700">{matchedPairs.length / 2}/{cards.length / 2}</div>
            <p className="text-sm text-gray-500">Pairs Found</p>
          </div>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-5 gap-4 max-w-2xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              className="aspect-square cursor-pointer"
              onClick={() => flipCard(card.id)}
            >
              <div className={`relative w-full h-full flip-card ${isCardVisible(card.id) ? 'flipped' : ''}`}>
                {/* Front (face down) */}
                <div className="flip-card-front w-full h-full rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">?</span>
                  </div>
                </div>
                
                {/* Back (face up) */}
                <div className="flip-card-back w-full h-full rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={card.imageUrl} 
                    alt="Memory card"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Win Dialog */}
        <Dialog open={gameComplete} onOpenChange={() => setGameComplete(false)}>
          <DialogContent className="game-card border-0 rounded-3xl">
            <DialogHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Congratulations!
              </DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-600">You've completed the Memory Match game!</p>
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{formatTime(currentTime)}</div>
                  <p className="text-sm text-gray-500">Final Time</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{moves}</div>
                  <p className="text-sm text-gray-500">Total Moves</p>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={initializeGame}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                >
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
