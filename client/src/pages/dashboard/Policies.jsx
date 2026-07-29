import { useEffect, useState } from "react";
import api from "../../services/api";
import MainLayout from "../Layout/Mainlayout";
import { FaSearch, FaFileDownload, FaPlusCircle } from "react-icons/fa";

function DashboardCard({ title, value, change, description, indicatorColor }) {
    const isPositive = change.startsWith("+");
    return (
        <div className="bg-white shadow-sm border border-[#e2e8f0] rounded-xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</span>
                <span className={`w-2.5 h-2.5 rounded-full ${indicatorColor}`}></span>
            </div>
            <div className="mt-4">
                <h3 className="text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
                <div className="flex items-center gap-1.5 mt-2">
                    <span className={`text-xs font-bold ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
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

function Policies() {
    const [role, setRole] = useState("customer");
    const [policies, setPolicies] = useState([
        { id: "POL-9824-A", holder: "Sarah M. Jenkins", type: "Auto (Full)", premium: "$124", coverage: "$250,000", start: "Jan 12, 2024", end: "Jan 12, 2025", status: "Active" },
        { id: "POL-0412-R", holder: "David K. Miller", type: "Property (Fire)", premium: "$480", coverage: "$1,200,000", start: "Mar 01, 2023", end: "Mar 01, 2024", status: "Expired" },
        { id: "POL-8401-H", holder: "James R. Redding", type: "Health (Premium)", premium: "$210", coverage: "$500,000", start: "Feb 14, 2024", end: "Feb 14, 2025", status: "Active" },
        { id: "POL-1184-L", holder: "Thomas S. Shelby", type: "Life (Comprehensive)", premium: "$340", coverage: "$3,000,000", start: "Jun 10, 2019", end: "Jun 10, 2029", status: "Active" },
        { id: "POL-5593-T", holder: "Pamela M. Beesley", type: "Travel (Yearly)", premium: "$45", coverage: "$100,000", start: "Nov 02, 2023", end: "Nov 02, 2024", status: "Pending Renewal" },
        { id: "POL-3490-A", holder: "Elena N. Rostova", type: "Auto (Liability)", premium: "$85", coverage: "$150,000", start: "Sep 20, 2023", end: "Sep 20, 2024", status: "Active" },
        { id: "POL-7294-H", holder: "Siddharth Nair", type: "Health (Standard)", premium: "$150", coverage: "$300,000", start: "Dec 15, 2023", end: "Dec 15, 2024", status: "Active" }
    ]);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("All");

    useEffect(() => {
        const storedRole = sessionStorage.getItem("role") || "admin";
        setRole(storedRole);

        // Fetch policies from database API if available
        api.get("/policies")
            .then(res => {
                if (res.data && res.data.length > 0) {
                    const mapped = res.data.map(p => ({
                        id: `POL-${p.policy_number}`,
                        holder: "Registered Customer",
                        type: p.policy_type,
                        premium: `$${Number(p.premium_amount).toLocaleString()}`,
                        coverage: "$100,000",
                        start: p.start_date,
                        end: p.end_date,
                        status: p.status === "active" ? "Active" : p.status === "expired" ? "Expired" : "Pending Renewal"
                    }));
                    setPolicies(prev => {
                        const defaultIds = prev.map(pl => pl.id);
                        const filteredMapped = mapped.filter(m => !defaultIds.includes(m.id));
                        return [...prev, ...filteredMapped];
                    });
                }
            })
            .catch(err => console.log("Failed to fetch policies from API, using fallback defaults:", err));
    }, []);

    const filteredPolicies = policies.filter(p => {
        const matchesSearch = p.id.toLowerCase().includes(searchTerm.toLowerCase()) || p.holder.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <MainLayout>
            <div className="space-y-6 max-w-[1600px] mx-auto">
                
                {/* Upper Header Control Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e2e8f0]">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Premium Policy Catalog
                        </h1>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                            Track current risk distributions, direct debits, and policy renewal dates.
                        </p>
                    </div>
                    <button className="bg-[#2563eb] text-white hover:bg-blue-700 text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer">
                        Bulk Action Tool
                    </button>
                </div>

                {/* Grid of 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardCard
                        title="Total Covered Policies"
                        value="48,924"
                        change="+8.6%"
                        description="vs last year"
                        indicatorColor="bg-blue-500"
                    />
                    <DashboardCard
                        title="Active Policies"
                        value="42,102"
                        change="+91%"
                        description="stable coverage"
                        indicatorColor="bg-emerald-500"
                    />
                    <DashboardCard
                        title="Expired / Grace Period"
                        value="4,982"
                        change="-4.1%"
                        description="unrenewed pools"
                        indicatorColor="bg-amber-500"
                    />
                    <DashboardCard
                        title="Pending Renewal"
                        value="1,840"
                        change="+1.2%"
                        description="high SLA conversion"
                        indicatorColor="bg-slate-400"
                    />
                </div>

                {/* Search and Filters Control bar */}
                <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                    <div className="flex flex-wrap items-center gap-4 flex-grow">
                        {/* Search Input */}
                        <div className="relative max-w-xs w-full">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <FaSearch className="text-xs" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search by policy ID or holder name..."
                                className="w-full bg-white border border-[#e2e8f0] rounded-lg py-2 pl-9 pr-4 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Type Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500">Type:</span>
                            <select
                                className="bg-white border border-[#e2e8f0] rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="All">All Types</option>
                                <option value="Auto">Auto</option>
                                <option value="Property">Property</option>
                                <option value="Health">Health</option>
                                <option value="Life">Life</option>
                            </select>
                        </div>

                        {/* Status Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500">Status:</span>
                            <select className="bg-white border border-[#e2e8f0] rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none">
                                <option>Active/Pending</option>
                                <option>Active Only</option>
                                <option>Expired Only</option>
                            </select>
                        </div>

                        {/* Date Range Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500">Date Range:</span>
                            <select className="bg-white border border-[#e2e8f0] rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none">
                                <option>Current Quarter</option>
                                <option>Last Quarter</option>
                                <option>Current Year</option>
                            </select>
                        </div>
                    </div>

                    {/* Export button */}
                    <button className="bg-white border border-[#e2e8f0] hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2">
                        <FaFileDownload className="text-xs" />
                        Export Ledger
                    </button>
                </div>

                {/* Policies Table */}
                <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
                    <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Policy ID</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Policy Holder</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pool Type</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Premium / mo</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Coverage Amount</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Effective Date</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiry Date</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {filteredPolicies.map((p) => {
                                    const isActive = p.status === "Active";
                                    const isExpired = p.status === "Expired";
                                    return (
                                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{p.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{p.holder}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-400">{p.type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{p.premium}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-500">{p.coverage}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-semibold">{p.start}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-semibold">{p.end}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold ${
                                                    isActive ? "bg-emerald-50 text-emerald-700" :
                                                    isExpired ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"
                                                }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-100">
                        <span className="text-xs text-slate-400 font-semibold">
                            Showing 1 to {filteredPolicies.length} of {policies.length} entries
                        </span>
                        
                        <div className="flex items-center gap-1 text-xs">
                            <button className="border border-[#e2e8f0] px-3 py-1.5 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">Previous</button>
                            <button className="bg-[#2563eb] text-white px-3 py-1.5 rounded-lg font-bold">1</button>
                            <button className="border border-[#e2e8f0] px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">2</button>
                            <button className="border border-[#e2e8f0] px-3 py-1.5 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">Next</button>
                        </div>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}

export default Policies;
