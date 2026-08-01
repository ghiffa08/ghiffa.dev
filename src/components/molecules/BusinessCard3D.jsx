import { useState, useRef } from 'react';
import { Mail, Phone } from 'lucide-react';

const GithubIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export function BusinessCard3D({ email, phone, github, linkedin, instagram, hero }) {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const transformX = rotation.x;
  const transformY = isFlipped ? rotation.y + 180 : rotation.y;

  return (
    <div 
      className="perspective-1000 w-full max-w-[340px] h-[200px] md:max-w-[420px] md:h-[240px] mt-16 cursor-pointer mx-auto relative z-20"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      ref={cardRef}
    >
      <div 
        className="w-full h-full relative transition-transform duration-700 ease-out preserve-3d shadow-2xl"
        style={{
          transform: `rotateX(${transformX}deg) rotateY(${transformY}deg) scale(${isHovered ? 1.05 : 1})`,
        }}
      >
        <div className="absolute inset-0 backface-hidden bg-[#111111] text-[#FAFAFA] border border-gray-800 p-6 md:p-8 flex flex-col shadow-2xl">
          <div className="flex justify-between items-start w-full">
            <div className="font-mono text-[10px] md:text-xs tracking-widest text-gray-500 uppercase truncate pr-4">
              GHIFFA.DEV // ID: 0x9F
            </div>
          </div>
          
          <div className="mt-auto">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none mb-1">
              <span className="text-[#FAFAFA]">{hero?.headline_1 || 'Haikal Jibran'}</span> <br/>
              <span className="text-gray-500">{hero?.headline_2 || 'Al Ghiffarry'}</span>
            </h2>
            <div className="w-full h-px bg-gray-800 my-4"></div>
            <div className="flex justify-between items-center font-mono text-[9px] md:text-[10px] text-gray-400 uppercase">
              <span className="tracking-widest truncate mr-2">{hero?.role || 'SYS. ARCHITECT / FULL-STACK'}</span>
              <span className="text-[#666666] font-bold flex-shrink-0">[ OPEN TO HIRE ]</span>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 backface-hidden bg-[#FAFAFA] text-[#111111] border border-gray-300 p-6 md:p-8 flex flex-col shadow-2xl transform rotate-y-180">
          <div className="flex flex-col h-full justify-between font-mono">
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-6">Contact Info</div>
              
              <div className="space-y-4 md:space-y-5 text-xs">
                <div className="flex items-center space-x-4 group">
                  <span className="w-8 md:w-10 text-gray-400 group-hover:text-[#666666] transition-colors"><Mail size={16} /></span>
                  <a href={`mailto:${email}`} className="font-bold hover:text-[#666666] transition-colors truncate">{email}</a>
                </div>
                {phone && (
                <div className="flex items-center space-x-4 group">
                  <span className="w-8 md:w-10 text-gray-400 group-hover:text-[#666666] transition-colors"><Phone size={16} /></span>
                  <a href={`tel:${phone}`} className="font-bold hover:text-[#666666] transition-colors truncate">{phone}</a>
                </div>
                )}
                <div className="flex items-center space-x-4 pt-3 md:pt-4 border-t border-gray-200 mt-3 md:mt-4">
                  <span className="w-8 md:w-10 text-gray-400">SOC.</span>
                  <div className="flex space-x-6 font-bold">
                    {github && <a href={github} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-[#111111] transition-colors"><GithubIcon size={18} /></a>}
                    {linkedin && <a href={linkedin} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-[#0077b5] transition-colors"><LinkedinIcon size={18} /></a>}
                    {instagram && <a href={instagram} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-[#E1306C] transition-colors"><InstagramIcon size={18} /></a>}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              <div className="w-16 h-4 md:w-24 md:h-6 border-l-2 md:border-l-4 border-[#111111] pl-2 flex flex-col justify-between opacity-50">
                 <div className="w-full h-px bg-gray-400"></div>
                 <div className="w-3/4 h-px bg-gray-400"></div>
                 <div className="w-full h-px bg-gray-400"></div>
              </div>
              <div className="text-[9px] text-gray-400 tracking-widest animate-pulse">TAP TO FLIP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
