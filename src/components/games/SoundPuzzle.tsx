import React, { useState, useEffect } from 'react';
import { Music, Zap } from 'lucide-react';

export default function SoundPuzzle() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [foundSecret, setFoundSecret] = useState(false);

  const notes = [
    { freq: 261.63, color: 'bg-red-400' },    // C4
    { freq: 329.63, color: 'bg-blue-400' },   // E4
    { freq: 392.00, color: 'bg-green-400' },  // G4
    { freq: 523.25, color: 'bg-yellow-400' }, // C5
  ];

  useEffect(() => {
    if (sequence.length === 0) generateSequence();
  }, []);

  const generateSequence = () => {
    const newSequence = Array(4).fill(null)
      .map(() => Math.floor(Math.random() * 4));
    setSequence(newSequence);
    playSequence(newSequence);
  };

  const playNote = (freq: number, duration: number) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = freq;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  };

  const playSequence = async (seq: number[]) => {
    setIsPlaying(true);
    for (let i = 0; i < seq.length; i++) {
      playNote(notes[seq[i]].freq, 0.3);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setIsPlaying(false);
  };

  const handleTileClick = (index: number) => {
    if (isPlaying) return;

    playNote(notes[index].freq, 0.3);
    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence.length === sequence.length) {
      if (newPlayerSequence.every((n, i) => n === sequence[i])) {
        // Easter egg: Special melody detection
        if (sequence.join('') === '0123') {
          setFoundSecret(true);
        }
        setTimeout(() => {
          generateSequence();
          setPlayerSequence([]);
        }, 1000);
      } else {
        setPlayerSequence([]);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-xl shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <Music className="text-white w-6 h-6" />
        {foundSecret && <Zap className="text-yellow-400 w-6 h-6 animate-pulse" />}
      </div>

      <div className="grid grid-cols-2 gap-4 w-[300px]">
        {notes.map((note, index) => (
          <button
            key={index}
            className={`
              ${note.color} h-32 rounded-xl transition-all duration-200
              ${playerSequence.includes(index) ? 'scale-95' : ''}
              hover:opacity-80 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50
            `}
            onClick={() => handleTileClick(index)}
            disabled={isPlaying}
          />
        ))}
      </div>
    </div>
  );
}