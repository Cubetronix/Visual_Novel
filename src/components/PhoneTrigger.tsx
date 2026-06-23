/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Phone, Mail, X, CornerDownLeft, ArrowLeft, Send } from "lucide-react";
import { PhoneTriggerData, DMailOption, Choice } from "../types";
import { gameAudio } from "./AudioEngine";

interface PhoneTriggerProps {
  triggerData?: PhoneTriggerData;
  onSendDMail: (dmail: DMailOption) => void;
  onClose: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  phoneChoices?: Choice[];
  onSelectChoice?: (choice: Choice) => void;
}

export default function PhoneTrigger({
  triggerData,
  onSendDMail,
  onClose,
  isOpen,
  onToggleOpen,
  phoneChoices,
  onSelectChoice
}: PhoneTriggerProps) {
  const [activeTab, setActiveTab] = useState<"desktop" | "contacts" | "inbox" | "dmail_draft" | "sent">("desktop");
  const [selectedMail, setSelectedMail] = useState<DMailOption | null>(null);
  const [dialNumber, setDialNumber] = useState<string>("");

  useEffect(() => {
    // If phone rings or opens, play a quick beep
    if (isOpen) {
      gameAudio.playSfx("beep");
    }
  }, [isOpen]);

  const handleKeypadPress = (key: string) => {
    gameAudio.playSfx("click");
    if (dialNumber.length < 10) {
      setDialNumber(prev => prev + key);
    }
  };

  const clearDialNumber = () => {
    gameAudio.playSfx("click");
    setDialNumber("");
  };

  const handleSendDMailClick = (dmail: DMailOption) => {
    gameAudio.playSfx("laser");
    onSendDMail(dmail);
    setActiveTab("desktop");
    setSelectedMail(null);
  };

  if (!isOpen) {
    return (
      <button
        id="phone_trigger_button"
        onClick={onToggleOpen}
        className="fixed top-1/2 -translate-y-1/2 right-3 sm:right-6 z-40 flex flex-col items-center justify-center gap-2 p-2.5 sm:px-4 sm:py-3.5 bg-red-950/90 hover:bg-red-900/90 text-white font-mono text-[9px] sm:text-xs font-bold rounded-sm shadow-[0_0_20px_rgba(239,68,68,0.4)] border-2 border-red-800/80 hover:border-red-500 animate-pulse transition-all duration-200 cursor-pointer w-11 sm:w-auto"
      >
        <span className="relative flex h-2 w-2 bg-red-500 rounded-full">
          {triggerData && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          )}
        </span>
        <Phone className="w-4 h-4 text-red-500 shrink-0" />
        <span className="hidden sm:inline">
          {triggerData ? "BUKA HP (D-MAIL AKTIF!)" : "BUKA HP"}
        </span>
        <span className="sm:hidden text-[7px] leading-none text-center tracking-tighter uppercase font-bold flex flex-col items-center">
          {triggerData ? (
            <>
              <span>D-MAIL</span>
              <span className="text-red-400 font-extrabold mt-0.5 animate-bounce">AKTIF</span>
            </>
          ) : (
            <>
              <span>BUKA</span>
              <span className="font-extrabold mt-0.5">HP</span>
            </>
          )}
        </span>
      </button>
    );
  }

  return (
    <div 
      id="phone_flip_overlay"
      className="fixed inset-0 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-96 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300"
    >
      <div 
        id="phone_hardware"
        className="relative w-80 h-[580px] bg-[#0c0505] border-[3px] border-[#ff3b30]/65 rounded-md shadow-[0_0_35px_rgba(255,59,48,0.25)] p-4 flex flex-col justify-between"
      >
        {/* Flip-phone hinges top visual */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-20 h-4 bg-red-950 rounded-b-md border-x border-b border-red-900 z-10" />

        {/* --- PHONE SCREEN (CRT style interface) --- */}
        <div className="relative w-full h-[260px] bg-black border-2 border-[#00ff41]/40 rounded-sm overflow-hidden p-2 flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/10 via-transparent to-stone-900/20 pointer-events-none z-10" />
          
          {/* Scanline effects */}
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,255,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none z-10" />

          {/* Status bar */}
          <div className="flex justify-between items-center pb-1 border-b border-[#00ff41]/20 font-mono text-[9px] text-[#00ff41]/60 select-none">
            <span>TERMINAL OS v1.0</span>
            <span className="flex items-center gap-1">
              {triggerData && <span className="animate-bounce mr-1 text-[#ff6b00]">📩</span>}
              <span className="text-[10px]">📶 TRG</span>
              <span>🔋 100%</span>
            </span>
          </div>

          {/* Screen Content */}
          <div className="flex-1 mt-2 font-mono text-[#00ff41] text-xs flex flex-col overflow-y-auto">
            
            {activeTab === "desktop" && (
              <div className="flex-1 flex flex-col justify-between py-1">
                {/* Laboratory Wallpaper */}
                <div className="text-center py-2 border border-[#00ff41]/20 bg-[#00ff41]/5 rounded-sm">
                  <div className="font-bold text-[9px] tracking-wider text-[#00ff41]/60">FUTURE GADGET LAB</div>
                  <div className="text-[13px] font-bold text-white mt-1">D-Mail Terminal OS</div>
                </div>

                {/* SPECIAL STEINS GATE PHONE REQUIRED CHOICES DIRECT INTERACTIVE TRIGGER */}
                {phoneChoices && phoneChoices.length > 0 && (
                  <div className="my-1.5 p-1.5 border border-red-500 bg-red-950/40 rounded-sm animate-pulse flex flex-col gap-1 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                    <div className="flex items-center gap-1 text-red-500 font-mono text-[8px] font-bold uppercase">
                      <span className="relative flex h-1.5 w-1.5 bg-red-500 rounded-full">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      </span>
                      <span>ALUR TAKDIR TERDETEKSI</span>
                    </div>
                    {phoneChoices.map((choice, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          gameAudio.playSfx("laser");
                          if (onSelectChoice) {
                            onSelectChoice(choice);
                          }
                        }}
                        className="w-full text-center py-1 bg-red-800 hover:bg-red-700 border border-red-500 text-white rounded-sm font-sans text-[8px] font-extrabold cursor-pointer transition-all uppercase"
                      >
                        ⚡ {choice.text.replace("[HP PRESTIGE] ", "")}
                      </button>
                    ))}
                  </div>
                )}

                {dialNumber ? (
                  <div className="text-right pr-2 text-md font-bold py-1 border-b border-[#00ff41]/20 text-white">
                    {dialNumber}
                  </div>
                ) : (
                  <div className="text-[10px] text-[#00ff41]/40 text-center italic">
                    {triggerData ? "⚠️ Ada 1 D-Mail penting siap dikirim!" : "Sistem Utama Siaga"}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-1.5 mt-2">
                  <button
                    onClick={() => { gameAudio.playSfx("click"); setActiveTab("inbox"); }}
                    className="flex flex-col items-center justify-center p-2 bg-black hover:bg-[#00ff41]/10 border border-[#00ff41]/30 rounded-sm text-[10px] cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-[#00ff41]/80 mb-0.5" />
                    <span>Kotak Masuk {triggerData ? "(1)" : ""}</span>
                  </button>
                  <button
                    onClick={() => {
                      gameAudio.playSfx("click");
                      if (triggerData && triggerData.availableDMails.length > 0) {
                        setSelectedMail(triggerData.availableDMails[0]);
                        setActiveTab("dmail_draft");
                      } else {
                        setActiveTab("contacts");
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-2 border rounded-sm text-[10px] cursor-pointer ${
                      triggerData 
                        ? "bg-red-950/40 hover:bg-red-900/60 border-red-800 text-red-300 animate-pulse" 
                        : "bg-black hover:bg-[#00ff41]/10 border-[#00ff41]/30"
                    }`}
                  >
                    <Send className="w-4 h-4 mb-0.5" />
                    <span>Compose D-Mail</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === "contacts" && (
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-1 border-b border-[#00ff41]/20 pb-1 mb-2">
                  <button 
                    onClick={() => { gameAudio.playSfx("click"); setActiveTab("desktop"); }}
                    className="text-[#00ff41] font-bold hover:text-white text-[10px]"
                  >
                    ◀ BACK
                  </button>
                  <span className="text-[10px] font-bold uppercase ml-2 text-stone-300">Kontak Terdaftar</span>
                </div>
                <div className="flex-1 flex flex-col gap-1 text-[10px]">
                  <div className="p-1 px-2 hover:bg-[#00ff41]/10 border border-transparent hover:border-[#00ff41]/20 rounded-sm flex justify-between items-center cursor-pointer">
                    <span>Lab Member 002: Mayuri</span>
                    <span className="text-[#00ff41]/60">Call OK</span>
                  </div>
                  <div className="p-1 px-2 hover:bg-[#00ff41]/10 border border-transparent hover:border-[#00ff41]/20 rounded-sm flex justify-between items-center cursor-pointer">
                    <span>Lab Member 003: Daru</span>
                    <span className="text-[#00ff41]/60">Hack OK</span>
                  </div>
                  <div className="p-1 px-2 hover:bg-[#00ff41]/10 border border-transparent hover:border-[#00ff41]/20 rounded-sm flex justify-between items-center cursor-pointer">
                    <span>Lab Member 004: Kurisu</span>
                    <span className="text-[#00ff41]/60">Tsun OK</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "inbox" && (
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-1 border-b border-[#00ff41]/20 pb-1 mb-2">
                  <button 
                    onClick={() => { gameAudio.playSfx("click"); setActiveTab("desktop"); }}
                    className="text-[#00ff41] font-bold hover:text-white text-[10px]"
                  >
                    ◀ BACK
                  </button>
                  <span className="text-[10px] font-bold uppercase ml-2 text-stone-300">Kotak Masuk (D-Mail)</span>
                </div>
                
                {triggerData ? (
                  <div className="flex-1 flex flex-col gap-2">
                    <div 
                      onClick={() => { gameAudio.playSfx("click"); setSelectedMail(triggerData.availableDMails[0]); setActiveTab("dmail_draft"); }}
                      className="p-2 bg-red-950/20 border border-red-900/40 rounded-sm cursor-pointer animate-pulse"
                    >
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="font-bold text-red-400">Operator: DARU</span>
                        <span className="text-[8px] text-red-500 bg-red-950/40 px-1 rounded">BARU</span>
                      </div>
                      <div className="text-[10px] font-bold mt-1 text-[#ff6b00]">SUBJ: {triggerData.availableDMails[0].subject}</div>
                      <p className="text-[9px] text-[#00ff41]/80 mt-0.5 truncate">{triggerData.availableDMails[0].body}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#00ff41]/40 text-[10px] italic">
                    Tidak ada D-Mail aktif saat ini.
                  </div>
                )}
              </div>
            )}

            {activeTab === "dmail_draft" && selectedMail && (
              <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between border-b border-[#00ff41]/20 pb-1 mb-2 text-[10px]">
                    <button 
                      onClick={() => { gameAudio.playSfx("click"); setActiveTab("inbox"); }}
                      className="text-[#00ff41] font-bold"
                    >
                      ◀ BATAL
                    </button>
                    <span className="font-bold text-red-500">D-MAIL READY!</span>
                  </div>
                  
                  <div className="text-[10px] gap-1 flex flex-col bg-black p-2 border border-[#00ff41]/20 rounded-sm">
                    <div><span className="text-[#00ff41]/60">KEPADA: </span> {selectedMail.destination}</div>
                    <div><span className="text-[#00ff41]/60">SUBYEK: </span> {selectedMail.subject}</div>
                    <div className="border-t border-[#00ff41]/10 my-1 pt-1 font-bold text-white text-[10.5px] leading-relaxed">
                      {selectedMail.body}
                    </div>
                    <div className="text-[8px] text-[#ff6b00] italic mt-1 font-sans">
                      Impact Divergence: {selectedMail.impactDivergence > 0 ? "+" : ""}{selectedMail.impactDivergence} (SERN Bypass)
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSendDMailClick(selectedMail)}
                  className="w-full py-2 bg-red-950/60 hover:bg-red-900/60 active:bg-red-950 border border-red-500 rounded-sm text-white font-bold text-xs uppercase cursor-pointer tracking-widest text-center shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                >
                  📡 TRANSMIT D-MAIL
                </button>
              </div>
            )}

          </div>

          {/* Interactive footer details */}
          <div className="absolute bottom-1 right-2 font-mono text-[8px] text-[#00ff41]/30 uppercase select-none">
            El_Psy_Kongroo
          </div>
        </div>

        {/* --- PHYSICAL KEYPAD --- */}
        <div className="bg-black/90 rounded-sm p-3 border border-stone-900 grid grid-cols-3 gap-2 flex-1 mt-3 justify-items-center">
          
          {/* Row 1 */}
          <button onClick={() => handleKeypadPress("1")} className="w-11 h-8 bg-black hover:bg-stone-950 active:bg-stone-900 text-stone-400 hover:text-white font-mono text-sm border border-stone-800 hover:border-[#00ff41]/20 rounded-sm shadow-sm transition cursor-pointer">1</button>
          <button onClick={() => handleKeypadPress("2")} className="w-11 h-8 bg-black hover:bg-stone-950 active:bg-stone-900 text-stone-400 hover:text-white font-mono text-sm border border-stone-800 hover:border-[#00ff41]/20 rounded-sm shadow-sm transition cursor-pointer">2</button>
          <button onClick={() => handleKeypadPress("3")} className="w-11 h-8 bg-black hover:bg-stone-950 active:bg-stone-900 text-stone-400 hover:text-white font-mono text-sm border border-stone-800 hover:border-[#00ff41]/20 rounded-sm shadow-sm transition cursor-pointer">3</button>
          
          {/* Row 2 */}
          <button onClick={() => handleKeypadPress("4")} className="w-11 h-8 bg-black hover:bg-stone-950 active:bg-stone-900 text-stone-400 hover:text-white font-mono text-sm border border-stone-800 hover:border-[#00ff41]/20 rounded-sm shadow-sm transition cursor-pointer">4</button>
          <button onClick={() => handleKeypadPress("5")} className="w-11 h-8 bg-black hover:bg-stone-950 active:bg-stone-900 text-stone-400 hover:text-white font-mono text-sm border border-stone-800 hover:border-[#00ff41]/20 rounded-sm shadow-sm transition cursor-pointer">5</button>
          <button onClick={() => handleKeypadPress("6")} className="w-11 h-8 bg-black hover:bg-stone-950 active:bg-stone-900 text-stone-400 hover:text-white font-mono text-sm border border-stone-800 hover:border-[#00ff41]/20 rounded-sm shadow-sm transition cursor-pointer">6</button>

          {/* Row 3 */}
          <button onClick={() => handleKeypadPress("7")} className="w-11 h-8 bg-black hover:bg-stone-950 active:bg-stone-900 text-stone-400 hover:text-white font-mono text-sm border border-stone-800 hover:border-[#00ff41]/20 rounded-sm shadow-sm transition cursor-pointer">7</button>
          <button onClick={() => handleKeypadPress("8")} className="w-11 h-8 bg-black hover:bg-stone-950 active:bg-stone-900 text-stone-400 hover:text-white font-mono text-sm border border-stone-800 hover:border-[#00ff41]/20 rounded-sm shadow-sm transition cursor-pointer">8</button>
          <button onClick={() => handleKeypadPress("9")} className="w-11 h-8 bg-black hover:bg-stone-950 active:bg-stone-900 text-stone-400 hover:text-white font-mono text-sm border border-stone-800 hover:border-[#00ff41]/20 rounded-sm shadow-sm transition cursor-pointer">9</button>

          {/* Row 4 */}
          <button onClick={() => handleKeypadPress("*")} className="w-11 h-8 bg-black hover:bg-stone-950 active:bg-stone-900 text-stone-400 hover:text-white font-mono text-sm border border-stone-800 hover:border-[#00ff41]/20 rounded-sm shadow-sm transition cursor-pointer">*</button>
          <button onClick={() => handleKeypadPress("0")} className="w-11 h-8 bg-black hover:bg-stone-950 active:bg-stone-900 text-stone-400 hover:text-white font-mono text-sm border border-stone-800 hover:border-[#00ff41]/20 rounded-sm shadow-sm transition cursor-pointer">0</button>
          <button onClick={() => handleKeypadPress("#")} className="w-11 h-8 bg-black hover:bg-stone-950 active:bg-stone-900 text-stone-400 hover:text-white font-mono text-sm border border-stone-800 hover:border-[#00ff41]/20 rounded-sm shadow-sm transition cursor-pointer">#</button>

          {/* Utility Row */}
          <button 
            onClick={clearDialNumber} 
            className="col-span-2 w-full h-8 bg-black hover:bg-stone-950 text-red-500 hover:text-red-400 font-mono text-[9px] font-bold border border-stone-800 hover:border-red-800/40 rounded-sm shadow-sm cursor-pointer"
          >
            CLEAR DIAL
          </button>
          <button 
            onClick={() => { gameAudio.playSfx("click"); onClose(); }} 
            className="w-11 h-8 bg-black hover:bg-red-950/50 text-red-500 hover:text-[#ff3b30] font-mono text-xs rounded-sm border border-stone-800 hover:border-red-900/60 cursor-pointer flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Brand footer */}
        <div className="text-center text-[9px] font-mono tracking-widest text-stone-700 uppercase mt-2">
          Model G-300 FLIP // SG_OS
        </div>
      </div>
    </div>
  );
}
