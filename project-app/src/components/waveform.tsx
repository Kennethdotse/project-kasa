"use client";

import { useEffect, useRef } from 'react';

type WaveformProps = {
  audioBlob: Blob | null;
  className?: string;
  barWidth?: number;
  barGap?: number;
  barColor?: string;
};

export default function Waveform({
  audioBlob,
  className,
  barWidth = 2,
  barGap = 1,
  barColor = '#A1A1AA', // zinc-400
}: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!audioBlob || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    let animationFrameId: number;

    const draw = (buffer: AudioBuffer) => {
      const data = buffer.getChannelData(0);
      const { width, height } = canvas;
      context.clearRect(0, 0, width, height);

      const step = Math.ceil(data.length / (width / (barWidth + barGap)));
      const amp = height / 2;

      context.fillStyle = barColor;

      for (let i = 0; i < width; i += (barWidth + barGap)) {
        let min = 1.0;
        let max = -1.0;

        for (let j = 0; j < step; j++) {
            const datum = data[(i * step) + j];
            if (datum < min) {
                min = datum;
            }
            if (datum > max) {
                max = datum;
            }
        }
        
        const barHeight = Math.max(1, (max - min) * amp);
        context.fillRect(i, amp - barHeight / 2, barWidth, barHeight);
      }
    };
    
    audioBlob.arrayBuffer().then(arrayBuffer => {
      audioContext.decodeAudioData(
        arrayBuffer,
        (buffer) => {
          draw(buffer);
        },
        (error) => {
          console.error('Error decoding audio data:', error);
        }
      );
    });

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      audioContext.close();
    };
  }, [audioBlob, barWidth, barGap, barColor]);

  return <canvas ref={canvasRef} className={className} width="500" height="100" />;
}
