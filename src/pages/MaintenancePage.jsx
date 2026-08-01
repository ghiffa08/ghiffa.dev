import { useEffect, useState } from 'react';
import { Settings, Clock, AlertCircle } from 'lucide-react';

export default function MaintenancePage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-[#111111] rounded-full flex items-center justify-center">
              <Settings className="text-white animate-spin" size={48} style={{ animationDuration: '3s' }} />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <AlertCircle className="text-white" size={16} />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-[#111111]">
          Under Maintenance
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto">
          We're currently performing scheduled maintenance to improve your experience. 
          We'll be back shortly.
        </p>

        {/* Time Badge */}
        <div className="inline-flex items-center gap-3 bg-white border border-[#E5E5E5] rounded-full px-6 py-3 mb-12">
          <Clock className="text-gray-400" size={20} />
          <span className="font-mono text-sm font-bold text-gray-600">
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit',
              hour12: false 
            })}
          </span>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="bg-white border border-[#E5E5E5] p-6 text-left">
            <h3 className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-2 font-bold">
              Status
            </h3>
            <p className="text-sm font-bold text-[#111111]">
              Maintenance Mode
            </p>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-6 text-left">
            <h3 className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-2 font-bold">
              Expected Duration
            </h3>
            <p className="text-sm font-bold text-[#111111]">
              A few moments
            </p>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-6 text-left">
            <h3 className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-2 font-bold">
              Service Type
            </h3>
            <p className="text-sm font-bold text-[#111111]">
              Scheduled Update
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-12 text-xs text-gray-400 font-mono uppercase tracking-wider">
          Thank you for your patience
        </p>
      </div>
    </div>
  );
}
