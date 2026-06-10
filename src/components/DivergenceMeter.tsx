/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { gameAudio } from "./AudioEngine";

interface DivergenceMeterProps {
  value: number; // e.g. 0.337187
  onSteinerComplete?: () => void;
}

export default function DivergenceMeter({ value, onSteinerComplete }: DivergenceMeterProps) {
  const [displayedValue, setDisplayedValue] = useState<string>("0.571024");
  const [isScrambling, setIsScrambling] = useState<boolean>(false);

  useEffect(() => {
    // Whenever value changes, trigger the Reading Steiner scrambling effect!
    const targetStr = value.toFixed(6);
    if (parseFloat(displayedValue) === value) return;

    setIsScrambling(true);
    gameAudio.playSfx("steiner");

    let count = 0;
    const interval = setInterval(() => {
      // Generate some scramble text
      const scrambled = Array.from({ length: 8 }, (_, i) => {
        if (i === 1) return ".";
        return Math.floor(Math.random() * 10).toString();
      }).join("");
      
      setDisplayedValue(scrambled);
      count++;

      if (count > 25) {
        clearInterval(interval);
        setDisplayedValue(targetStr);
        setIsScrambling(false);
        if (onSteinerComplete) {
          onSteinerComplete();
        }
      }
    }, 60);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <div 
      id="divergence_meter_root"
      className="flex flex-col items-center justify-center py-2.5 px-5 bg-black/95 border border-[#00ff41]/20 rounded-sm shadow-[0_0_20px_rgba(0,255,65,0.1)] backdrop-blur-md"
    >
      <div className="flex items-center gap-1.5 font-mono">
        {/* Nixie tubes wrapper */}
        {displayedValue.split("").map((char, index) => {
          if (char === ".") {
            return (
              <span 
                key={index} 
                className="text-[#ff6b00] text-lg sm:text-2xl font-bold animate-pulse mx-0.5"
                style={{ textShadow: "0 0 10px rgba(255, 107, 0, 0.9)" }}
              >
                .
              </span>
            );
          }
          return (
            <div 
              key={index} 
              className={`relative flex items-center justify-center w-8 h-12 sm:w-10 sm:h-16 rounded-sm bg-gradient-to-b from-black to-[#050508] border border-stone-900 shadow-inner overflow-hidden ${
                isScrambling ? "animate-bounce" : ""
              }`}
            >
              {/* Vacuum tube glass reflection */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-amber-500/10 pointer-events-none" />
              
              {/* Glowing inactive filament backdrop */}
              <span className="absolute text-[#ff6b00]/5 text-2xl sm:text-4xl font-extrabold select-none">
                8
              </span>

              {/* Ultra glowing active letter */}
              <span 
                className="relative text-2xl sm:text-4xl font-extrabold text-[#ff6b00] select-none z-10 transition-all duration-75"
                style={{
                  color: "#ff6b00",
                  textShadow: isScrambling 
                    ? "0 0 18px rgba(255, 107, 0, 1), 0 0 30px rgba(255, 60, 0, 0.8)" 
                    : "0 0 8px rgba(255, 107, 0, 0.9), 0 0 15px rgba(255, 60, 0, 0.5), 0 0 2px rgba(255, 255, 255, 0.8)",
                  fontFamily: "'Courier New', Courier, monospace"
                }}
              >
                {char}
              </span>
            </div>
          );
        })}

        {/* Units badge % */}
        <div className="flex flex-col justify-end h-12 sm:h-16 pb-1 pl-1">
          <span 
            className="text-xs font-bold text-[#ff6b00]"
            style={{ textShadow: "0 0 5px rgba(255, 107, 0, 0.3)" }}
          >
            %
          </span>
        </div>
      </div>
      
      <div className="mt-1 text-[9px] font-mono tracking-widest text-[#00ff41]/60 uppercase select-none">
        WORLDLINE DIVERGENCE METER
      </div>
    </div>
  );
}
