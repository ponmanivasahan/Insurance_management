import { useEffect, useState } from "react";
import api from "../../services/api";
import MainLayout from "../Layout/Mainlayout";
import { FaPlus, FaPlusCircle, FaDownload, FaSyncAlt } from "react-icons/fa";
import { CheckCircle, XCircle } from "lucide-react";

function DashboardCard({ title, value, change, description, indicatorColor }) {
    const isPositive = change.startsWith("+") || change.startsWith("-");
    const isDecreaseImprovement = change.startsWith("-") && title.includes("Time"); // e.g. Resolution Time decrease is good
    const isGood = isPositive ? !change.startsWith("-") : isDecreaseImprovement;

    return (
        <div className="bg-white  border border-[#e2e8f0] rounded-xl p-6 flex flex-col justify-between transition-all duration-300">
            <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</span>
                <span className={`w-2.5 h-2.5 rounded-full ${indicatorColor}`}></span>
            </div>
            <div className="mt-4">
                <h3 className="text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
                <div className="flex items-center gap-1.5 mt-2">
                    <span className={`text-xs font-bold ${isGood || change.includes("-18.4%") ? "text-emerald-600" : "text-rose-600"}`}>
                        {change}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                        {description}
                    </span>
                </div>
            </div>
        </div>
    );
}

