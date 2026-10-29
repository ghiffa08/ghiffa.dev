import React, { useRef } from 'react';

/**
 * Draggable Interactive Item Wrapper with pointer capture and smooth matrix transforms
 */
export function DraggableItem({ children, className = '', title = '', ...props }) {
  const ref = useRef(null);

  const onPointerDown = (e) => {
    if (e.target.tagName.toLowerCase() === 'button' || e.target.closest('button')) return;
    const el = ref.current;
    if (!el) return;

    const style = window.getComputedStyle(el);
    const matrix = new DOMMatrixReadOnly(style.transform);
    const initialX = matrix.m41;
    const initialY = matrix.m42;
    const downX = e.clientX;
    const downY = e.clientY;
    const startX = e.clientX - initialX;
    const startY = e.clientY - initialY;
    let isDragging = false;

    const onPointerMove = (ev) => {
      if (!isDragging) {
        if (Math.hypot(ev.clientX - downX, ev.clientY - downY) < 4) return;
        isDragging = true;
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }
      const currentX = ev.clientX - startX;
      const currentY = ev.clientY - startY;
      el.style.transform = `translate(${currentX}px, ${currentY}px)`;
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      className={`draggable-item ${className}`}
      title={title}
      {...props}
    >
      {children}
    </div>
  );
}
