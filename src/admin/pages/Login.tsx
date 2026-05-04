import React, { useState } from "react";
import { Lock } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Edu@wordpress2025") {
      onLogin();
    } else {
      setError("Senha incorreta. Tente novamente.");
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white items-center justify-center font-sans">
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#2EFF00]/10 flex items-center justify-center text-[#2EFF00]">
            <Lock size={20} />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
          <p className="text-gray-400 text-sm">Insira a senha de administrador para continuar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Senha de acesso"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className={`w-full bg-[#111] border ${error ? 'border-red-500' : 'border-[#333] focus:border-[#2EFF00]'} rounded-lg px-4 py-3 text-white focus:outline-none transition-colors`}
            />
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#2EFF00] hover:bg-[#28e600] text-black font-bold py-3 rounded-lg transition-colors"
          >
            Acessar Sistema
          </button>
        </form>
      </div>
    </div>
  );
}
