import { useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, RotateCcw } from 'lucide-react';

interface MobileControlsProps {
  onInput: (key: string, pressed: boolean) => void;
}

export default function MobileControls({ onInput }: MobileControlsProps) {
  const createHandlers = useCallback((key: string) => ({
    onTouchStart: (e: React.TouchEvent) => { e.preventDefault(); onInput(key, true); },
    onTouchEnd: (e: React.TouchEvent) => { e.preventDefault(); onInput(key, false); },
    onMouseDown: () => onInput(key, true),
    onMouseUp: () => onInput(key, false),
    onMouseLeave: () => onInput(key, false),
  }), [onInput]);

  return (
    <div className="flex justify-between items-end mt-2 px-2 md:hidden">
      <div className="flex gap-2">
        <button
          {...createHandlers('arrowleft')}
          className="w-12 h-12 rounded-lg border border-primary/40 flex items-center justify-center bg-background/60 active:bg-primary/20"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <button
          {...createHandlers('arrowright')}
          className="w-12 h-12 rounded-lg border border-primary/40 flex items-center justify-center bg-background/60 active:bg-primary/20"
        >
          <ArrowRight className="w-5 h-5 text-primary" />
        </button>
      </div>

      <div className="flex gap-2">
        <button
          {...createHandlers('g')}
          className="w-12 h-12 rounded-lg border border-secondary/40 flex items-center justify-center bg-background/60 active:bg-secondary/20"
        >
          <RotateCcw className="w-5 h-5 text-secondary" />
        </button>
        <button
          {...createHandlers(' ')}
          className="w-14 h-12 rounded-lg border border-primary/40 flex items-center justify-center bg-background/60 active:bg-primary/20"
        >
          <ArrowUp className="w-5 h-5 text-primary" />
        </button>
      </div>
    </div>
  );
}
