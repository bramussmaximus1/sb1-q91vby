import React, { useState, useRef, useEffect } from 'react';
import { Droplets, Sparkles } from 'lucide-react';

export default function GravityPaint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [particles, setParticles] = useState<Array<{
    x: number;
    y: number;
    color: string;
    vy: number;
  }>>([]);
  const [secretFound, setSecretFound] = useState(false);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEEAD', '#D4A5A5', '#9B9B9B', '#E9D985'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      setParticles(prevParticles => 
        prevParticles.map(particle => {
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
          ctx.fill();

          particle.y += particle.vy;
          particle.vy += 0.1;

          // Easter egg: Special pattern detection
          if (particles.length > 100 && !secretFound) {
            const pattern = particles.filter(p => 
              Math.abs(p.x - particle.x) < 5 && 
              Math.abs(p.y - particle.y) < 5
            ).length;
            
            if (pattern > 10) {
              setSecretFound(true);
            }
          }

          return particle.y < canvas.height ? particle : {
            ...particle,
            y: 0,
            vy: Math.random() * 2
          };
        })
      );

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setParticles(prev => [
      ...prev,
      {
        x,
        y,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: -2
      }
    ]);
  };

  return (
    <div className="relative p-6 bg-gray-800 rounded-xl shadow-xl">
      <div className="absolute top-4 right-4 flex gap-2">
        <Droplets className="text-blue-400 w-6 h-6" />
        {secretFound && (
          <Sparkles className="text-yellow-400 w-6 h-6 animate-bounce" />
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="bg-black rounded-lg cursor-crosshair"
        onPointerDown={() => setIsDrawing(true)}
        onPointerUp={() => setIsDrawing(false)}
        onPointerMove={handlePointerMove}
      />
    </div>
  );
}