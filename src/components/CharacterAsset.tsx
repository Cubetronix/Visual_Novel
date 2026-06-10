/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface CharacterAssetProps {
  name: "okabe" | "kurisu" | "mayuri" | "daru" | "none";
  expression?: "default" | "smug" | "blush" | "shocked" | "sad" | "laugh" | "serious";
  className?: string;
  side: "left" | "right";
}

export default function CharacterAsset({
  name,
  expression = "default",
  className = "",
  side
}: CharacterAssetProps) {
  if (name === "none") return null;

  // Render highly detailed anime silhouettes / styled vector avatars
  const renderOkabe = () => {
    // Mad Scientist: messy dark hair, sharp eyes, white lab coat, dramatic blue-grey shadow
    const isBlush = expression === "blush";
    const isShocked = expression === "shocked";
    const isMad = expression === "serious" || expression === "laugh";
    
    return (
      <svg viewBox="0 0 400 500" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
        <defs>
          <linearGradient id="okabeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="skinOkabe" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffeedd" />
            <stop offset="100%" stopColor="#ffd8c0" />
          </linearGradient>
        </defs>

        {/* Ambient background ring glow */}
        <circle cx="200" cy="220" r="140" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="6,6" className="opacity-20 animate-[spin_40s_linear_infinite]" />
        
        {/* Lab Coat / Body */}
        <path d="M 100,500 L 100,410 L 120,370 L 170,335 L 230,335 L 280,370 L 300,410 L 300,500 Z" fill="url(#okabeGrad)" />
        {/* White Lab Coat Lapels */}
        <path d="M 120,370 L 160,380 L 170,500 L 100,500 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M 280,370 L 240,380 L 230,500 L 300,500 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
        {/* Inner Shirt (Slate Blue) */}
        <path d="M 160,380 L 200,440 L 240,380 L 200,335 Z" fill="#334155" />
        
        {/* Neck (Shortened, tapered, and aligned seamlessly under the chin) */}
        <path d="M 177,340 L 183,230 L 217,230 L 223,340 Z" fill="url(#skinOkabe)" />

        {/* Head Base */}
        <path d="M 140,190 C 140,290 260,290 260,190 C 260,130 140,130 140,190 Z" fill="url(#skinOkabe)" />

        {/* Blush cheeks */}
        {isBlush && (
          <g opacity="0.6">
            <ellipse cx="165" cy="220" rx="14" ry="6" fill="#f43f5e" />
            <ellipse cx="235" cy="220" rx="14" ry="6" fill="#f43f5e" />
          </g>
        )}

        {/* Eyes */}
        <g stroke="#1e293b" strokeWidth="3" fill="none">
          {isShocked ? (
            // Big wide shocked eyes
            <>
              <circle cx="175" cy="200" r="10" fill="#fff" />
              <circle cx="175" cy="200" r="4" fill="#2563eb" />
              <circle cx="225" cy="200" r="10" fill="#fff" />
              <circle cx="225" cy="200" r="4" fill="#2563eb" />
            </>
          ) : (
            // Sharp determined eyes
            <>
              <path d="M 160,192 C 165,188 185,188 190,195" />
              <circle cx="175" cy="202" r="5" fill="#1e293b" />
              <path d="M 240,192 C 235,188 215,188 210,195" />
              <circle cx="225" cy="202" r="5" fill="#1e293b" />
            </>
          )}
        </g>

        {/* Mad scientist sinister eyebrows or worried */}
        <g stroke="#0f172a" strokeWidth="4" fill="none">
          {isShocked ? (
            <>
              <path d="M 155,178 Q 175,165 190,178" />
              <path d="M 245,178 Q 225,165 210,178" />
            </>
          ) : isMad ? (
            <>
              <path d="M 155,185 L 188,192" />
              <path d="M 245,185 L 212,192" />
            </>
          ) : (
            <>
              <path d="M 155,182 Q 175,175 190,182" />
              <path d="M 245,182 Q 225,175 210,182" />
            </>
          )}
        </g>

        {/* Mouth */}
        <g stroke="#1e293b" strokeWidth="3" fill="none">
          {expression === "laugh" ? (
            <path d="M 180,235 Q 200,265 220,235 Z" fill="#f43f5e" />
          ) : isShocked ? (
            <circle cx="200" cy="240" r="7" fill="#111" />
          ) : (
            <path d="M 185,235 Q 200,242 215,235" />
          )}
        </g>

        {/* Okabe Messy Hair Layer (Dark slate style) */}
        <path d="M 130,190 C 120,130 160,80 200,80 C 240,80 280,130 270,190 C 285,180 290,140 270,110 C 250,90 230,85 200,90 C 170,85 150,90 130,110 C 110,140 115,180 130,190 Z" fill="#1e293b" />
        {/* Spiky bangs hanging forward */}
        <path d="M 140,135 L 155,170 L 165,140 L 180,185 L 190,145 L 200,195 L 210,145 L 220,185 L 235,140 L 245,170 L 260,135 Z" fill="#0f172a" />
        <path d="M 135,160 L 130,220 L 145,190 Z" fill="#0f172a" />
        <path d="M 265,160 L 270,220 L 255,190 Z" fill="#0f172a" />

        {/* Science glasses ornament overlay if Hououin styling */}
        <rect x="190" y="10" width="20" height="15" fill="#ff7f00" opacity="0.1" />
      </svg>
    );
  };

  const renderKurisu = () => {
    // Kurisu (Christina): Gorgeous long auburn hair, elegant face, beige jacket, tie.
    const isBlush = expression === "blush" || expression === "smug";
    const isShocked = expression === "shocked";
    const isSad = expression === "sad";

    return (
      <svg viewBox="0 0 400 500" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
        <defs>
          <linearGradient id="kurisuHair" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7c2d12" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id="kurisuJacket" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
          <linearGradient id="skinKurisu" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff1f2" />
            <stop offset="100%" stopColor="#ffe4e6" />
          </linearGradient>
        </defs>

        {/* Ambient background ring glow */}
        <circle cx="200" cy="220" r="140" fill="none" stroke="#ea580c" strokeWidth="2" strokeDasharray="4,4" className="opacity-20 animate-[spin_30s_linear_infinite]" />

        {/* --- KURISU HAIR - BACKFLOW (More dynamic and voluminous back hair) --- */}
        <path d="M 110,200 C 70,280 80,420 95,500 L 305,500 C 320,420 330,280 290,200 C 270,250 250,280 200,280 C 150,280 130,250 110,200 Z" fill="url(#kurisuHair)" />
        {/* Back Hair extra locks on shoulders */}
        <path d="M 95,320 Q 75,410 85,500 Q 110,480 115,410 Z" fill="#5c1d0a" />
        <path d="M 305,320 Q 325,410 315,500 Q 290,480 285,410 Z" fill="#5c1d0a" />

        {/* Body & Beige Cardigan (Jacket raised to shorten the neck line) */}
        <path d="M 110,500 L 110,390 L 130,340 L 270,340 L 290,390 L 290,500 Z" fill="url(#kurisuJacket)" />
        {/* White shirt and Red Tie */}
        <path d="M 170,340 L 200,400 L 230,340 Z" fill="#ffffff" />
        <path d="M 196,360 L 204,360 L 208,445 L 192,445 Z" fill="#be123c" /> {/* Red Tie */}

        {/* Neck (Shortened, tapered, and deeply anchored into the chin to prevent gaps) */}
        <path d="M 181,345 L 185,230 L 215,230 L 219,345 Z" fill="url(#skinKurisu)" />

        {/* Head Base */}
        <path d="M 145,200 C 145,290 255,290 255,200 C 255,145 145,145 145,200 Z" fill="url(#skinKurisu)" />

        {/* Cheek Blush */}
        {isBlush && (
          <g opacity="0.8">
            <ellipse cx="170" cy="225" rx="15" ry="7" fill="#f43f5e" />
            <ellipse cx="230" cy="225" rx="15" ry="7" fill="#f43f5e" />
            {/* Blushing slash marks */}
            <line x1="162" y1="222" x2="168" y2="228" stroke="#be123c" strokeWidth="1.5" />
            <line x1="168" y1="222" x2="174" y2="228" stroke="#be123c" strokeWidth="1.5" />
            <line x1="222" y1="222" x2="228" y2="228" stroke="#be123c" strokeWidth="1.5" />
            <line x1="228" y1="222" x2="234" y2="228" stroke="#be123c" strokeWidth="1.5" />
          </g>
        )}

        {/* Eyes (violet/grey-blue) */}
        <g stroke="#1e293b" strokeWidth="2.5" fill="none">
          {isShocked ? (
            <>
              <circle cx="178" cy="205" r="9" fill="#fff" />
              <circle cx="178" cy="205" r="4" fill="#312e81" />
              <circle cx="222" cy="205" r="9" fill="#fff" />
              <circle cx="222" cy="205" r="4" fill="#312e81" />
            </>
          ) : isSad ? (
            <>
              <path d="M 165,208 C 172,214 182,214 188,208" fill="none" strokeWidth="3" />
              <path d="M 212,208 C 218,214 228,214 235,208" fill="none" strokeWidth="3" />
            </>
          ) : (
            // Intellectual/Tsun determined gaze
            <>
              <path d="M 165,198 C 172,194 184,196 188,204" strokeWidth="3" />
              <ellipse cx="178" cy="206" rx="5" ry="7" fill="#312e81" />
              <circle cx="176" cy="204" r="2" fill="#fff" /> {/* Highlight */}
              
              <path d="M 235,198 C 228,194 216,196 212,204" strokeWidth="3" />
              <ellipse cx="222" cy="206" rx="5" ry="7" fill="#312e81" />
              <circle cx="220" cy="204" r="2" fill="#fff" />
            </>
          )}
        </g>

        {/* Eyebrows */}
        <g stroke="#451a03" strokeWidth="3" fill="none">
          {expression === "smug" ? (
            <>
              <path d="M 162,185 Q 175,175 188,188" />
              <path d="M 238,183 Q 225,178 212,185" />
            </>
          ) : isSad ? (
            <>
              <path d="M 162,192 Q 175,198 188,190" />
              <path d="M 238,192 Q 225,198 212,190" />
            </>
          ) : (
            <>
              <path d="M 162,188 Q 175,183 188,188" />
              <path d="M 238,188 Q 225,183 212,188" />
            </>
          )}
        </g>

        {/* Mouth */}
        <g stroke="#7c2d12" strokeWidth="2.5" fill="none">
          {expression === "smug" ? (
            <path d="M 185,245 Q 195,240 210,248" strokeWidth="3" />
          ) : expression === "laugh" ? (
            <path d="M 185,242 Q 200,260 215,242 Z" fill="#f43f5e" />
          ) : isBlush ? (
            // Small embarrassed wiggly line
            <path d="M 190,245 Q 200,249 210,244" />
          ) : (
            <path d="M 188,245 Q 200,242 212,245" />
          )}
        </g>

        {/* --- KURISU HAIR - FRONT SHAPING (Elegant sweeping bangs framing the face) --- */}
        {/* Main Hair Cap and Top spikes */}
        <path d="M 135,160 C 130,100 160,80 200,80 C 240,80 270,100 265,160 C 280,120 260,95 240,90 Q 200,70 160,90 C 140,95 120,120 135,160 Z" fill="url(#kurisuHair)" />
        
        {/* Forehead Bangs framing the face in Kurisu's 'M' shape */}
        <path d="M 135,150 Q 170,125 190,165 L 195,150 Q 200,160 210,165 Q 230,125 265,150 Q 255,180 248,190 L 244,170 Q 200,145 156,170 L 152,190 Q 145,180 135,150 Z" fill="url(#kurisuHair)" />
        
        {/* Dynamic sweeping front spikes */}
        <path d="M 175,135 L 188,175 L 192,150 L 200,185 L 208,150 L 212,175 L 225,135 Z" fill="#5c1d0a" />

        {/* Kurisu's long elegant side locks enclosing the cheeks and neck */}
        {/* Left Lock */}
        <path d="M 140,160 Q 148,220 156,290 Q 163,220 154,180 Z" fill="url(#kurisuHair)" />
        <path d="M 148,180 Q 155,240 165,310 Q 170,250 160,200 Z" fill="#5c1d0a" />
        
        {/* Right Lock */}
        <path d="M 260,160 Q 252,220 244,290 Q 237,220 246,180 Z" fill="url(#kurisuHair)" />
        <path d="M 252,180 Q 245,240 235,310 Q 230,250 240,200 Z" fill="#5c1d0a" />

        {/* Center fringe division */}
        <path d="M 194,120 L 200,160 L 206,120 Z" fill="#451a03" />

      </svg>
    );
  };

  const renderMayuri = () => {
    // Mayuri: Blue bucket hat, cute circular face, fluffy dark hair, green visual elements
    const isLaugh = expression === "laugh" || expression === "default";
    const isSad = expression === "sad";
    
    return (
      <svg viewBox="0 0 400 500" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
        <defs>
          <linearGradient id="mayuriDress" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="mayuriHat" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id="skinMayuri" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fffaf5" />
            <stop offset="100%" stopColor="#ffe9dc" />
          </linearGradient>
        </defs>

        {/* Ambient background ring glow */}
        <circle cx="200" cy="220" r="140" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8,4" className="opacity-20 animate-[spin_25s_linear_infinite]" />

        {/* Fluffy black-blue hair back */}
        <path d="M 120,200 C 90,260 90,340 120,380 L 280,380 C 310,340 310,260 280,200 Z" fill="#0c1a30" />

        {/* Dress / Body (Raised slightly to match shorter proportional neck) */}
        <path d="M 120,500 L 120,395 L 140,360 L 260,360 L 280,395 L 280,500 Z" fill="url(#mayuriDress)" />
        {/* Soft white collar */}
        <path d="M 170,360 C 170,390 230,390 230,360 Z" fill="#f8fafc" />

        {/* Neck (Shortened and tapered) */}
        <path d="M 183,365 L 187,230 L 213,230 L 217,365 Z" fill="url(#skinMayuri)" />

        {/* Head Base */}
        <path d="M 150,210 C 150,295 250,295 250,210 C 250,165 150,165 150,210 Z" fill="url(#skinMayuri)" />

        {/* Cute blushing cheeks - highly pronounced */}
        <ellipse cx="170" cy="235" rx="14" ry="7" fill="#fb7185" opacity="0.6" />
        <ellipse cx="230" cy="235" rx="14" ry="7" fill="#fb7185" opacity="0.6" />

        {/* Eyes (Round, green-blue, sparkle) */}
        <g stroke="#0f172a" strokeWidth="2" fill="none">
          {isSad ? (
            <>
              <path d="M 165,220 C 170,228 180,228 185,220" strokeWidth="3" />
              <path d="M 215,220 C 220,228 230,228 235,220" strokeWidth="3" />
            </>
          ) : isLaugh ? (
            // Smiling arched happy eyes
            <>
              <path d="M 162,216 Q 175,206 188,216" strokeWidth="4" strokeLinecap="round" />
              <path d="M 212,216 Q 225,206 238,216" strokeWidth="4" strokeLinecap="round" />
            </>
          ) : (
            // Big open curious eyes
            <>
              <circle cx="175" cy="218" r="8" fill="#1e293b" />
              <circle cx="173" cy="215" r="2.5" fill="#fff" />
              <circle cx="225" cy="218" r="8" fill="#1e293b" />
              <circle cx="223" cy="215" r="2.5" fill="#fff" />
            </>
          )}
        </g>

        {/* Circular soft eyebrows */}
        <path d="M 163,195 Q 175,188 185,195" stroke="#1e293b" strokeWidth="2" fill="none" />
        <path d="M 215,195 Q 225,188 237,195" stroke="#1e293b" strokeWidth="2" fill="none" />

        {/* Mouth */}
        {isSad ? (
          <path d="M 190,255 Q 200,248 210,255" stroke="#0f172a" strokeWidth="2.5" fill="none" />
        ) : (
          // Beautiful happy smile
          <path d="M 188,245 Q 200,265 212,245 Z" fill="#f43f5e" />
        )}

        {/* Hair Front Side Bangs */}
        <path d="M 148,190 Q 155,240 162,230 Z" fill="#0c1a30" />
        <path d="M 252,190 Q 245,240 238,230 Z" fill="#0c1a30" />

        {/* Light Blue Hat (Mayuri Signature Bucket Hat) */}
        <path d="M 135,175 C 135,115 265,115 265,175 Z" fill="url(#mayuriHat)" />
        {/* Hat Brims */}
        <path d="M 115,175 Q 200,165 285,175 L 295,190 Q 200,175 105,190 Z" fill="url(#mayuriHat)" stroke="#0284c7" strokeWidth="2" />
        {/* Bucket Hat Band ribbon */}
        <path d="M 134,171 Q 200,161 266,171 L 267,166 Q 200,156 133,166 Z" fill="#0284c7" />

      </svg>
    );
  };

  const renderDaru = () => {
    // Daru (Super Hacker): Yellow cap, round cyber sunglasses, smug chin beard
    return (
      <svg viewBox="0 0 400 500" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
        <defs>
          <linearGradient id="daruShirt" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id="daruCap" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
          <linearGradient id="skinDaru" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffeedd" />
            <stop offset="100%" stopColor="#f3be9b" />
          </linearGradient>
        </defs>

        {/* Ambient background ring glow */}
        <circle cx="200" cy="220" r="140" fill="none" stroke="#ca8a04" strokeWidth="2" strokeDasharray="3,6" className="opacity-20 animate-[spin_35s_linear_infinite]" />

        {/* Big Broad Shoulders (Adjusted position to match shorter neck) */}
        <path d="M 60,500 L 60,390 L 90,325 C 150,305 250,305 310,325 L 340,390 L 340,500 Z" fill="url(#daruShirt)" />

        {/* Broad Neck (Shortened and tapered) */}
        <path d="M 164,330 L 170,240 L 230,240 L 236,330 Z" fill="url(#skinDaru)" />

        {/* Fat friendly round Head */}
        <path d="M 130,210 C 130,310 270,310 270,210 C 270,160 130,160 130,210 Z" fill="url(#skinDaru)" />

        {/* Tech Glasses / Mirrored circular lenses */}
        <g fill="#1e293b" stroke="#ca8a04" strokeWidth="3">
          <circle cx="165" cy="200" r="20" fill="#2d3748" />
          <circle cx="160" cy="195" r="4" fill="#fff" opacity="0.8" />
          
          <circle cx="235" cy="200" r="20" fill="#2d3748" />
          <circle cx="230" cy="195" r="4" fill="#fff" opacity="0.8" />
          
          {/* Bridge */}
          <line x1="185" y1="200" x2="215" y2="200" stroke="#ca8a04" strokeWidth="4" />
        </g>

        {/* Smug Hack Beard */}
        <path d="M 180,285 Q 200,305 220,285 L 210,270 L 190,270 Z" fill="#451a03" />

        {/* Smile */}
        <path d="M 185,250 Q 200,260 215,250" stroke="#451a03" strokeWidth="3" fill="none" />

        {/* Hacker Cap (retro styled) to match Steins;Gate description */}
        <path d="M 125,180 C 125,110 275,110 275,180 Z" fill="url(#daruCap)" />
        {/* Cap Visor Shield */}
        <path d="M 100,180 L 300,180 L 280,200 L 120,200 Z" fill="#854d0e" />

      </svg>
    );
  };

  const isLeft = side === "left";

  return (
    <div
      id={`character_${name}_${side}`}
      className={`relative w-48 sm:w-64 h-72 sm:h-96 flex items-end justify-center transition-all duration-300 transform ${
        isLeft 
          ? "animate-[slideInLeft_0.4s_ease-out_forwards]" 
          : "animate-[slideInRight_0.4s_ease-out_forwards]"
      } ${className}`}
    >
      {name === "okabe" && renderOkabe()}
      {name === "kurisu" && renderKurisu()}
      {name === "mayuri" && renderMayuri()}
      {name === "daru" && renderDaru()}
    </div>
  );
}
