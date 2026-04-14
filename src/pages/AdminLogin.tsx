import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import { toast } from "sonner";

const ADMIN_USER = "admin";
const ADMIN_PASS = "golden2025";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem("rp_admin", "true");
      navigate("/admin");
    } else {
      toast.error("Credenciais incorretas");
    }
  }

  return (
    <div className="min-h-screen bg-foreground flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <h1 className="font-display text-2xl font-semibold text-primary-foreground tracking-[0.15em] uppercase mb-2">
            Golden Clinic
          </h1>
          <p className="font-body text-xs text-primary-foreground/40 tracking-wide">
            Painel Administrativo
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5">
          <div className="relative">
            <User size={15} className="absolute left-4 top-4 text-primary-foreground/30" />
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Usuario"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 pl-11 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40"
            />
          </div>
          <div className="relative">
            <Lock size={15} className="absolute left-4 top-4 text-primary-foreground/30" />
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Senha"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 pl-11 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#b8935a] to-[#c9a96e] text-white py-3.5 rounded-lg text-xs font-medium tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
          >
            Entrar
          </button>
        </form>
      </motion.div>
    </div>
  );
}
