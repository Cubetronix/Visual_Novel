/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import MainMenu from "./components/MainMenu";
import NovelScreen from "./components/NovelScreen";
import SaveLoadModal from "./components/SaveLoadModal";
import { gameAudio } from "./components/AudioEngine";
import { INITIAL_ACHIEVEMENTS } from "./data/story";
import { Award, Zap } from "lucide-react";

export default function App() {
  const [screen, setScreen] = useState<"menu" | "novel">("menu");
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [startNodeId, setStartNodeId] = useState<string>("start");
  const [startDivergence, setStartDivergence] = useState<number>(1.130205);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showLoadModal, setShowLoadModal] = useState<boolean>(false);
  
  // Custom Achievement Pop-up Toast State
  const [activeToast, setActiveToast] = useState<{ title: string; desc: string } | null>(null);

  // Load preferences and achievements on boot
  useEffect(() => {
    const savedAch = localStorage.getItem("steins_gate_ach_v1");
    if (savedAch) {
      try {
        setUnlockedAchievements(JSON.parse(savedAch));
      } catch (e) {
        console.error("Failed to parse achievements");
      }
    }

    const savedMute = localStorage.getItem("steins_gate_mute_v1");
    if (savedMute) {
      const parsedMute = savedMute === "true";
      setIsMuted(parsedMute);
      gameAudio.setMute(parsedMute);
    }
  }, []);

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    gameAudio.setMute(nextMute);
    localStorage.setItem("steins_gate_mute_v1", nextMute ? "true" : "false");
  };

  const handleUnlockAchievement = (id: string) => {
    setUnlockedAchievements(prev => {
      if (prev.includes(id)) return prev;

      const updated = [...prev, id];
      localStorage.setItem("steins_gate_ach_v1", JSON.stringify(updated));

      // Retrieve achievement details
      const found = INITIAL_ACHIEVEMENTS.find(ach => ach.id === id);
      if (found) {
        // Unlocked alert chime tutturu!
        gameAudio.playSfx("tutturu_vo");
        
        // Trigger toast slide-in overlay (safely trigger without blocks)
        setTimeout(() => {
          setActiveToast({ title: found.title, desc: found.description });
        }, 50);
        
        // Auto fade-out after 4 seconds
        setTimeout(() => {
          setActiveToast(null);
        }, 4000);
      }

      return updated;
    });
  };

  const handleStartNewGame = () => {
    setStartNodeId("start");
    setStartDivergence(1.130205);
    setScreen("novel");
  };

  const handleLoadSlotDirect = (nodeId: string, divergence: number, unlocked: string[]) => {
    // Sync any loaded achievements
    unlocked.forEach(id => {
      handleUnlockAchievement(id);
    });
    setStartNodeId(nodeId);
    setStartDivergence(divergence);
    setScreen("novel");
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0a0a0c] text-[#e0e0e0] font-sans overflow-x-hidden">
      
      {/* Scanline CRT Overlay from Artistic Flair Theme */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-50 opacity-[0.35]" />

      {/* Visual background atmospheric noise map */}
      <div className="absolute inset-0 bg-noise opacity-[0.015] pointer-events-none z-50" />

      {/* --- RENDER ACTIVE SCREEN --- */}
      {screen === "menu" ? (
        <MainMenu
          unlockedAchievements={unlockedAchievements}
          onStartGame={handleStartNewGame}
          onOpenLoadModal={() => setShowLoadModal(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      ) : (
        <NovelScreen
          initialNodeId={startNodeId}
          initialDivergence={startDivergence}
          unlockedAchievements={unlockedAchievements}
          onUnlockAchievement={handleUnlockAchievement}
          onExitToMenu={() => {
            gameAudio.stopBgm();
            setScreen("menu");
          }}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* --- MENU-ONLY LOAD MODAL TRIGGERED SYSTEM --- */}
      {showLoadModal && (
        <SaveLoadModal
          mode="load"
          currentNodeId="start"
          currentDivergence={0.571024}
          currentSummaryText="Menu Utama"
          unlockedAchievements={unlockedAchievements}
          onClose={() => setShowLoadModal(false)}
          onLoadSlot={handleLoadSlotDirect}
        />
      )}

      {/* --- DYNAMIC FLOATING ACHIEVEMENT TOAST NOTIFICATION --- */}
      {activeToast && (
        <div 
          id="achievement_popup_toast"
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3.5 bg-black/95 border-2 border-[#00ff41] p-4 rounded shadow-2xl max-w-sm w-[90%] sm:w-auto animate-[fadeInDown_0.4s_ease-out_forwards]"
          style={{ boxShadow: "0 0 25px rgba(0, 255, 65, 0.45)" }}
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black flex items-center justify-center border border-[#00ff41]/40 animate-pulse">
            <Zap className="w-5 h-5 text-[#00ff41]" fill="currentColor" />
          </div>
          <div className="flex-col text-left font-sans">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#00ff41]/60">
              MILESTONE TAKDIR DIDAPAT
            </span>
            <h4 className="text-xs font-bold text-white leading-tight font-mono mt-0.5">
              {activeToast.title}
            </h4>
            <p className="text-[10px] text-stone-300 font-medium leading-relaxed mt-0.5 line-clamp-1">
              {activeToast.desc}
            </p>
          </div>
        </div>
      )}

      {/* GLOBAL KEY ANIMATION CSS STYLES INJECTIONS */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .blink {
          animation: textBlink 1.2s step-end infinite;
        }
        @keyframes textBlink {
          50% { opacity: 0.4; }
        }
      `}</style>

    </div>
  );
}
