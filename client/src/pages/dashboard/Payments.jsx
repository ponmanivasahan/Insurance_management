import { useEffect, useState } from "react";
import api from "../../services/api";
import MainLayout from "../Layout/Mainlayout";
import { FaMoneyBillWave, FaCreditCard, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

function Payments() {
    const [payments, setPayments] = useState([]);
    const [policies, setPolicies] = useState([]);
    const [role, setRole] = useState("customer");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ policy_id: "", amount: "" });

    useEffect(() => {
        const userRole = sessionStorage.getItem("role") || "customer";
        setRole(userRole);
        fetchPayments();
        fetchPolicies();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await api.get("/payments");
            if (sessionStorage.getItem("role") === "customer") {
                // For customers, show payments associated with policy_id 1, 2, or customer's own policies
                const userPolicies = policies.map(p => p.id);
                setPayments(res.data.filter(p => userPolicies.includes(p.policy_id) || p.policy_id === 1 || p.policy_id === 2));
            } else {
                setPayments(res.data);
            }
        } catch (err) {
            console.error("Error fetching payments", err);
        }
    };

    const fetchPolicies = async () => {
        try {
            const res = await api.get("/policies");
            if (sessionStorage.getItem("role") === "customer") {
                const customerPols = res.data.filter(p => p.customer_id === 1);
                setPolicies(customerPols);
                if (customerPols.length > 0) {
                    setForm(prev => ({ ...prev, policy_id: customerPols[0].id, amount: customerPols[0].premium_amount }));
                }
            } else {
                setPolicies(res.data);
                if (res.data.length > 0) {
                    setForm(prev => ({ ...prev, policy_id: res.data[0].id, amount: res.data[0].premium_amount }));
                }
            }
        } catch (err) {
            console.error("Error fetching policies", err);
        }
    };

    const handlePolicyChange = (policyId) => {
        const matched = policies.find(p => p.id === Number(policyId));
        setForm({
            policy_id: policyId,
            amount: matched ? matched.premium_amount : ""
        });
    };

    const handlePay = async (e) => {
        e.preventDefault();
        try {
            await api.post("/payments", {
                policy_id: Number(form.policy_id),
                amount: Number(form.amount)
            });
            setShowModal(false);
            fetchPayments();
            fetchPolicies();
            alert("Premium Payment Recorded Successfully!");
        } catch (err) {
            alert("Error recording payment");
        }
    };

    const handleMarkPaid = async (id, policyId, amount) => {
        try {
            await api.post("/payments", {
                policy_id: Number(policyId),
                amount: Number(amount)
            });
            // Clean up the overdue/pending payment row: we filter it out of display, or update it
            let localPayments = JSON.parse(localStorage.getItem("insurance_payments") || "[]");
            const idx = localPayments.findIndex(p => p.id === id);
            if (idx !== -1) {
                localPayments[idx].payment_status = "paid";
                localPayments[idx].payment_date = new Date().toISOString().split("T")[0];
                localStorage.setItem("insurance_payments", JSON.stringify(localPayments));
            }
            fetchPayments();
            fetchPolicies();
            alert("Premium recorded as Paid!");
        } catch (err) {
            alert("Error updating payment");
        }
    };

    // Calculate overdue items
    const overduePayments = payments.filter(p => p.payment_status === "overdue" || !p.payment_date);

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Premium Tracking</h1>
                    <p className="text-sm text-gray-500 mt-1">Monitor payments, track due dates, and view billing alerts</p>
                </div>
                {role === "customer" && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/10 transition-all duration-200"
                    >
                        <FaCreditCard /> Pay Premium
                    </button>
                )}
            </div>

            {/* Billing Alerts / Overdue section */}
            {overduePayments.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8 flex items-start gap-4">
                    <div className="text-red-500 text-2xl mt-0.5 animate-bounce">
                        <FaExclamationCircle />
                    </div>
                    <div>
                        <h3 className="font-bold text-red-800 text-base">Overdue Premium Notifications</h3>
                        <p className="text-sm text-red-600 mt-1">
                            You have policy premium payments that are past their due dates. Pay immediately to keep your coverage active.
                        </p>
                        <div className="mt-3 space-y-2">
                            {overduePayments.map(p => (
                                <div key={p.id} className="flex items-center gap-3 text-xs bg-white border border-red-100 rounded-lg p-2.5 max-w-md">
                                    <span className="font-bold text-red-700">Policy POL100{p.policy_id}</span>
                                    <span className="text-slate-500">Premium Due: ₹{p.amount}</span>
                                    {role === "customer" ? (
                                        <button
                                            onClick={() => { setForm({ policy_id: p.policy_id, amount: p.amount }); setShowModal(true); }}
                                            className="ml-auto bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-2.5 rounded transition-colors"
                                        >
                                            Pay Now
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleMarkPaid(p.id, p.policy_id, p.amount)}
                                            className="ml-auto bg-slate-700 hover:bg-slate-600 text-white font-bold py-1 px-2.5 rounded transition-colors"
                                        >
                                            Record Payment
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Payment history table */}
            <div className="bg-white/80 backdrop-blur-md shadow-lg border border-slate-100 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Payment Receipts & Invoice Logs</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Policy ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Premium Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {payments.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">#TXN990{p.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">POL100{p.policy_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{p.payment_date || "—"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-bold">₹{p.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 w-fit ${
                                            p.payment_status === "paid" ? "bg-emerald-100 text-emerald-800" :
                                            p.payment_status === "overdue" ? "bg-red-100 text-red-800" :
                                            "bg-amber-100 text-amber-800"
                                        }`}>
                                            {p.payment_status === "paid" ? <FaCheckCircle /> : <FaExclamationCircle />}
                                            {p.payment_status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-96 border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Pay Policy Premium</h2>
                        <form onSubmit={handlePay} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Select Policy</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                                    value={form.policy_id}
                                    onChange={(e) => handlePolicyChange(e.target.value)}
                                >
                                    {policies.map(p => (
                                        <option key={p.id} value={p.id}>{p.policy_type} ({p.policy_number})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Amount to Pay (₹)</label>
                                <input
                                    required
                                    type="number"
                                    readOnly
                                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 cursor-not-allowed"
                                    value={form.amount}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-xl font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-xl font-semibold transition-colors"
                                >
                                    Make Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}

export default Payments;
