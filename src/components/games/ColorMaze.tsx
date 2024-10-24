import React, { useState, useEffect } from 'react';
import { Sparkles, Crown } from 'lucide-react';

export default function ColorMaze() {
  const [grid, setGrid] = useState<string[][]>([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const colors = ['bg-blue-400', 'bg-purple-400', 'bg-pink-400', 'bg-green-400'];
    const newGrid = Array(8).fill(null).map(() =>
      Array(8).fill(null).map(() => colors[Math.floor(Math.random() * colors.length)])
    );
    setGrid(newGrid);
    setPosition({ x: 0, y: 0 });
  };

  const handleMove = (x: number, y: number) => {
    if (x < 0 || x >= 8 || y < 0 || y >= 8) return;
    
    const currentColor = grid[position.y][position.x];
    const targetColor = grid[y][x];
    
    if (currentColor === targetColor) {
      setPosition({ x, y });
      setScore(prev => prev + 1);
      
      // Easter egg: Special pattern detection
      if (score > 20 && !showEasterEgg && 
          x === 7 && y === 7 && 
          grid[y][x] === 'bg-purple-400') {
        setShowEasterEgg(true);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const moves = {
      ArrowUp: { dx: 0, dy: -1 },
      ArrowDown: { dx: 0, dy: 1 },
      ArrowLeft: { dx: -1, dy: 0 },
      ArrowRight: { dx: 1, dy: 0 },
    };

    const move = moves[e.key as keyof typeof moves];
    if (move) {
      handleMove(position.x + move.dx, position.y + move.dy);
    }
  };

  return (
    <div 
      className="relative p-6 bg-gray-800 rounded-xl shadow-xl"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="absolute top-4 right-4 text-white flex items-center gap-2">
        <Crown className="w-5 h-5" />
        <span className="font-bold">{score}</span>
      </div>
      
      <div className="grid grid-cols-8 gap-1 w-[400px] h-[400px]">
        {grid.map((row, y) => (
          row.map((color, x) => (
            <div
              key={`${x}-${y}`}
              className={`
                ${color} w-full h-full rounded-lg transition-all duration-200
                ${position.x === x && position.y === y ? 'ring-4 ring-white ring-opacity-50 scale-90' : ''}
                hover:opacity-80 cursor-pointer
              `}
              onClick={() => handleMove(x, y)}
            />
          ))
        ))}
      </div>

      {showEasterEgg && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Sparkles className="w-20 h-20 text-yellow-400 animate-bounce" />
        </div>
      )}
    </div>
  );
}