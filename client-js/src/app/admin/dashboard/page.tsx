'use client';

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { getPayments, updateAPayment } from "../../../features/auth/authThunk";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AppDispatch } from "../../../app/store";

export default function AdminDashboardPage() {
  const dispatch = useDispatch<AppDispatch>();

  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [payments, setPayments] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getAllPayments = async () => {
    try {
      const result: any = await dispatch(getPayments()).unwrap();
      if (Array.isArray(result)) {
        setPayments(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPayments();
  }, [dispatch]);

  const filteredPayments = payments
    ?.filter((p) =>
      statusFilter === "all" ? true : p.status === statusFilter
    )
    .sort((a, b) =>
      sortOrder === "latest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const handleUpdate = async (paymentId: string, status: string) => {
    await dispatch(updateAPayment({ paymentId, status }));
    toast('Updated! Refreshing data...');
    getAllPayments();
  };

  return (
    <section className="min-h-screen bg-black text-white px-6 py-12 font-poppins relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <button
          onClick={() => router.push('/admin/signup')}
          className="px-3 absolute top-4 right-4 py-2 rounded-full border border-lime-400 bg-lime-300/30 text-white text-xs font-semibold hover:bg-lime-300/60"
        >
          create new admin
        </button>
        <h1 className="text-3xl font-bold">
          Hello Admin!
        </h1>

        <div className="flex gap-4 mt-4 md:mt-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-lime-400 outline-none text-white"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="done">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-black border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-lime-400 outline-none text-white"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr className="text-left text-white/60">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Txn ID</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">₹</th>
              <th className="px-4 py-3">Credits</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments?.map((p) => (
              <tr
                key={p._id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <td className="px-4 py-3">
                  <div className="font-medium">{p.userId?.name}</div>
                  <div className="text-white/40 text-xs">
                    {p.userId?.email}
                  </div>
                </td>

                <td className="px-4 py-3 font-mono text-xs">
                  {p.transactionNumber}
                </td>

                <td className="px-4 py-3 uppercase text-xs">
                  {p.planId}
                </td>

                <td className="px-4 py-3">₹{p.amount}</td>

                <td className="px-4 py-3">{p.credits}</td>

                <td className="px-4 py-3">
                  {p.status === "pending" && (
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Clock size={14} /> Pending
                    </span>
                  )}
                  {p.status === "done" && (
                    <span className="flex items-center gap-1 text-lime-400">
                      <CheckCircle size={14} /> Approved
                    </span>
                  )}
                  {p.status === "rejected" && (
                    <span className="flex items-center gap-1 text-red-400">
                      <XCircle size={14} /> Rejected
                    </span>
                  )}
                </td>

                <td className="px-4 py-3">
                  {p.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(p._id, "done")}
                        className="px-3 py-1 rounded-full bg-lime-400 text-black text-xs font-semibold hover:bg-lime-300"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdate(p._id, "rejected")}
                        className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {!loading && filteredPayments?.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-12 text-white/40"
                >
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {loading && (
          <div className="py-10 text-center text-white/40">
            Loading payments...
          </div>
        )}
      </div>
    </section>
  );
}
