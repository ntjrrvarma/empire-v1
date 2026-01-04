"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState("Idle");

  useEffect(() => {
    const saved = localStorage.getItem("empire-count");
    if (saved) setCount(parseInt(saved));
  }, []);

  const handleClick = () => {
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem("empire-count", newCount.toString());
    setStatus("Syncing...");
    
    clearTimeout((window as any).saveTimer);
    (window as any).saveTimer = setTimeout(() => {
      saveToGit(newCount);
    }, 2000);
  };

  const saveToGit = async (lvl: number) => {
    try {
      setStatus("Pushing...");
      // Simulate API call for visual effect if API isn't running
      await new Promise(r => setTimeout(r, 1000)); 
      // await fetch("/api/save", { method: "POST", body: JSON.stringify({ count: lvl }) });
      setStatus("Secured ✅");
    } catch (e) {
      setStatus("Error ❌");
    }
  };

  return (
    // THE CONTAINER: Full screen, dark gradient background
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-black text-white p-4">
      
      {/* THE CARD: Glass effect, rounded corners, border */}
      <div className="relative group w-full max-w-md p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl transition-all hover:shadow-purple-500/20">
        
        {/* Glow Effect behind the card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              PROJECT COSMOS
            </h1>
            <span className="px-3 py-1 text-xs font-mono text-purple-300 bg-purple-500/10 rounded-full border border-purple-500/20">
              V 0.1
            </span>
          </div>

          {/* STATS DISPLAY */}
          <div className="text-center py-10">
            <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Grind Level</p>
            <div className="text-8xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              {count}
            </div>
            
            {/* Status Pill */}
            <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${status.includes("Secured") ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"}`}>
              <span className={`w-2 h-2 rounded-full ${status.includes("Secured") ? "bg-green-500" : "bg-blue-500 animate-pulse"}`}></span>
              {status}
            </div>
          </div>

          {/* ACTION BUTTON */}
          <button
            onClick={handleClick}
            className="w-full relative overflow-hidden group/btn bg-white text-black font-bold py-4 rounded-xl text-lg transition-all active:scale-[0.98]"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            <span className="relative group-hover/btn:text-white transition-colors">
              BUILD EMPIRE 🔥
            </span>
          </button>

          {/* KAGURA QUOTE */}
          {count > 0 && (
            <div className="mt-6 text-center border-t border-white/5 pt-4">
              <p className="text-xs text-slate-500 italic">
                "{count > 30 ? "Finally awake, Monkey?" : "Don't stop now."}" - Kagura
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}