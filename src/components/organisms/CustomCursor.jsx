import { useMousePosition } from '../../hooks/useMousePosition';

export function CustomCursor({ hoveredArticleImg, activeDetail }) {
  const mousePos = useMousePosition();
  
  return (
    <div 
      className="fixed top-0 left-0 w-72 h-48 pointer-events-none z-[90] overflow-hidden rounded-lg shadow-2xl transition-opacity duration-300 transform -translate-x-1/2 -translate-y-1/2"
      style={{ 
        opacity: hoveredArticleImg && !activeDetail ? 1 : 0,
        left: mousePos.x,
        top: mousePos.y,
      }}
    >
      <div 
        className="w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${hoveredArticleImg})` }}
      />
    </div>
  );
}
