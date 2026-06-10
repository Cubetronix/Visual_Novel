/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { X, Save, FolderOpen, Calendar, Compass } from "lucide-react";
import { SaveSlot } from "../types";
import { gameAudio } from "./AudioEngine";

interface SaveLoadModalProps {
  mode: "save" | "load";
  currentNodeId: string;
  currentDivergence: number;
  currentSummaryText: string;
  unlockedAchievements: string[];
  onClose: () => void;
  onLoadSlot: (nodeId: string, divergence: number, unlocked: string[]) => void;
}

export default function SaveLoadModal({
  mode,
  currentNodeId,
  currentDivergence,
  currentSummaryText,
  unlockedAchievements,
  onClose,
  onLoadSlot
}: SaveLoadModalProps) {
  const [slots, setSlots] = useState<SaveSlot[]>([]);

  // Load slots from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("steins_gate_slots");
    if (saved) {
      try {
        setSlots(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse save slots", e);
      }
    } else {
      // Initialize 6 empty slots
      const initialSlots: SaveSlot[] = Array.from({ length: 6 }, (_, idx) => ({
        id: idx + 1,
        dateTime: "",
        nodeId: "",
        divergence: 0,
        summaryText: "KOSONG / EMPTY SLOT",
        activeAchievements: []
      }));
      setSlots(initialSlots);
      localStorage.setItem("steins_gate_slots", JSON.stringify(initialSlots));
    }
  }, []);

  const handleSlotAction = (slotId: number) => {
    gameAudio.playSfx("click");
    
    if (mode === "save") {
      const now = new Date();
      const updatedSlots = slots.map(slot => {
        if (slot.id === slotId) {
          return {
            id: slotId,
            dateTime: now.toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
            nodeId: currentNodeId,
            divergence: currentDivergence,
            summaryText: currentSummaryText.length > 55 ? currentSummaryText.substring(0, 55) + "..." : currentSummaryText,
            activeAchievements: unlockedAchievements
          };
        }
        return slot;
      });
      setSlots(updatedSlots);
      localStorage.setItem("steins_gate_slots", JSON.stringify(updatedSlots));
      gameAudio.playSfx("beep");
    } else {
      const selectedSlot = slots.find(s => s.id === slotId);
      if (selectedSlot && selectedSlot.nodeId) {
        onLoadSlot(selectedSlot.nodeId, selectedSlot.divergence, selectedSlot.activeAchievements);
        gameAudio.playSfx("steiner"); // time leap leap sound effect on load!
        onClose();
      } else {
        gameAudio.playSfx("fail");
      }
    }
  };

  const handleClearSlot = (e: React.MouseEvent, slotId: number) => {
    e.stopPropagation();
    gameAudio.playSfx("click");
    const updatedSlots = slots.map(slot => {
      if (slot.id === slotId) {
        return {
          id: slotId,
          dateTime: "",
          nodeId: "",
          divergence: 0,
          summaryText: "KOSONG / EMPTY SLOT",
          activeAchievements: []
        };
      }
      return slot;
    });
    setSlots(updatedSlots);
    localStorage.setItem("steins_gate_slots", JSON.stringify(updatedSlots));
  };

  const titleText = mode === "save" ? "SIMPAN REALITAS (SAVE GAME)" : "LOMPAT GARIS WAKTU (LOAD GAME)";

  return (
    <div 
      id="save_load_modal_overlay"
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div 
        id="save_load_modal_container"
        className="w-full max-w-2xl bg-[#0a0a0c] border border-[#00ff41]/30 rounded-sm overflow-hidden shadow-[0_0_35px_rgba(0,255,65,0.15)] flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center bg-black px-6 py-4 border-b border-[#00ff41]/20 font-mono">
          <div className="flex items-center gap-2 text-[#00ff41]">
            {mode === "save" ? <Save className="w-5 h-5 animate-pulse" /> : <FolderOpen className="w-5 h-5" />}
            <span className="text-sm font-bold tracking-wider">{titleText}</span>
          </div>
          <button 
            onClick={() => { gameAudio.playSfx("click"); onClose(); }} 
            className="text-stone-400 hover:text-[#00ff41] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-[#0a0a0c] via-black to-[#050508]">
          <p className="text-[10px] font-mono text-[#00ff41]/60 uppercase tracking-widest pl-1">
            {mode === "save" 
              ? "PILIH SLOT MEMORI UNTUK MENYIMPAN TITIK KOORDINAT TAKDIR SAAT INI:" 
              : "PILIH MEMORI UNTUK MELAKUKAN TIME LEAP DAN MENGUBAH ALUR TAKDIR:"
            }
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {slots.map(slot => {
              const isEmpty = !slot.nodeId;
              return (
                <div
                  key={slot.id}
                  onClick={() => handleSlotAction(slot.id)}
                  className={`group relative p-4 rounded-sm border text-left transition duration-200 cursor-pointer ${
                    isEmpty
                      ? "border-neutral-900 bg-black/40 hover:border-[#00ff41]/10"
                      : "border-[#00ff41]/20 bg-black hover:border-[#00ff41] hover:bg-black/90 shadow-[0_0_10px_rgba(0,255,65,0.02)]"
                  }`}
                >
                  {/* Slot Number Label */}
                  <span className="absolute top-2 right-3 text-[10px] font-mono font-bold text-stone-600 group-hover:text-[#00ff41]/60">
                    SLOT 0{slot.id}
                  </span>

                  <div className="flex flex-col h-full justify-between gap-2.5">
                    <div>
                      {/* Divergence Tag */}
                      {!isEmpty && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-black border border-[#ff6b00]/30 text-[9px] font-mono text-[#ff6b00] mb-1.5 shadow-[0_0_8px_rgba(255,107,0,0.05)]">
                          <Compass className="w-3 h-3" />
                          <span>Divergence: {slot.divergence.toFixed(6)}%</span>
                        </div>
                      )}

                      {/* Text Preview Description */}
                      <p className={`text-xs font-sans font-medium line-clamp-2 ${
                        isEmpty ? "text-stone-700 italic uppercase font-mono text-[10px]" : "text-stone-300 group-hover:text-stone-100"
                      }`}>
                        {slot.summaryText}
                      </p>
                    </div>

                    {/* Metadata indicators */}
                    <div className="flex justify-between items-center text-[10px] font-mono text-stone-500 pt-2 border-t border-stone-900">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#00ff41]/40" strokeWidth={2.5} />
                        {slot.dateTime || "KOSONG"}
                      </span>
                      
                      {!isEmpty && (
                        <button
                          onClick={(e) => handleClearSlot(e, slot.id)}
                          className="px-2 py-0.5 bg-black hover:bg-red-950 text-red-500 hover:text-red-400 rounded-sm border border-red-950 hover:border-red-600 transition text-[9px]"
                        >
                          RESET
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Info Footer */}
        <div className="bg-black px-6 py-3 border-t border-[#00ff41]/10 text-center font-mono text-[9px] text-stone-500">
          PROSES ENKRIPSI KUANTUM DAPAT BERJALAN AMAN MELALUI MEDIA LOCAL STORAGE BROWSER.
        </div>
      </div>
    </div>
  );
}
