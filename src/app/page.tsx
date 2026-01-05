"use client";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase"; 
import AES from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8';

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "default_key";

type Secret = {
  id: number;
  service: string;
  username: string;
  password: string; // FIXED: Renamed from pass_key
};

export default function Home() {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [form, setForm] = useState({ service: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState<number | null>(null);

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

  const encryptData = (text: string) => {
    return AES.encrypt(text, SECRET_KEY).toString();
  };

  const decryptData = (cipherText: string) => {
    try {
      const bytes = AES.decrypt(cipherText, SECRET_KEY);
      return bytes.toString(enc);
    } catch (e) {
      return "Error: Key Mismatch";
    }
  };

  const handleSave = async () => {
    if (!form.service || !form.password) return alert("Fill the details, Monkey!");
    
    setLoading(true);
    const encryptedPassword = encryptData(form.password);
    
    // FIXED: Using 'password' column name
    const { error } = await supabase.from("vault").insert([{
      service: form.service,
      username: form.username,
      password: encryptedPassword 
    }]);

    if (error) {
      console.error(error);
      alert("Save Failed!");
    } else {
      setForm({ service: "", username: "", password: "" });
      fetchSecrets();
    }
    setLoading(false);
  };

  // --- 🗑️ NEW: DELETE FUNCTION ---
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to burn this secret?")) return;

    const { error } = await supabase
      .from("vault")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Delete Failed!");
    } else {
      // Remove from UI instantly (Optimistic update)
      setSecrets(secrets.filter((s) => s.id !== id));
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-950 text-white p-6 font-mono">
      <div className="w-full max-w-md mb-8 mt-10 text-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
          🔐 RAHUL'S VAULT
        </h1>
        <p className="text-xs text-zinc-500 mt-2">AES-256 ENCRYPTED • V1.0</p>
      </div>

      {/* INPUT FORM */}
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl backdrop-blur-sm shadow-xl">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 uppercase tracking-wider">Service Name</label>
            <input
              type="text"
              placeholder="e.g. Netflix"
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 mt-1 focus:outline-none focus:border-emerald-500 transition-colors"
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
            />
          </div>
          
          <div>
            <label className="text-xs text-zinc-400 uppercase tracking-wider">Username</label>
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
              type="text"
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

      {/* LIST */}
      <div className="w-full max-w-md mt-10 space-y-3 pb-20">
        <h2 className="text-sm text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">
          Stored Secrets ({secrets.length})
        </h2>

        {secrets.map((secret) => (
          <div key={secret.id} className="group relative bg-zinc-900 border border-zinc-800 p-4 rounded-lg flex justify-between items-center hover:border-zinc-700 transition-all">
            
            <div className="overflow-hidden mr-4">
              <h3 className="font-bold text-white truncate">{secret.service}</h3>
              <p className="text-xs text-zinc-500 truncate">{secret.username}</p>
            </div>

            <div className="flex items-center gap-2">
              {/* REVEAL BUTTON */}
              <div 
                onClick={() => setRevealed(revealed === secret.id ? null : secret.id)}
                className="cursor-pointer bg-black/50 px-3 py-2 rounded border border-zinc-800 hover:border-emerald-500/50 transition-colors select-none min-w-[100px] text-center"
              >
                <code className={`text-xs ${revealed === secret.id ? "text-emerald-400" : "text-zinc-600"}`}>
                  {revealed === secret.id ? decryptData(secret.password) : "••••••••"}
                </code>
              </div>

              {/* DELETE BUTTON (Trash Can) */}
              <button 
                onClick={() => handleDelete(secret.id)}
                className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                title="Burn Secret"
              >
                🗑️
              </button>
            </div>

          </div>
        ))}
      </div>
    </main>
  );
}