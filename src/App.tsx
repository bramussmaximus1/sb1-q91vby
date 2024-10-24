import React, { useState } from 'react';
import { GameController, Palette, Music } from 'lucide-react';
import ColorMaze from './components/games/ColorMaze';
import SoundPuzzle from './components/games/SoundPuzzle';
import GravityPaint from './components/games/GravityPaint';

function App() {
  const [activeGame, setActiveGame] = useState<string>('maze');

  const games = [
    { id: 'maze', name: 'Color Maze', icon: GameController, component: ColorMaze },
    { id: 'sound', name: 'Sound Puzzle', icon: Music, component: SoundPuzzle },
    { id: 'paint', name: 'Gravity Paint', icon: Palette, component: GravityPaint },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Modern Mini-Games
          </h1>
          <p className="text-gray-400">
            Discover hidden surprises as you play!
          </p>
        </header>

        <div className="flex justify-center gap-4 mb-8">
          {games.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveGame(id)}
              className={`
                px-6 py-3 rounded-lg flex items-center gap-2 transition-all
                ${activeGame === id 
                  ? 'bg-purple-600 shadow-lg shadow-purple-600/30' 
                  : 'bg-gray-700 hover:bg-gray-600'}
              `}
            >
              <Icon className="w-5 h-5" />
              {name}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          {games.map(({ id, component: Game }) => (
            <div
              key={id}
              className={`transition-all duration-300 ${
                activeGame === id ? 'scale-100 opacity-100' : 'scale-95 opacity-0 hidden'
              }`}
            >
              <Game />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;