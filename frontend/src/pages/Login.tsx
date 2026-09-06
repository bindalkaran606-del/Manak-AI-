import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, User, ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [officerId, setOfficerId] = useState("CPWD-ND-84920");
  const [department, setDepartment] = useState("Electrotechnical Department (ETD), BIS");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Authenticated as GeM Procurement Officer");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#E5DFD5] shadow-lg p-8 space-y-6 guilloche-watermark">
          {/* Logo Emblem */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#B81D24] text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md">
              मानक
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#0B132B]">
              MANAK AI Officer Access
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Smart India Hackathon 2026 · Problem SIH 26108
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-mono uppercase text-slate-500 font-semibold mb-1">
                Procurement Officer ID / GeM SSO
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] focus:ring-1 focus:ring-[#B81D24] focus:outline-none text-slate-800 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-mono uppercase text-slate-500 font-semibold mb-1">
                BIS Technical Department
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] focus:ring-1 focus:ring-[#B81D24] focus:outline-none text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E5DFD5] text-[11px] text-slate-600 space-y-1">
              <span className="font-semibold text-[#0B132B] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Demonstration Access Mode
              </span>
              <p>One-click instant authentication enabled for hackathon jury evaluation.</p>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#B81D24] hover:bg-[#991319] text-white py-5 text-xs font-semibold shadow-sm flex items-center justify-center gap-2"
              data-testid="login-submit-button"
            >
              <span>Authenticate & Enter Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
