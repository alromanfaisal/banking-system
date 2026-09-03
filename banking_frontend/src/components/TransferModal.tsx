// src/components/TransferModal.tsx
"use client";

import React, { useState } from "react";
import api from "@/lib/api";
import { Send, X, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentAccountId?: number;
}

export default function TransferModal({
  isOpen,
  onClose,
  onSuccess,
  currentAccountId,
}: TransferModalProps) {
  const [toAccountId, setToAccountId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  if (!isOpen) return null;

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const targetAccount = parseInt(toAccountId, 10);
    const transferAmount = parseFloat(amount);

    if (isNaN(targetAccount) || targetAccount <= 0) {
      setError("Please enter a valid recipient account ID.");
      return;
    }

    if (targetAccount === currentAccountId) {
      setError("Cannot transfer money to your own account.");
      return;
    }

    if (isNaN(transferAmount) || transferAmount <= 0) {
      setError("Transfer amount must be greater than zero.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/transfer", {
        to_account_id: targetAccount,
        amount: transferAmount,
      });

      setSuccessMsg(`Successfully transferred ৳${transferAmount.toFixed(2)}!`);
      setToAccountId("");
      setAmount("");

      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccessMsg("");
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Transfer failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/20">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Transfer Funds</h3>
              <p className="text-xs text-slate-400">Send money instantly to another account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center space-x-3 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Recipient Account ID
            </label>
            <input
              type="number"
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              placeholder="e.g. 2"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Amount (BDT)
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing Transfer...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Confirm Transfer</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}