function Claims() {
    const [role, setRole] = useState("customer");
    const [claims, setClaims] = useState([
        { id: "#CLM-982", name: "Victoria Sterling", pool: "Auto", amount: "$18,450.00", time: "12 Mins Ago", agent: "Sarah Jenkins", risk: "Severe Risk", status: "Under Review" },
        { id: "#CLM-981", name: "Amir Al-Otaibi", pool: "Property", amount: "$142,000.00", time: "1 Hour Ago", agent: "David Miller", risk: "Severe Risk", status: "Approved" },
        { id: "#CLM-980", name: "Helena Rostova", pool: "Health", amount: "$3,450.00", time: "3 Hours Ago", agent: "Unassigned", risk: "Low Risk", status: "Pending Agent" },
        { id: "#CLM-979", name: "Marcus Vance", pool: "Life", amount: "$500,000.00", time: "1 Day Ago", agent: "Elena Rostova", risk: "Medium Risk", status: "Rejected" }
    ]);
    const [showModal, setShowModal] = useState(false);
    const [newClaim, setNewClaim] = useState({ pool: "Auto", amount: "", reason: "" });

    useEffect(() => {
        const storedRole = sessionStorage.getItem("role") || "admin";
        setRole(storedRole);

        // Fetch claims from API if available
        api.get("/claims")
            .then((res) => {
                if (res.data && res.data.length > 0) {
                    const mapped = res.data.map(c => ({
                        id: `#CLM-9${c.id}`,
                        name: "Registered Client",
                        pool: c.policy_id === 1 ? "Auto" : c.policy_id === 2 ? "Property" : "Health",
                        amount: `$${Number(c.claim_amount).toLocaleString()}`,
                        time: "Just Now",
                        agent: "Unassigned",
                        risk: "Low Risk",
                        status: c.status === "verified" ? "Approved" : c.status === "pending" ? "Pending Agent" : "Rejected"
                    }));
                    setClaims(prev => {
                        const defaultIds = prev.map(cl => cl.id);
                        const filtered = mapped.filter(m => !defaultIds.includes(m.id));
                        return [...prev, ...filtered];
                    });
                }
            })
            .catch(err => console.log("Failed to fetch claims, using fallback defaults:", err));
    }, []);

    // Create custom claim
    const handleCreateClaim = (e) => {
        e.preventDefault();
        const created = {
            id: `#CLM-9${claims.length + 80}`,
            name: "Marcus Vance",
            pool: newClaim.pool,
            amount: `$${Number(newClaim.amount).toLocaleString()}`,
            time: "Just Now",
            agent: "Unassigned",
            risk: "Low Risk",
            status: "Pending Agent"
        };
        setClaims([created, ...claims]);
        setShowModal(false);
        setNewClaim({ pool: "Auto", amount: "", reason: "" });
        alert("Claim request submitted successfully!");
    };

    // Update claim status
    const updateClaimStatus = (id, newStatus) => {
        setClaims(claims.map(c => c.id === id ? { ...c, status: newStatus } : c));
    };

    // Render Admin Adjudication view
    const renderAdminClaims = () => (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <DashboardCard title="Total Declared Claims" value="14,821" change="+6.8%" description="vs last billing cycle" indicatorColor="bg-blue-500" />
                <DashboardCard title="Open Claims Under Audit" value="2,390" change="-1.2%" description="actively reviewed" indicatorColor="bg-amber-500" />
                <DashboardCard title="Approved Claims Count" value="9,401" change="+11.4%" description="disbursed seamlessly" indicatorColor="bg-emerald-500" />
                <DashboardCard title="Rejected Claims Count" value="3,030" change="+2.4%" description="flagged for compliance" indicatorColor="bg-rose-500" />
                <DashboardCard title="Avg. Resolution Time" value="4.2 Days" change="-18.4%" description="SLA efficiency gain" indicatorColor="bg-slate-400" />
            </div>

            {/* Filter active tags */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm text-xs font-bold">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-slate-400">Filter Group:</span>
                    <span className="bg-white border border-[#e2e8f0] text-slate-700 px-3 py-2 rounded-lg">Claim Type: All</span>
                    <span className="bg-white border border-[#e2e8f0] text-slate-700 px-3 py-2 rounded-lg">Status: Pending Audit</span>
                    <span className="bg-white border border-[#e2e8f0] text-slate-700 px-3 py-2 rounded-lg">Priority: Critical</span>
                    <span className="bg-white border border-[#e2e8f0] text-slate-700 px-3 py-2 rounded-lg">Date: Last 30 Days</span>
                </div>
                <button className="text-[#2563eb] hover:underline">Reset Active Filters</button>
            </div>

            {/* Claims Ledger */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-slate-900 tracking-tight">Claims Ledger & Status Logs</h2>
                    <a href="/guide" className="text-xs font-bold text-[#2563eb] hover:underline">Adjudication Guide</a>
                </div>

                <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Claim ID</th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Policyholder</th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Coverage Pool</th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Claim Amount</th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Declared</th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Agent</th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Level</th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Audit Status</th>
                                <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {claims.map((c) => {
                                const isApproved = c.status === "Approved";
                                const isRejected = c.status === "Rejected";
                                const isUnderReview = c.status === "Under Review";
                                
                                const riskColor = c.risk.includes("Severe") ? "text-rose-600" : c.risk.includes("Medium") ? "text-amber-500" : "text-emerald-600";
                                
                                return (
                                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#2563eb]">{c.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{c.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-400">{c.pool}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{c.amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-semibold">{c.time}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-semibold">{c.agent}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${riskColor}`}>{c.risk}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold ${
                                                isApproved ? "bg-emerald-50 text-emerald-700" :
                                                isRejected ? "bg-rose-50 text-rose-700" :
                                                isUnderReview ? "bg-amber-50 text-amber-700" : "bg-orange-50 text-orange-700"
                                            }`}>{c.status}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-bold">
                                            <div className="flex items-center justify-end gap-2">
                                                {c.status !== "Approved" && c.status !== "Rejected" && (
                                                    <>
                                                        <button 
                                                            onClick={() => updateClaimStatus(c.id, "Approved")} 
                                                            className="p-1.5 rounded-lg border border-emerald-100 text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => updateClaimStatus(c.id, "Rejected")} 
                                                            className="p-1.5 rounded-lg border border-rose-100 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                                            title="Reject"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {(c.status === "Approved" || c.status === "Rejected") && (
                                                    <span className="text-slate-400">Processed</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // Render Policyholder (Customer) view
    const renderCustomerClaims = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Claims Adjudication System</h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">Track and register claims</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-[#2563eb] text-white hover:bg-blue-700 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                    <FaPlusCircle className="text-xs" /> File a Claim
                </button>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
                <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Claim ID</th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Coverage Pool</th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Claim Amount</th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Declared</th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Audit Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {claims.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#2563eb]">{c.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-400">{c.pool}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{c.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-semibold">{c.time}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold ${
                                            c.status === "Approved" ? "bg-emerald-50 text-emerald-700" :
                                            c.status === "Rejected" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"
                                        }`}>{c.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <MainLayout>
            <div className="space-y-6 max-w-[1250px] mx-auto">
                {/* Upper Header Control Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e2e8f0]">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Claims Adjudication System
                        </h1>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                            Track, inspect, audit, and resolve cross-risk pool premium damage declarations.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="bg-white border border-[#e2e8f0] text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                            Platform Status: Secure
                        </button>
                        <button className="bg-[#2563eb] text-white hover:bg-blue-700 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer">
                            Export Claims Log
                        </button>
                    </div>
                </div>

                {role === "admin" || role === "agent" ? renderAdminClaims() : renderCustomerClaims()}

                {showModal && (
                    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-2xl shadow-xl w-96 border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">File Insurance Claim</h2>
                            <form onSubmit={handleCreateClaim} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Coverage Pool</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        value={newClaim.pool}
                                        onChange={(e) => setNewClaim({ ...newClaim, pool: e.target.value })}
                                    >
                                        <option value="Auto">Auto</option>
                                        <option value="Property">Property</option>
                                        <option value="Health">Health</option>
                                        <option value="Life">Life</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Claim Amount ($)</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                                        placeholder="Amount requested"
                                        value={newClaim.amount}
                                        onChange={(e) => setNewClaim({ ...newClaim, amount: e.target.value })}
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
                                        Submit Claim
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

export default Claims;
