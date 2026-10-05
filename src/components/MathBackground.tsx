import React, { useEffect, useRef } from 'react';

export const MathBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Floating math symbols
    const symbols = ['π', '∑', '√x', 'a²+b²=c²', '∫', 'f(x)', 'Δ', 'x²', '≠', '≈', '∞', '%', 'θ', 'sin α', 'E=mc²'];
    
    interface MathParticle {
      x: number;
      y: number;
      text: string;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
    }

    const particles: MathParticle[] = Array.from({ length: 26 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      text: symbols[Math.floor(Math.random() * symbols.length)],
      size: Math.floor(Math.random() * 12) + 14,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.18 + 0.05,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.006,
    }));

    let t = 0;
    const render = () => {
      t += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Subtle gradient background
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.3,
        100,
        width * 0.5,
        height * 0.5,
        width * 0.8
      );
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle geometric grid lines
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.035)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw faint floating geometric wireframes
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 1.5;
      
      // Floating triangle
      const triX = (width * 0.15 + Math.sin(t * 0.5) * 40);
      const triY = (height * 0.35 + Math.cos(t * 0.4) * 30);
      ctx.beginPath();
      ctx.moveTo(triX, triY - 40);
      ctx.lineTo(triX + 45, triY + 35);
      ctx.lineTo(triX - 45, triY + 35);
      ctx.closePath();
      ctx.stroke();

      // Floating circle with radius
      const circX = (width * 0.85 + Math.cos(t * 0.6) * 35);
      const circY = (height * 0.25 + Math.sin(t * 0.5) * 25);
      ctx.beginPath();
      ctx.arc(circX, circY, 35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(circX, circY);
      ctx.lineTo(circX + 35 * Math.cos(t), circY + 35 * Math.sin(t));
      ctx.stroke();

      ctx.restore();

      // Draw floating math symbols
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.x < -60) p.x = width + 50;
        if (p.x > width + 60) p.x = -50;
        if (p.y < -60) p.y = height + 50;
        if (p.y > height + 60) p.y = -50;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.font = `${p.size}px 'JetBrains Mono', 'Plus Jakarta Sans', monospace`;
        ctx.fillStyle = `rgba(147, 197, 253, ${p.opacity})`;
        ctx.fillText(p.text, 0, 0);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
};
