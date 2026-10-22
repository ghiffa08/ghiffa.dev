import React, { useState, useEffect } from 'react';

/**
 * TypewriterText Atom
 * Types out text letter-by-letter once triggered, with layout stability and a sleek cursor.
 * Guarantees zero line-wrapping with whitespace-nowrap.
 */
export function TypewriterText({
  text = 'about me',
  delay = 650,
  speed = 90,
  trigger = true,
  cursorClassName = 'w-[3px] h-[0.85em] bg-[#FF5500] ml-1 sm:ml-1.5',
  fadeCursorAfterMs = 2500
}) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!trigger) return;

    let timeoutId = null;
    let intervalId = null;
    let cursorTimeoutId = null;

    timeoutId = setTimeout(() => {
      let currentIndex = 0;

      intervalId = setInterval(() => {
        currentIndex += 1;
        setDisplayText(text.slice(0, currentIndex));

        if (currentIndex >= text.length) {
          clearInterval(intervalId);
          if (fadeCursorAfterMs > 0) {
            cursorTimeoutId = setTimeout(() => {
              setShowCursor(false);
            }, fadeCursorAfterMs);
          }
        }
      }, speed);
    }, delay);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
      if (cursorTimeoutId) clearTimeout(cursorTimeoutId);
    };
  }, [trigger, text, delay, speed, fadeCursorAfterMs]);

  return (
    <span className="relative inline-flex items-center whitespace-nowrap">
      {/* Invisible layout placeholder to prevent handle/container layout shift */}
      <span className="invisible select-none whitespace-nowrap flex items-center" aria-hidden="true">
        <span>{text}</span>
        <span className={`inline-block ${cursorClassName} shrink-0`} />
      </span>
      {/* Active typing text layer */}
      <span className="absolute inset-0 flex items-center whitespace-nowrap">
        <span className="whitespace-nowrap">{displayText}</span>
        <span
          className={`inline-block ${cursorClassName} shrink-0 transition-opacity duration-300 ${
            showCursor ? 'opacity-100 animate-pulse' : 'opacity-0'
          }`}
        />
      </span>
    </span>
  );
}
