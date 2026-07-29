import { useEffect, useState } from "react";
import api from "../../services/api";
import MainLayout from "../Layout/Mainlayout";
import { FaDownload, FaPlus, FaCalculator, FaExclamationCircle, FaCalendarAlt, FaFileContract, FaPlusCircle, FaQuestionCircle, FaFileDownload, FaShieldAlt } from "react-icons/fa";

function DashboardCard({ title, value, change, description, indicatorColor, changeColor }) {
    const isPositive = change && change.startsWith("+");
    const defaultChangeColor = isPositive ? "text-emerald-600" : "text-rose-600";
    
    return (
        <div className="bg-white shadow-sm border border-[#e2e8f0] rounded-xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</span>
                <span className={`w-2.5 h-2.5 rounded-full ${indicatorColor}`}></span>
            </div>
            <div className="mt-4">
                <h3 className="text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
                <div className="flex items-center gap-1.5 mt-2">
                    <span className={`text-xs font-bold ${changeColor || defaultChangeColor}`}>
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

function Dashboard() {
    const [role, setRole] = useState("admin");
    const [name, setName] = useState("Marcus");
    const [dashboardStats, setDashboardStats] = useState({});

    // Mocks / defaults for Admin activities
    const [adminActivities] = useState([
        { id: 1, user: "Sarah Jenkins", role: "Agent", action: "Approved Claim #CLM-902", time: "10 mins ago", status: "Completed" },
        { id: 2, user: "David Miller", role: "Customer", action: "Submitted New Policy App", time: "1 hr ago", status: "Pending" },
        { id: 3, user: "System Scheduler", role: "Automated", action: "Disbursed Monthly Commission", time: "3 hrs ago", status: "Success" },
        { id: 4, user: "Elena Rostova", role: "Manager", action: "Updated Auto Policy Terms", time: "1 day ago", status: "Completed" },
    ]);

    // Mocks / defaults for Agent active portfolio
    const [portfolioClients] = useState([
        { id: 1, name: "Robert Chen", coverage: "Comprehensive Auto", horizon: "$2,400 / Nov 12, 2024", status: "Active" },
        { id: 2, name: "Claire Sterling", coverage: "Homeowner Standard", horizon: "$1,850 / Dec 04, 2024", status: "Pending Quote" },
        { id: 3, name: "Marcus Broady", coverage: "Family Term Life", horizon: "$980 / Oct 28, 2024", status: "Active" },
        { id: 4, name: "Siddharth Nair", coverage: "Business Risk Umbrella", horizon: "$12,500 / Jan 15, 2025", status: "Awaiting Renewal" },
    ]);

    useEffect(() => {
        const storedRole = sessionStorage.getItem("role") || "admin";
        const storedName = sessionStorage.getItem("name") || "Marcus";
        setRole(storedRole);
        setName(storedName.split(" ")[0]); // Get first name

        // Fetch stats if available
        api.get("/dashboard")
            .then((res) => {
                if (res.data) {
                    setDashboardStats(res.data);
                }
            })
            .catch((err) => console.log("Dashboard API Fetch failed, using design defaults:", err));
    }, []);

    // 1. ADMIN DASHBOARD VIEW
    const renderAdminDashboard = () => {
        const totalPolicies = dashboardStats.totalPolicies ? Number(dashboardStats.totalPolicies).toLocaleString() : "48,924";
        const totalPremium = dashboardStats.totalPremium ? `$${(Number(dashboardStats.totalPremium) / 1000000).toFixed(2)}M` : "$4.82M";

        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e2e8f0]">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Platform Control</h1>
                        <p className="text-xs text-slate-500 font-medium mt-1">Real-time multi-tenant health, compliance and premium cashflow statistics.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="bg-white border border-[#e2e8f0] text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>System Status: Healthy
                        </button>
                        <button className="bg-[#2563eb] text-white hover:bg-blue-700 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer">
                            <FaDownload className="text-xs" />Generate Audit Report
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardCard title="Total Platform Policies" value={totalPolicies} change="14.2%" description="across all risk pools" indicatorColor="bg-blue-500" />
                    <DashboardCard title="Active Pending Claims" value="1,840" change="-4.1%" description="requiring adjudications" indicatorColor="bg-amber-500" />
                    <DashboardCard title="Monthly Premium Revenue" value={totalPremium} change="+8.8%" description="collected this month" indicatorColor="bg-emerald-500" />
                    <DashboardCard title="Avg. Agent Performance" value="9.4 / 10" change="+1.2%" description="weighted SLA rating" indicatorColor="bg-slate-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 lg:col-span-2 flex flex-col justify-between">
                        <div><h2 className="text-sm font-bold text-slate-900 tracking-tight">Premium Revenue Trend (Last 6 Months)</h2></div>
                        <div className="relative w-full h-[220px] mt-6">
                            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                                <line x1="0" y1="50" x2="600" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="0" y1="100" x2="600" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="0" y1="150" x2="600" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                                <path d="M 50,160 Q 150,150 250,110 T 450,115 T 550,60" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
                                <circle cx="250" cy="110" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                                <circle cx="550" cy="60" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                            </svg>
                            <div className="absolute left-2 top-0 flex flex-col justify-between h-full text-[10px] text-slate-400 font-semibold pointer-events-none">
                                <span>$5M</span><span>$3M</span><span>$1M</span>
                            </div>
                        </div>
                        <div className="flex justify-between px-8 text-[11px] text-[#64748b] font-semibold mt-4">
                            <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
                        </div>
                    </div>

                    <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 flex flex-col justify-between">
                        <div><h2 className="text-sm font-bold text-slate-900 tracking-tight">Claims by Category</h2></div>
                        <div className="flex items-center justify-between gap-6 py-6">
                            <div className="relative w-32 h-32 flex-shrink-0">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2563eb" strokeWidth="4" strokeDasharray="45 55" strokeDashoffset="0" />
                                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="30 70" strokeDashoffset="-45" />
                                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="15 85" strokeDashoffset="-75" />
                                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#94a3b8" strokeWidth="4" strokeDasharray="10 90" strokeDashoffset="-90" />
                                </svg>
                            </div>
                            <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-600">
                                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]"></span><span>Auto (45%)</span></div>
                                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span><span>Property (30%)</span></div>
                                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span><span>Health (15%)</span></div>
                                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8]"></span><span>Life (10%)</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight">Platform Audit & Activity Trail</h2>
                        <a href="/logs" className="text-xs font-bold text-[#2563eb] hover:underline">See System Log</a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {adminActivities.map((act) => {
                                    const isCompleted = act.status === "Completed" || act.status === "Success";
                                    const isPending = act.status === "Pending";
                                    return (
                                        <tr key={act.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{act.user}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-500">{act.role}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{act.action}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-medium">{act.time}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold ${
                                                    isCompleted ? "bg-emerald-50 text-emerald-700" : isPending ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-700"
                                                }`}>{act.status}</span>
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
    };

    // 2. AGENT DASHBOARD VIEW
    const renderAgentDashboard = () => {
        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e2e8f0]">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Agent Sales Center</h1>
                        <p className="text-xs text-slate-500 font-medium mt-1">Performance tracking, client profiles, and active quote cycles.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="bg-white border border-[#e2e8f0] text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">Premium Pipeline Tracker</button>
                        <button className="bg-[#2563eb] text-white hover:bg-blue-700 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer"><FaPlus className="text-xs" />New Client Quote</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardCard title="Active Covered Clients" value="342" change="+5.4%" description="total policies under care" indicatorColor="bg-blue-500" />
                    <DashboardCard title="Policies Sold (This Month)" value="28" change="+20.1%" description="vs 15 expected quota" indicatorColor="bg-emerald-500" />
                    <DashboardCard title="Pending Renewals" value="14" change="Needs Attention" changeColor="text-rose-600" description="due in the next 30 days" indicatorColor="bg-amber-500" />
                    <DashboardCard title="Accrued Commission YTD" value="$18,450" change="+12.4%" description="awaiting next payout cycle" indicatorColor="bg-slate-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 lg:col-span-2 flex flex-col justify-between">
                        <div><h2 className="text-sm font-bold text-slate-900 tracking-tight">Weekly Sales Volume (Last 6 Weeks)</h2></div>
                        <div className="relative w-full h-[220px] mt-6">
                            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                                <line x1="0" y1="66" x2="600" y2="66" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="0" y1="133" x2="600" y2="133" stroke="#f1f5f9" strokeWidth="1" />
                                <path d="M 50,170 T 150,170 Q 250,130 350,140 T 450,90 T 550,50" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                                <circle cx="350" cy="140" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                                <circle cx="550" cy="50" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                            </svg>
                            <div className="absolute left-2 top-0 flex flex-col justify-between h-full text-[10px] text-slate-400 font-semibold pointer-events-none">
                                <span>10</span><span>5</span><span>0</span>
                            </div>
                        </div>
                        <div className="flex justify-between px-8 text-[11px] text-[#64748b] font-semibold mt-4">
                            <span>Wk 35</span><span>Wk 36</span><span>Wk 37</span><span>Wk 38</span><span>Wk 39</span><span>Wk 40</span>
                        </div>
                    </div>

                    <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 flex flex-col justify-between">
                        <div><h2 className="text-sm font-bold text-slate-900 tracking-tight mb-4">Productivity Shortcuts</h2></div>
                        <div className="space-y-4">
                            <button className="w-full flex items-center gap-4 p-4 border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors text-left">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-lg"><FaCalculator /></div>
                                <div><h4 className="text-sm font-bold text-slate-900">Calculate Quote</h4><p className="text-xs text-slate-400 font-medium">Instant multi-line rate generator</p></div>
                            </button>
                            <button className="w-full flex items-center gap-4 p-4 border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors text-left">
                                <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-lg"><FaExclamationCircle /></div>
                                <div><h4 className="text-sm font-bold text-slate-900">First Notice of Loss</h4><p className="text-xs text-slate-400 font-medium">Submit FNOL directly for client</p></div>
                            </button>
                            <button className="w-full flex items-center gap-4 p-4 border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors text-left">
                                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-lg"><FaCalendarAlt /></div>
                                <div><h4 className="text-sm font-bold text-slate-900">Schedule Follow-up</h4><p className="text-xs text-slate-400 font-medium">Book automatic email and call syncs</p></div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
                    <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-4">Active Portfolio Clients</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Client Name</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Policy Coverage</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Annual Premium/Renewal Horizon</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {portfolioClients.map((client) => {
                                    const isActiveState = client.status === "Active";
                                    const isPendingState = client.status === "Pending Quote";
                                    return (
                                        <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{client.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-500">{client.coverage}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-semibold">{client.horizon}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold ${
                                                    isActiveState ? "bg-emerald-50 text-emerald-700" : isPendingState ? "bg-amber-50 text-amber-700" : "bg-yellow-50 text-yellow-700"
                                                }`}>{client.status}</span>
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
    };

    // 3. CUSTOMER DASHBOARD VIEW (Welcome back, Marcus)
    const renderCustomerDashboard = () => {
        return (
            <div className="space-y-6">
                {/* Upper Header Control Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e2e8f0]">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Welcome back, {name}
                        </h1>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                            Manage coverages, submit new claim notices, and review upcoming billings.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="bg-white border border-[#e2e8f0] text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                            Support Desk Available
                        </button>
                        <button className="bg-[#2563eb] text-white hover:bg-blue-700 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer">
                            <FaPlusCircle className="text-xs" />
                            Quick File Claim
                        </button>
                    </div>
                </div>

                {/* Grid of 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardCard
                        title="Your Active Policies"
                        value="2 Policies"
                        change=""
                        description="Auto and Property lines"
                        indicatorColor="bg-blue-500"
                    />
                    <DashboardCard
                        title="Next Payment Due"
                        value="Oct 15, 2024"
                        change="$390.00"
                        changeColor="text-emerald-600"
                        description="Automated credit card pay"
                        indicatorColor="bg-amber-500"
                    />
                    <DashboardCard
                        title="Total Combined Coverage"
                        value="$750,000"
                        change=""
                        description="active aggregate protection"
                        indicatorColor="bg-emerald-500"
                    />
                    <DashboardCard
                        title="Open Claim Status"
                        value="1 Claim"
                        change="Processing"
                        changeColor="text-emerald-600"
                        description="in final medical review"
                        indicatorColor="bg-slate-400"
                    />
                </div>

                {/* Policies & Self-Service Desk */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Active Policies Left Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-2">My Active Policies</h2>
                        
                        {/* Policy 1: Tesla */}
                        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                                    <FaShieldAlt />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">2022 Tesla Model Y</h4>
                                    <p className="text-xs text-slate-400 mt-0.5">Comprehensive Auto · Limits: $100k / $300k Limits</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-slate-400 font-medium block">Premium</span>
                                <span className="text-sm font-bold text-slate-900">$180 / mo</span>
                                <span className="text-[10px] text-slate-400 font-medium block mt-1">Renewal: Dec 15, 2024</span>
                            </div>
                        </div>

                        {/* Policy 2: Townhouse */}
                        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                                    <FaShieldAlt />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">Waterfront Townhouse</h4>
                                    <p className="text-xs text-slate-400 mt-0.5">Homeowners H-3 · Limits: $650k Structure / $100k Personal</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-slate-400 font-medium block">Premium</span>
                                <span className="text-sm font-bold text-slate-900">$210 / mo</span>
                                <span className="text-[10px] text-slate-400 font-medium block mt-1">Renewal: Jul 10, 2025</span>
                            </div>
                        </div>
                    </div>

                    {/* Self-Service Right Column */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-2">Self-Service Desk</h2>
                        <div className="space-y-3">
                            <button className="w-full flex items-center gap-4 p-4 bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors text-left shadow-sm">
                                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-base">
                                    <FaPlusCircle />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900">File a New Claim</h4>
                                    <p className="text-[10px] text-slate-400 font-medium">Notify adjuster team of a loss event</p>
                                </div>
                            </button>

                            <button className="w-full flex items-center gap-4 p-4 bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors text-left shadow-sm">
                                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-base">
                                    <FaQuestionCircle />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900">Request Agent Support</h4>
                                    <p className="text-[10px] text-slate-400 font-medium">Ask questions or demand cover modifications</p>
                                </div>
                            </button>

                            <button className="w-full flex items-center gap-4 p-4 bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors text-left shadow-sm">
                                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-base">
                                    <FaFileDownload />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900">Download Cover Documents</h4>
                                    <p className="text-[10px] text-slate-400 font-medium">Instant download policy binder PDF</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Claims Tracker */}
                <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Active Claims Tracker</h2>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Claim #CLM-40182 — Rear End Auto Collision</p>
                        </div>
                        <a href="/claims" className="text-xs font-bold text-[#2563eb] hover:underline">Claim Ledger</a>
                    </div>

                    {/* Progress tracking line */}
                    <div className="mt-8">
                        <div className="relative w-full h-1 bg-slate-100 rounded-full">
                            {/* Blue completed bar */}
                            <div className="absolute top-0 left-0 w-[50%] h-full bg-[#2563eb] rounded-full"></div>
                        </div>

                        {/* Step Labels */}
                        <div className="grid grid-cols-4 mt-4 text-center">
                            <div className="text-left">
                                <span className="text-[11px] font-bold text-emerald-600 block">Submitted</span>
                                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Sep 12, 10:45 AM</span>
                            </div>
                            <div className="text-center">
                                <span className="text-[11px] font-bold text-emerald-600 block">Under Review</span>
                                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Sep 14, 02:30 PM</span>
                            </div>
                            <div className="text-center opacity-70">
                                <span className="text-[11px] font-bold text-slate-600 block">Adjudication</span>
                                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Estimate Generated</span>
                            </div>
                            <div className="text-right opacity-70">
                                <span className="text-[11px] font-bold text-slate-600 block">Payment Sent</span>
                                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Awaiting final signoff</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <MainLayout>
            <div className="max-w-[1600px] mx-auto">
                {role === "admin" && renderAdminDashboard()}
                {role === "agent" && renderAgentDashboard()}
                {role === "customer" && renderCustomerDashboard()}
            </div>
        </MainLayout>
    );
}

export default Dashboard;