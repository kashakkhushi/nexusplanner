import React, { useState, useEffect } from 'react';
import { Clock, Globe } from 'lucide-react';

export default function DeskClocksCard() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatClockTime = (offsetHours: number) => {
    // Get UTC time first
    const utc = time.getTime() + (time.getTimezoneOffset() * 60000);
    // Add offset
    const nd = new Date(utc + (3600000 * offsetHours));
    return nd.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Dedicated hand rotations based on local time and offset
  const getHandRotations = (offsetHours: number) => {
    const utc = time.getTime() + (time.getTimezoneOffset() * 60000);
    const nd = new Date(utc + (3600000 * offsetHours));
    
    const hrs = nd.getHours() % 12;
    const mins = nd.getMinutes();
    const secs = nd.getSeconds();

    const hrDegrees = (hrs * 30) + (mins * 0.5);
    const minDegrees = (mins * 6) + (secs * 0.1);
    const secDegrees = secs * 6;

    return { hrDegrees, minDegrees, secDegrees };
  };

  const clocks = [
    { name: 'IST / Local', location: 'New Delhi', offset: 5.5 },
    { name: 'UTC / GMT', location: 'London', offset: 0 },
    { name: 'PST', location: 'San Francisco', offset: -7 }, // Assuming Daylight Savings (PDT is UTC-7)
  ];

  return (
    <div className="bg-white/75 backdrop-blur-xs border border-white p-5 rounded-[24px] shadow-sm flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#624F43]/5">
          <h3 className="font-serif font-bold text-xs text-[#3E332E] tracking-wider uppercase flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#B08B74]" />
            Desk Clocks
          </h3>
          <span className="text-[9px] font-mono font-bold text-[#624F43]/40 uppercase tracking-widest">3 Zones</span>
        </div>

        {/* Clocks Grid Column */}
        <div className="space-y-4 pt-1">
          {clocks.map((clk) => {
            const rotations = getHandRotations(clk.offset);
            return (
              <div 
                key={clk.name}
                className="bg-[#FAF5EF]/70 border border-[#624F43]/5 p-3.5 rounded-2xl flex items-center justify-between shadow-2xs hover:border-[#B08B74]/20 transition-all"
              >
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-[#624F43]/50 uppercase tracking-widest block">
                    {clk.name}
                  </span>
                  <span className="font-mono font-bold text-sm text-[#3E332E] tracking-tight block">
                    {formatClockTime(clk.offset)}
                  </span>
                  <span className="text-[9px] font-semibold text-[#B08B74] flex items-center gap-1">
                    <Globe className="w-2.5 h-2.5" />
                    {clk.location}
                  </span>
                </div>

                {/* Gorgeous Analog Dial Vector Clock Face */}
                <div className="w-12 h-12 rounded-full border border-[#624F43]/20 bg-white relative flex items-center justify-center shadow-inner flex-shrink-0">
                  {/* Dial center pin */}
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B08B74] z-10" />
                  
                  {/* Hours Hand */}
                  <div 
                    className="absolute bg-[#3E332E] rounded-full origin-bottom"
                    style={{
                      width: '2px',
                      height: '10px',
                      bottom: '50%',
                      transform: `rotate(${rotations.hrDegrees}deg)`,
                      transition: 'transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 1)'
                    }}
                  />

                  {/* Minutes Hand */}
                  <div 
                    className="absolute bg-[#624F43]/70 rounded-full origin-bottom"
                    style={{
                      width: '1.5px',
                      height: '14px',
                      bottom: '50%',
                      transform: `rotate(${rotations.minDegrees}deg)`,
                      transition: 'transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 1)'
                    }}
                  />

                  {/* Seconds Hand */}
                  <div 
                    className="absolute bg-red-400 rounded-full origin-bottom"
                    style={{
                      width: '1px',
                      height: '16px',
                      bottom: '50%',
                      transform: `rotate(${rotations.secDegrees}deg)`
                    }}
                  />

                  {/* 12, 3, 6, 9 markers */}
                  <div className="absolute top-0.5 text-[6px] font-mono font-bold text-[#624F43]/30">12</div>
                  <div className="absolute bottom-0.5 text-[6px] font-mono font-bold text-[#624F43]/30">6</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
