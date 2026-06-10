/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Save, FolderOpen, RotateCcw, Volume2, VolumeX, Menu, ChevronRight, 
  FastForward, Play, Pause, FileText, X, Sparkles, Phone, HelpCircle, ShieldAlert 
} from "lucide-react";
import { StoryNode, Choice, DMailOption, GameState } from "../types";
import { storyData } from "../data/story";
import { gameAudio } from "./AudioEngine";
import DivergenceMeter from "./DivergenceMeter";
import CharacterAsset from "./CharacterAsset";
import PhoneTrigger from "./PhoneTrigger";
import SaveLoadModal from "./SaveLoadModal";

interface NovelScreenProps {
  initialNodeId: string;
  initialDivergence: number;
  unlockedAchievements: string[];
  onUnlockAchievement: (id: string) => void;
  onExitToMenu: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export default function NovelScreen({
  initialNodeId,
  initialDivergence,
  unlockedAchievements,
  onUnlockAchievement,
  onExitToMenu,
  isMuted,
  onToggleMute
}: NovelScreenProps) {
  // Game states
  const [currentNodeId, setCurrentNodeId] = useState<string>(initialNodeId);
  const [divergence, setDivergence] = useState<number>(initialDivergence);
  
  // Script and text typing states
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);
  
  // Custom interface toggles
  const [phoneOpen, setPhoneOpen] = useState<boolean>(false);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [isSkipMode, setIsSkipMode] = useState<boolean>(false);
  const [showLogDrawer, setShowLogDrawer] = useState<boolean>(false);
  const [saveLoadMode, setSaveLoadMode] = useState<"save" | "load" | "none">("none");
  const [textLog, setTextLog] = useState<{ speaker: string; text: string }[]>([]);

  // Refs for typing timers
  const typingTimerRef = useRef<any>(null);
  const autoPlayTimerRef = useRef<any>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const currentNode: StoryNode = storyData[currentNodeId] || storyData["start"];

