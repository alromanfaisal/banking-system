"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Lock, Mail, User, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuildingColumns } from "@fortawesome/free-solid-svg-icons";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";

  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("➡️ Form submitted!", { mode, email, passwordLength: password.length });
    
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        console.log("➡️ Registering new user...");
        await api.post("/register", {
          full_name: fullName,
          email,
          password,
        });
        console.log("✅ Registration successful, attempting auto-login...");
      }

      console.log("➡️ Sending login request to /login...");
      const loginRes = await api.post("/login", { email, password });
      
      console.log("✅ Login Response Data:", loginRes.data);

      const token = loginRes.data?.token || loginRes.data?.jwt || loginRes.data?.access_token;

      if (!token) {
        throw new Error("No token returned from server response.");
      }

      console.log("🔑 Saving token to localStorage...");
      localStorage.setItem("token", token);

      console.log("🚀 Redirecting to /dashboard...");
      router.push("/dashboard");

    } catch (err: any) {
      console.error("❌ Auth error encountered:", err);

      if (err.response) {
        console.error("Response Error Data:", err.response.data);
        setError(
          err.response.data?.error || 
          err.response.data?.message || 
          `Server Error (${err.response.status})`
        );
      } else if (err.request) {
        console.error("No response received from API server:", err.request);
        setError("Unable to connect to backend. Check CORS or server status.");
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
      {/* Brand Header with FontAwesome Bank Icon */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="p-3.5 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20 flex items-center justify-center">
          <FontAwesomeIcon icon={faBuildingColumns} className="h-7 w-7 text-blue-500" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          Apex<span className="text-blue-500">Bank</span>
        </span>
      </div>

      {/* Toggle Mode Buttons */}
      <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
        <button
          type="button"
          onClick={() => {
            console.log("Switching mode to signin");
            setMode("signin");
            setError("");
          }}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all ${
            mode === "signin" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            console.log("Switching mode to signup");
            setMode("signup");
            setError("");
          }}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all ${
            mode === "signup" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
          }`}
        >
          Create Account
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-center text-white">
          {mode === "signin" ? "Welcome Back" : "Open Your Account"}
        </h2>
        <p className="text-xs text-slate-400 text-center mt-1">
          {mode === "signin"
            ? "Access your bank account ledger and balance"
            : "Get instant ৳1,000 welcome bonus on registration"}
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required={mode === "signup"}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 mt-2 disabled:opacity-50 text-white cursor-pointer"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          ) : (
            <>
              <span>{mode === "signin" ? "Sign In" : "Register Now"}</span>
              <ArrowRight className="h-4 w-4 text-white" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
      <Suspense fallback={<Loader2 className="h-8 w-8 text-blue-500 animate-spin" />}>
        <AuthForm />
      </Suspense>
    </div>
  );
}