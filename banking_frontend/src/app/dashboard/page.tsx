// src/app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  LogOut, 
  Send,
  Clock, 
  ShieldCheck, 
  AlertCircle 
} from "lucide-react";
import api from "@/lib/api";
import TransferModal from "@/components/TransferModal";

interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  account_id: number;
  account_number: string;
  balance: number;
  currency: string;
  created_at: string;
}

interface TransactionRecord {
  id: number;
  from_account_id: number;
  to_account_id: number;
  amount: number;
  type: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const [profileRes, txRes] = await Promise.all([
        api.get("/me"),
        api.get("/transactions"),
      ]);

      setProfile(profileRes.data);
      setTransactions(txRes.data.transactions || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth?mode=signin");
      return;
    }
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth?mode=signin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
        <p className="text-sm text-slate-400">Loading your balance & transactions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome, {profile?.full_name}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Account ID: <span className="text-blue-400 font-bold">#{profile?.account_id}</span> • {profile?.email}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsTransferModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors flex items-center space-x-2 shadow-lg shadow-blue-600/20"
            >
              <Send className="h-4 w-4" />
              <span>Send Money</span>
            </button>
            <button
              onClick={fetchDashboardData}
              className="p-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-300 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-xl text-sm font-semibold transition-colors flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3 text-sm text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Balance Card & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-gradient-to-tr from-blue-900/40 via-slate-900 to-slate-900 border border-blue-500/30 p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-blue-400 font-semibold tracking-wider uppercase">Live Balance</p>
                <h2 className="text-4xl lg:text-5xl font-extrabold text-white mt-2">
                  ৳{profile?.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </h2>
              </div>
              <div className="p-3 bg-blue-600/20 rounded-2xl text-blue-400 border border-blue-500/30">
                <CreditCard className="h-7 w-7" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800/80">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Account Number</p>
                <p className="text-sm font-semibold text-slate-200 mt-1">{profile?.account_number}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Currency</p>
                <p className="text-sm font-semibold text-slate-200 mt-1">{profile?.currency}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col justify-between space-y-6">
            <div className="flex items-center space-x-3 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
              <span className="text-sm font-semibold">Status: Active</span>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase">Total Transactions</p>
              <p className="text-2xl font-bold text-white">{transactions.length} Records</p>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500">Member Since</p>
              <p className="text-sm font-semibold text-slate-300 mt-0.5">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No transactions recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                    <th className="pb-4 font-semibold">Type</th>
                    <th className="pb-4 font-semibold">From / To</th>
                    <th className="pb-4 font-semibold">Date & Time</th>
                    <th className="pb-4 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {transactions.map((tx) => {
                    const isCredit = tx.to_account_id === profile?.account_id;
                    return (
                      <tr key={tx.id} className="hover:bg-slate-950/40 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-xl ${
                              isCredit ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                            }`}>
                              {isCredit ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                            </div>
                            <span className="font-semibold text-white capitalize">{tx.type}</span>
                          </div>
                        </td>
                        <td className="py-4 text-slate-400 text-xs">
                          {isCredit ? `From Account #${tx.from_account_id}` : `To Account #${tx.to_account_id}`}
                        </td>
                        <td className="py-4 text-slate-400 text-xs">
                          {new Date(tx.created_at).toLocaleString()}
                        </td>
                        <td className={`py-4 text-right font-bold ${
                          isCredit ? "text-emerald-400" : "text-rose-400"
                        }`}>
                          {isCredit ? "+" : "-"}৳{tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onSuccess={fetchDashboardData}
        currentAccountId={profile?.account_id}
      />
    </div>
  );
}