  // --- TYPING TEXT ANIMATION ---
  useEffect(() => {
    if (!currentNode) return;

    // Reset typing process
    setIsTypingComplete(false);
    setDisplayedText("");
    
    // Auto-update log history
    setTextLog(prev => {
      const exists = prev.some(l => l.text === currentNode.text && l.speaker === currentNode.speaker);
      if (exists) return prev;
      return [...prev, { speaker: currentNode.speaker, text: currentNode.text }];
    });

    // Check for achievement unlock trigger
    if (currentNode.achievementToUnlock) {
      onUnlockAchievement(currentNode.achievementToUnlock);
    }

    // Check for BGM transition effects
    if (currentNode.bgmEffect && currentNode.bgmEffect !== "none") {
      gameAudio.playBgm(currentNode.bgmEffect === "tutturu" ? "ambient" : currentNode.bgmEffect);
    }

    // Check for SFX sound triggers
    if (currentNode.sfxEffect) {
      gameAudio.playSfx(currentNode.sfxEffect);
    }

    // Adjust divergence instantly if specified in the storyline node
    if (currentNode.divergence !== undefined && currentNode.divergence !== divergence) {
      setDivergence(currentNode.divergence);
    }

    let charIndex = 0;
    const textTarget = currentNode.text;

    if (isSkipMode) {
      // Instant display in skip mode
      setDisplayedText(textTarget);
      setIsTypingComplete(true);
      return;
    }

    // Standard character-by-character typing interval
    const speed = 22; // ms per letters
    typingTimerRef.current = setInterval(() => {
      setDisplayedText(prev => prev + textTarget.charAt(charIndex));
      charIndex++;

      if (charIndex >= textTarget.length) {
        clearInterval(typingTimerRef.current);
        setIsTypingComplete(true);
      }
    }, speed);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [currentNodeId, isSkipMode]);

  // --- AUTO-PLAY / SKIP SYSTEM CONTROLLER ---
  useEffect(() => {
    if (isTypingComplete && isAutoPlay && !currentNode.choices && !currentNode.phoneTrigger) {
      // Wait for 2.2 seconds then advance
      autoPlayTimerRef.current = setTimeout(() => {
        handleNextClick();
      }, 2200);
    }

    if (isTypingComplete && isSkipMode && !currentNode.choices && !currentNode.phoneTrigger) {
      // Move immediately in skip mode
      autoPlayTimerRef.current = setTimeout(() => {
        handleNextClick();
      }, 100);
    }

    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isTypingComplete, isAutoPlay, isSkipMode, currentNodeId]);

  // Scroll backlog logs to bottom on changes
  useEffect(() => {
    if (showLogDrawer && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showLogDrawer, textLog]);

  // --- HANDLERS ---
  const handleNextClick = () => {
    if (!isTypingComplete) {
      // Fast-forward typing to the end
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      setDisplayedText(currentNode.text);
      setIsTypingComplete(true);
      gameAudio.playSfx("click");
      return;
    }

    // Do not allow automatic progression if player must make an integrated choice
    if (currentNode.choices && currentNode.choices.length > 0) return;
    if (currentNode.phoneTrigger) return;

    if (currentNode.next) {
      gameAudio.playSfx("click");
      setCurrentNodeId(currentNode.next);
    }
  };

  const handleChoiceSelect = (choice: Choice) => {
    gameAudio.playSfx("click");
    setIsSkipMode(false); // turn off skip on choices
    
    if (choice.achievementId) {
      onUnlockAchievement(choice.achievementId);
    }

    if (choice.divergenceChange) {
      setDivergence(prev => prev + choice.divergenceChange!);
    }

    setCurrentNodeId(choice.nextNodeId);
  };

  const handleDMailTransmitted = (dmail: DMailOption) => {
    setIsSkipMode(false);
    setPhoneOpen(false);
    
    // Shift the divergence
    setDivergence(prev => prev + dmail.impactDivergence);
    
    // Progress node
    setCurrentNodeId(dmail.nextNodeId);
  };

  const handleLoadSlotAction = (nodeId: string, savedDivergence: number, unlocked: string[]) => {
    setIsSkipMode(false);
    setIsAutoPlay(false);
    setCurrentNodeId(nodeId);
    setDivergence(savedDivergence);
    // Sync Achievements
    unlocked.forEach(id => onUnlockAchievement(id));
  };

  const toggleSkipMode = () => {
    gameAudio.playSfx("click");
    setIsAutoPlay(false);
    setIsSkipMode(prev => !prev);
  };

  const toggleAutoPlay = () => {
    gameAudio.playSfx("click");
    setIsSkipMode(false);
    setIsAutoPlay(prev => !prev);
  };

  // Render CSS Background Artworks based on visual novel parameters
  const renderBackgroundScene = () => {
    const bg = currentNode.background;
    
    if (bg === "black") {
      return <div className="absolute inset-0 bg-black z-0 transition-all duration-500" />;
    }

    if (bg === "time_tunnel") {
      return (
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950 via-zinc-950 to-blue-950 z-0 overflow-hidden flex items-center justify-center transition-all duration-500">
          {/* Neon spinning tunnel indicators inside canvas */}
          <div className="absolute w-[800px] h-[800px] border-[3px] border-emerald-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute w-[500px] h-[500px] border border-blue-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
          <div className="absolute w-[300px] h-[300px] border-2 border-red-500/15 rounded-full animate-ping" />
          <div className="text-emerald-500/40 text-xs font-mono tracking-widest uppercase mb-12 select-none animate-pulse">
            TRANSDIMENSIONAL TEMPORAL TUNNEL ACTIVE
          </div>
        </div>
      );
    }

    if (bg === "lab") {
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900 to-zinc-950 z-0 transition-all duration-500 flex flex-col justify-between p-12">
          {/* Styled Retro laboratory outlines */}
          <div className="w-full flex justify-between opacity-10">
            <div className="w-24 h-48 border border-stone-400 rounded flex flex-col gap-2 p-2">
              <div className="h-4 bg-stone-500 rounded" />
              <div className="h-12 bg-stone-500 rounded" />
              <div className="h-2 bg-stone-500 rounded animate-pulse" />
            </div>
            <div className="w-40 h-32 border border-stone-400 rounded-full flex items-center justify-center">
              <div className="text-[10px] font-mono">LAB MICROWAVE (PROTOTYPE)</div>
            </div>
          </div>
          <div className="absolute bottom-24 left-1/3 w-32 h-32 bg-yellow-500/5 blur-2xl rounded-full" />
        </div>
      );
    }

    if (bg === "akihabara") {
      return (
        <div className="absolute inset-0 bg-slate-950 z-0 transition-all duration-500 overflow-hidden">
          {/* Neon grid representing cyberpunk Akihabara streets */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          {/* Floating neon billboards mockup panels */}
          <div className="absolute top-12 left-8 w-24 h-36 bg-emerald-950/25 border border-emerald-500/30 rounded p-2 hidden sm:block animate-pulse">
            <div className="w-full h-1/2 bg-emerald-500/10 rounded mb-2" />
            <div className="h-2 bg-emerald-500/40 rounded w-3/4 mb-1" />
            <div className="h-2 bg-emerald-500/40 rounded w-1/2" />
          </div>

          <div className="absolute top-24 right-12 w-32 h-20 bg-red-950/25 border border-red-500/30 rounded p-2 hidden sm:block">
            <div className="h-3 bg-red-500/40 rounded w-full mb-2" />
            <div className="h-2 bg-red-500/20 rounded w-2/3" />
            {/* Nixie small lamp */}
            <div className="flex gap-1 mt-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <div className="w-2 h-2 rounded-full bg-amber-500" />
            </div>
          </div>
        </div>
      );
    }

    if (bg === "radio_building") {
      return (
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 via-rose-950/20 to-amber-950/35 z-0 transition-all duration-500">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.4)_1px,transparent_1px)]" />
          {/* Red warning marker dot blinking representing satelite impact */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full animate-ping opacity-60" />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full shadow-lg shadow-red-500/50" />
          <div className="text-center text-[10px] font-mono text-amber-500/35 mt-24 uppercase select-none tracking-widest uppercase">
            WARN: RADIO KAULAN BUILDING RESTRICTED AREA
          </div>
        </div>
      );
    }

    if (bg === "shrine") {
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-stone-950 to-red-950/45 z-0 transition-all duration-500">
          {/* Shrine architecture silhouettes */}
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-44 h-32 border-t-4 border-x-2 border-red-800 opacity-20" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-60 h-4 border-b-2 border-red-700 opacity-25" />
          
          {/* Petals falling simulator */}
          <div className="absolute bottom-12 right-20 w-3 h-3 bg-rose-500/20 rounded-full blur-[1px] animate-bounce" />
          <div className="absolute bottom-24 left-16 w-2.5 h-2.5 bg-rose-500/30 rounded-full blur-[1px]" />
        </div>
      );
    }

    return <div className="absolute inset-0 bg-zinc-900 z-0" />;
  };

  return (
    <div 
      id="novel_viewport"
      className="relative w-full h-screen flex flex-col justify-between overflow-hidden bg-[#0a0a0c] select-none text-[#e0e0e0]"
    >
      {/* Background Layer element */}
      {renderBackgroundScene()}

      {/* --- FLOATING UPPER HUD PANEL --- */}
      <nav 
        id="novel_hud_header"
        className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-gradient-to-b from-black via-black/40 to-transparent"
      >
        {/* Nixie Divergence HUD tool */}
        <DivergenceMeter value={divergence} />

        {/* HUD control actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 font-mono">
          <button
            onClick={() => { gameAudio.playSfx("click"); setSaveLoadMode("save"); }}
            className="flex items-center gap-1 px-3 py-1.5 bg-black/80 hover:bg-black border border-[#00ff41]/20 hover:border-[#00ff41] rounded text-[10px] tracking-wider text-stone-300 font-bold transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[#00ff41]" />
            <span>SAVE</span>
          </button>
          
          <button
            onClick={() => { gameAudio.playSfx("click"); setSaveLoadMode("load"); }}
            className="flex items-center gap-1 px-3 py-1.5 bg-black/80 hover:bg-black border border-[#00ff41]/20 hover:border-[#00ff41] rounded text-[10px] tracking-wider text-stone-300 font-bold transition cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#00ff41]" />
            <span>LOAD</span>
          </button>

          <button
            onClick={() => { gameAudio.playSfx("click"); setShowLogDrawer(true); }}
            className="flex items-center gap-1 px-3 py-1.5 bg-black/80 hover:bg-black border border-[#00ff41]/20 hover:border-[#00ff41] rounded text-[10px] tracking-wider text-stone-300 font-bold transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#00ff41]" />
            <span>LOG</span>
          </button>

          <button
            onClick={() => { gameAudio.playSfx("click"); onToggleMute(); }}
            className="p-1.5 bg-black/80 hover:bg-black border border-[#00ff41]/20 hover:border-[#00ff41] rounded transition text-stone-400 hover:text-[#00ff41] cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => { gameAudio.playSfx("click"); onExitToMenu(); }}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-900/40 rounded text-[10px] tracking-wider text-red-200 font-bold transition cursor-pointer"
          >
            <Menu className="w-3.5 h-3.5" />
            <span>MENU</span>
          </button>
        </div>
      </nav>

      {/* --- ACTIVE CHARACTERS MULTI-BUST PANEL --- */}
      <div 
        id="character_visuals_panel"
        className="relative z-10 flex-1 flex items-end justify-center px-4 sm:px-12 pointer-events-none"
      >
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0a0a0c]/80 to-transparent z-0 pointer-events-none" />

        <div className="w-full max-w-5xl flex justify-between items-end relative z-10">
          {/* Left character box */}
          <div className="w-1/2 flex justify-start items-end">
            {currentNode.characterLeft && currentNode.characterLeft !== "none" && (
              <CharacterAsset
                name={currentNode.characterLeft}
                expression={currentNode.characterLeftExpression}
                side="left"
              />
            )}
          </div>

          {/* Right character box */}
          <div className="w-1/2 flex justify-end items-end">
            {currentNode.characterRight && currentNode.characterRight !== "none" && (
              <CharacterAsset
                name={currentNode.characterRight}
                expression={currentNode.characterRightExpression}
                side="right"
              />
            )}
          </div>
        </div>
      </div>

      {/* --- DIALOGUE AND DECISIONS CONSOLE BOX (BOTTOM) --- */}
      <div 
        id="dialogue_console_wrapper"
        className="relative z-20 w-full bg-black/95 border-t border-[#00ff41]/30 px-4 py-5 sm:px-10 shadow-[0_0_50px_rgba(0,0,0,0.9)]"
      >
        <div className="max-w-4xl mx-auto flex flex-col gap-3.5 relative">

          {/* Floating dialogue modifiers (Skip / Auto-play status tags) */}
          <div className="absolute -top-11 right-0 flex items-center gap-2">
            <button
              onClick={toggleSkipMode}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider transition uppercase cursor-pointer ${
                isSkipMode 
                  ? "bg-red-950/80 text-red-400 border border-red-500 blink" 
                  : "bg-black/80 text-stone-400 border border-[#00ff41]/20 hover:border-[#00ff41]"
              }`}
            >
              <FastForward className="w-3 h-3" />
              <span>SKIP MODE {isSkipMode ? "ON" : "OFF"}</span>
            </button>

            <button
              onClick={toggleAutoPlay}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider transition uppercase cursor-pointer ${
                isAutoPlay 
                  ? "bg-amber-950/80 text-[#ff6b00] border border-[#ff6b00]" 
                  : "bg-black/80 text-stone-400 border border-[#00ff41]/20 hover:border-[#00ff41]"
              }`}
            >
              {isAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>AUTO-PLAY {isAutoPlay ? "ON" : "OFF"}</span>
            </button>
          </div>

          {/* Speaker label badge */}
          <div className="inline-flex">
            <span 
              className="px-4 py-1 rounded-sm bg-[#00ff41]/10 border border-[#00ff41]/40 text-[10px] font-mono font-bold tracking-widest text-[#00ff41] uppercase flex items-center gap-1.5"
              style={{ textShadow: "0 0 5x rgba(0,255,65,0.2)" }}
            >
              <Sparkles className="w-3 h-3 animate-pulse" />
              {currentNode.speaker}
            </span>
          </div>

          {/* Active typed dialog layout */}
          <div 
            onClick={handleNextClick}
            className="min-h-[85px] py-1 cursor-pointer select-text"
          >
            <p className="text-white text-xs sm:text-sm font-sans font-medium leading-relaxed">
              {displayedText}
              {isTypingComplete && (
                <span className="inline-block w-2.5 h-4 bg-[#00ff41] ml-1.5 animate-pulse">▼</span>
              )}
            </p>
          </div>

          {/* BRANCH OPTIONS TRIGGER INTERACTION */}
          {currentNode.choices && isTypingComplete && (
            <div 
              id="choices_container_list"
              className="my-3 flex flex-col gap-2.5 animate-[fadeInUp_0.35s_ease-out_forwards]"
            >
              {currentNode.choices.map((choice, index) => {
                const choiceLocked = choice.phoneRequired && !phoneOpen;
                return (
                  <button
                    key={index}
                    disabled={choiceLocked}
                    onClick={() => handleChoiceSelect(choice)}
                    className={`w-full text-left p-3.5 border rounded-sm font-sans text-xs font-semibold flex items-center justify-between transition-all duration-150 relative ${
                      choiceLocked
                        ? "bg-black/90 border-stone-800 text-stone-600 cursor-not-allowed"
                        : choice.phoneRequired 
                          ? "bg-red-950/20 hover:bg-red-950/40 border-red-900/60 hover:border-red-500 text-red-200 cursor-pointer shadow-md shadow-red-950/20"
                          : "bg-black/85 hover:bg-[#00ff41]/10 border-[#00ff41]/20 hover:border-[#00ff41] text-stone-200 hover:text-white cursor-pointer shadow-[0_0_10px_rgba(0,255,65,0.05)]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 pr-4 leading-medium">
                      <span className="text-[#00ff41] font-mono text-[10px] font-bold">0{index + 1}.</span>
                      <span>{choice.text}</span>
                    </div>
                    {choice.phoneRequired ? (
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                        phoneOpen ? "bg-red-800 text-white border-red-500 animate-pulse" : "bg-black border-stone-800 text-stone-600"
                      }`}>
                        {phoneOpen ? "HP AKTIF" : "BUTUH HP"}
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#00ff41] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick status guide if phone triggers active */}
          {currentNode.phoneTrigger && isTypingComplete && (
            <div className="my-1.5 p-2 bg-red-950/20 border border-red-800/40 rounded flex items-center justify-between text-[10px] font-mono text-red-300 animate-pulse">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>{currentNode.phoneTrigger.promptText}</span>
              </span>
              <button 
                onClick={() => setPhoneOpen(true)}
                className="px-2.5 py-1 bg-red-800 text-white border border-red-600 rounded text-[9px] font-bold hover:bg-red-700 cursor-pointer"
              >
                BUKA SEKARANG
              </button>
            </div>
          )}

        </div>
      </div>

      {/* --- INTEGRATED CELLPHONE LAYOUT --- */}
      <PhoneTrigger
        triggerData={currentNode.phoneTrigger}
        onSendDMail={handleDMailTransmitted}
        onClose={() => setPhoneOpen(false)}
        isOpen={phoneOpen}
        onToggleOpen={() => setPhoneOpen(prev => !prev)}
      />

      {/* --- BACKLOG DIALOGUE HISTORY DRAWER (LOG) --- */}
      {showLogDrawer && (
        <div 
          id="backlog_log_drawer"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-end animate-[fadeIn_0.2s]"
          onClick={() => { gameAudio.playSfx("click"); setShowLogDrawer(false); }}
        >
          <div 
            className="w-full max-w-md h-full bg-[#0a0a0c] border-l border-[#00ff41]/20 flex flex-col justify-between shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing Click
          >
            {/* Drawer Header */}
            <div className="bg-black px-5 py-4 border-b border-[#00ff41]/10 flex justify-between items-center font-mono">
              <span className="text-xs font-bold text-[#00ff41] flex items-center gap-1.5 uppercase tracking-wide">
                <FileText className="w-4 h-4 text-[#ff6b00]" />
                <span>Transkripsi Riwayat Garis Dunia</span>
              </span>
              <button 
                onClick={() => { gameAudio.playSfx("click"); setShowLogDrawer(false); }}
                className="text-stone-400 hover:text-[#00ff41] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Backlog Lists container */}
            <div id="log_drawer_scroll" className="flex-1 overflow-y-auto p-5 space-y-4 select-text">
              {textLog.length === 0 ? (
                <div className="h-full flex items-center justify-center text-stone-500 text-xs italic font-mono uppercase">
                  Log transkripsi hampa...
                </div>
              ) : (
                textLog.map((log, index) => (
                  <div key={index} className="space-y-1.5 border-b border-[#00ff41]/5 pb-3">
                    <span className="text-[10px] font-mono font-bold text-[#ff6b00] uppercase tracking-widest block">
                      {log.speaker}
                    </span>
                    <p className="text-stone-300 font-sans text-xs leading-relaxed">
                      {log.text}
                    </p>
                  </div>
                ))
              )}
              <div ref={logEndRef} />
            </div>

            {/* Help guidelines inside logs drawer */}
            <div className="bg-black p-4 border-t border-[#00ff41]/10 text-[9px] font-mono text-stone-500 text-center uppercase tracking-wider">
              SELURUH SEJARAH KELENGKUNGAN ALUR DISIMPAN UNTUK OPERASI SKULD.
            </div>
          </div>
        </div>
      )}

      {/* --- SAVE / LOAD MODAL CONTROLLER --- */}
      {saveLoadMode !== "none" && (
        <SaveLoadModal
          mode={saveLoadMode as "save" | "load"}
          currentNodeId={currentNodeId}
          currentDivergence={divergence}
          currentSummaryText={currentNode.text}
          unlockedAchievements={unlockedAchievements}
          onClose={() => setSaveLoadMode("none")}
          onLoadSlot={handleLoadSlotAction}
        />
      )}

    </div>
  );
}
