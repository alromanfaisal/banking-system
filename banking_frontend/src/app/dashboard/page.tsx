"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";

interface Profile {
  id: number;
  full_name: string;
  email: string;
  account_id: number;
  account_number: string;
  balance: number;
  currency: string;
}

interface Transaction {
  id: number;
  from_account_id: number;
  to_account_id: number;
  amount: number;
  type: string;
  created_at: string;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recipientId, setRecipientId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [transferLoading, setTransferLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, txRes] = await Promise.all([
        API.get("/me"),
        API.get("/transactions"),
      ]);
      setProfile(profileRes.data);
      setTransactions(txRes.data.transactions || []);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/auth");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferLoading(true);
    setMessage(null);

    try {
      const res = await API.post("/transfer", {
        to_account_id: parseInt(recipientId),
        amount: parseFloat(amount),
      });

      setMessage({ text: res.data.message || "Transfer successful!", isError: false });
      setRecipientId("");
      setAmount("");
      fetchData(); // Refresh balance and transaction table
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.error || "Transfer failed. Please check inputs.",
        isError: true,
      });
    } finally {
      setTransferLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Bar */}
        <header className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome, {profile?.full_name}</h1>
            <p className="text-slate-400 text-sm">{profile?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white rounded-lg transition-all font-medium text-sm"
          >
            Logout
          </button>
        </header>

        {/* Main Grid: Balance Card + Quick Transfer Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Account Balance Card */}
          <div className="bg-gradient-to-br from-blue-700 to-indigo-900 p-6 rounded-2xl shadow-xl flex flex-col justify-between border border-blue-500/20">
            <div>
              <p className="text-blue-200 text-xs font-semibold tracking-wider uppercase">Account Balance</p>
              <h2 className="text-4xl font-extrabold text-white mt-2">
                ৳ {profile?.balance?.toLocaleString()} <span className="text-lg font-normal">{profile?.currency}</span>
              </h2>
            </div>
            <div className="mt-8 border-t border-blue-400/20 pt-4 flex justify-between text-sm text-blue-100">
              <span>Account Number</span>
              <span className="font-mono font-bold">{profile?.account_number}</span>
            </div>
          </div>

          {/* Money Transfer Form */}
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Send Money</h3>

            {message && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm ${
                  message.isError
                    ? "bg-red-500/10 border border-red-500/30 text-red-400"
                    : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleTransfer} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Recipient Account ID
                </label>
                <input
                  type="number"
                  required
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  placeholder="e.g. 2"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Amount (BDT)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={transferLoading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
                >
                  {transferLoading ? "Processing Transfer..." : "Transfer Funds"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">Recent Transactions</h3>
          
          {transactions.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">No transaction history found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">ID</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">From Account</th>
                    <th className="px-4 py-3">To Account</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3 rounded-r-lg">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {transactions.map((tx) => {
                    const isDebit = tx.from_account_id === profile?.account_id;
                    return (
                      <tr key={tx.id} className="hover:bg-slate-800/30">
                        <td className="px-4 py-3 font-mono">#{tx.id}</td>
                        <td className="px-4 py-3 font-semibold">{tx.type}</td>
                        <td className="px-4 py-3 font-mono">Account #{tx.from_account_id}</td>
                        <td className="px-4 py-3 font-mono">Account #{tx.to_account_id}</td>
                        <td
                          className={`px-4 py-3 font-bold ${
                            isDebit ? "text-red-400" : "text-emerald-400"
                          }`}
                        >
                          {isDebit ? "-" : "+"} ৳{tx.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {new Date(tx.created_at).toLocaleString()}
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
    </div>
  );
}