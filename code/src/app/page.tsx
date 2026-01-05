"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

// Define the shape of our secret
type Secret = {
  id: number;
  service: string;
  username: string;
  password: string;
};

export default function Home() {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [form, setForm] = useState({ service: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState<number | null>(null); // Stores ID of revealed password

  // 1. LOAD: Fetch secrets on startup
  useEffect(() => {
    fetchSecrets();
  }, []);

  const fetchSecrets = async () => {
    const { data, error } = await supabase
      .from("vault")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching:", error);
    else setSecrets(data || []);
  };

  // 2. SAVE: Add a new secret
  const handleSave = async () => {
    if (!form.service || !form.password) return alert("Fill the details, Monkey!");
    
    setLoading(true);
    const { error } = await supabase.from("vault").insert([form]);

    if (error) {
      alert("Save Failed!");
    } else {
      setForm({ service: "", username: "", password: "" }); // Clear form
      fetchSecrets(); // Refresh list
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-950 text-white p-6 font-mono">
      
      {/* HEADER */}
      <div className="w-full max-w-md mb-8 mt-10 text-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
          🔐 RAHUL'S VAULT
        </h1>
        <p className="text-xs text-zinc-500 mt-2">SECURE STORAGE PROTOCOL V1</p>
      </div>

      {/* INPUT FORM (The Safe Door) */}
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl backdrop-blur-sm shadow-xl">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 uppercase tracking-wider">Service Name</label>
            <input
              type="text"
              placeholder="e.g. Netflix, Wifi"
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 mt-1 focus:outline-none focus:border-emerald-500 transition-colors"
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
            />
          </div>
          
          <div>
            <label className="text-xs text-zinc-400 uppercase tracking-wider">Username / Email</label>
            <input
              type="text"
              placeholder="e.g. rahul@empire.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 mt-1 focus:outline-none focus:border-emerald-500 transition-colors"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 uppercase tracking-wider">Password</label>
            <input
              type="text" // Kept as text so you can see what you type (for now)
              placeholder="Secret Key..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 mt-1 focus:outline-none focus:border-emerald-500 transition-colors text-emerald-400"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-bold py-3 rounded mt-4 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "ENCRYPTING..." : "LOCK IT IN 🔒"}
          </button>
        </div>
      </div>

      {/* THE LIST (The Inventory) */}
      <div className="w-full max-w-md mt-10 space-y-3">
        <h2 className="text-sm text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">
          Stored Secrets ({secrets.length})
        </h2>

        {secrets.map((secret) => (
          <div key={secret.id} className="group relative bg-zinc-900 border border-zinc-800 p-4 rounded-lg flex justify-between items-center hover:border-zinc-700 transition-all">
            
            {/* Left Side: Info */}
            <div>
              <h3 className="font-bold text-white">{secret.service}</h3>
              <p className="text-xs text-zinc-500">{secret.username}</p>
            </div>

            {/* Right Side: Password Reveal */}
            <div 
              onClick={() => setRevealed(revealed === secret.id ? null : secret.id)}
              className="cursor-pointer bg-black/50 px-3 py-2 rounded border border-zinc-800 hover:border-emerald-500/50 transition-colors select-none"
            >
              <code className={`text-sm ${revealed === secret.id ? "text-emerald-400" : "text-zinc-600"}`}>
                {revealed === secret.id ? secret.password : "••••••••"}
              </code>
            </div>

          </div>
        ))}
        
        {secrets.length === 0 && (
          <p className="text-center text-zinc-600 italic text-sm py-10">Vault is empty.</p>
        )}
      </div>

    </main>
  );
}