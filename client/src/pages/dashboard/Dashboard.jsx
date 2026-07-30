import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import MainLayout from "../Layout/Mainlayout";
import { FaDownload, FaPlus, FaCalculator, FaCalendarAlt, FaFileContract, FaPlusCircle, FaQuestionCircle, FaFileDownload, FaShieldAlt } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { Card, PageHeader, StatisticsCard, DataTable, StatusBadge, Button, ConfirmationModal, Modal, FormInput, FormSelect } from "../../components/UI";
import toast from "react-hot-toast";

function Dashboard() {
    const { user } = useContext(AuthContext);
    const [role, setRole] = useState("customer");
    const [name, setName] = useState("User");
    const [dashboardStats, setDashboardStats] = useState({});
    const [showAuditModal, setShowAuditModal] = useState(false);

    // Underwriting Shortcut Modals State
    const [showEstimateModal, setShowEstimateModal] = useState(false);
    const [showClausesModal, setShowClausesModal] = useState(false);
    const [showAssessModal, setShowAssessModal] = useState(false);

    // Sub-states for calculator
    const [estValue, setEstValue] = useState("25000");
    const [estRateClass, setEstRateClass] = useState("Low Risk");
    const [calcResult, setCalcResult] = useState(null);

    // Sub-states for clauses
    const [selectedClausePool, setSelectedClausePool] = useState("Auto");

    // Sub-states for dispatch
    const [assessEmail, setAssessEmail] = useState("");
    const [assessDetails, setAssessDetails] = useState("");

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

    const handleConfirmAudit = () => {
        toast.success("Audit report compiled and downloaded successfully!");
        setShowAuditModal(false);
    };

    const handleCalculateRate = (e) => {
        e.preventDefault();
        const base = Number(estValue) * 0.005;
        const modifier = estRateClass === "High Risk" ? 1.5 : estRateClass === "Medium Risk" ? 1.2 : 0.8;
        const result = (base * modifier).toFixed(2);
        setCalcResult(result);
        toast.success("Premium rate estimated!");
    };

    const handleDispatchAssess = (e) => {
        e.preventDefault();
        toast.success(`Risk assessment workflow initiated for client ${assessEmail}!`);
        setShowAssessModal(false);
    };

    useEffect(() => {
        if (user) {
            setRole(user.role?.toLowerCase() || "customer");
            setName(user.name || "User");
        }

        // Fetch stats if available
        api.get("/dashboard")
            .then((res) => {
                if (res.data) {
                    setDashboardStats(res.data);
                }
            })
            .catch((err) => console.log("Dashboard API Fetch failed, using design defaults:", err));
    }, [user]);

    // 1. ADMIN DASHBOARD VIEW
    const renderAdminDashboard = () => {
        const totalPolicies = dashboardStats.totalPolicies ? Number(dashboardStats.totalPolicies).toLocaleString() : "48,924";
        const totalPremium = dashboardStats.totalPremium ? `$${(Number(dashboardStats.totalPremium) / 1000000).toFixed(2)}M` : "$4.82M";

        return (
            <div className="space-y-6">
                <PageHeader 
                    title="System Platform Control" 
                    breadcrumb="Real-time multi-tenant health, compliance and premium cashflow statistics."
                    actionButton={
                        <>
                            <Button variant="outline" className="h-9">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] mr-1"></span>
                                System Status: Healthy
                            </Button>
                            <Button variant="primary" className="h-9" onClick={() => setShowAuditModal(true)}>
                                <FaDownload className="text-xs" /> Generate Audit Report
                            </Button>
                        </>
                    }
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatisticsCard title="Total Platform Policies" value={totalPolicies} change="14.2%" description="across all risk pools" indicatorColor="bg-[#2563EB]" />
                    <StatisticsCard title="Active Pending Claims" value="1,840" change="-4.1%" description="requiring adjudications" indicatorColor="bg-[#F59E0B]" />
                    <StatisticsCard title="Monthly Premium Revenue" value={totalPremium} change="+8.8%" description="collected this month" indicatorColor="bg-[#16A34A]" />
                    <StatisticsCard title="Avg. Agent Performance" value="9.4 / 10" change="+1.2%" description="weighted SLA rating" indicatorColor="bg-gray-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 flex flex-col justify-between">
                        <Card className="h-full flex flex-col justify-between">
                            <h2 className="text-[16px] font-medium text-[#111827] tracking-tight">Premium Revenue Trend (Last 6 Months)</h2>
                            <div className="relative w-full h-[220px] mt-6">
                                <svg viewBox="0 0 500 200" className="w-full h-full">
                                    <defs>
                                        <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25"/>
                                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0"/>
                                        </linearGradient>
                                    </defs>
                                    <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                                    <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                                    <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                                    {/* Step Path Area */}
                                    <path d="M 10 160 L 90 160 L 90 120 L 190 120 L 190 80 L 290 80 L 290 100 L 390 100 L 390 50 L 490 50 L 490 180 L 10 180 Z" fill="url(#indigoGrad)" />
                                    {/* Step Path Line */}
                                    <path d="M 10 160 L 90 160 L 90 120 L 190 120 L 190 80 L 290 80 L 290 100 L 390 100 L 390 50 L 490 50" fill="none" stroke="#6366f1" strokeWidth="2.5" />
                                    <circle cx="10" cy="160" r="4" fill="#6366f1" />
                                    <circle cx="190" cy="120" r="4" fill="#6366f1" />
                                    <circle cx="390" cy="50" r="4" fill="#6366f1" />
                                </svg>
                                <div className="flex justify-between text-[12px] text-[#6B7280] font-medium px-2 mt-2">
                                    <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div>
                        <Card className="h-full flex flex-col justify-between">
                            <h2 className="text-[16px] font-medium text-[#111827] tracking-tight">Claims by Category</h2>
                            <div className="relative flex justify-center items-center h-[180px] mt-6">
                                <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                                    {/* Auto: 40% */}
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2563eb" strokeWidth="12" strokeDasharray="100.53 251.32" strokeDashoffset="0" />
                                    {/* Life: 35% */}
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="87.96 251.32" strokeDashoffset="-100.53" />
                                    {/* Health: 25% */}
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="62.83 251.32" strokeDashoffset="-188.49" />
                                </svg>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center text-[12px] font-semibold mt-4">
                                <div>
                                    <span className="inline-block w-2.5 h-2.5 bg-[#2563eb] rounded-full mr-1.5"></span>
                                    <span className="text-[#111827]">Auto (40%)</span>
                                </div>
                                <div>
                                    <span className="inline-block w-2.5 h-2.5 bg-[#10b981] rounded-full mr-1.5"></span>
                                    <span className="text-[#111827]">Life (35%)</span>
                                </div>
                                <div>
                                    <span className="inline-block w-2.5 h-2.5 bg-[#f59e0b] rounded-full mr-1.5"></span>
                                    <span className="text-[#111827]">Health (25%)</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                    <h2 className="text-[16px] font-medium text-[#111827] tracking-tight mb-4">Audit Trail Logs</h2>
                    <DataTable headers={["User Name", "System Role", "Recent Action", "Timestamp", "Audit Status"]}>
                        {adminActivities.map((a) => (
                            <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-3.5 text-[14px] font-medium text-[#111827]">{a.user}</td>
                                <td className="px-6 py-3.5 text-[14px] text-[#6B7280]">{a.role}</td>
                                <td className="px-6 py-3.5 text-[14px] text-[#6B7280]">{a.action}</td>
                                <td className="px-6 py-3.5 text-[14px] text-gray-400 font-medium">{a.time}</td>
                                <td className="px-6 py-3.5 text-[14px]"><StatusBadge status={a.status === "Success" ? "Active" : "Pending"} /></td>
                            </tr>
                        ))}
                    </DataTable>
                </div>
            </div>
        );
    };

    // 2. AGENT DASHBOARD VIEW
    // 2. AGENT DASHBOARD VIEW
    const renderAgentDashboard = () => (
        <div className="space-y-6">
            <PageHeader 
                title="Agent Sales Center" 
                breadcrumb="Performance tracking, client profiles, and active quote cycles."
                actionButton={
                    <>
                        <Button variant="outline" className="h-9">
                            Premium Pipeline Tracker
                        </Button>
                        <Button variant="primary" className="h-9" onClick={() => { setCalcResult(null); setShowEstimateModal(true); }}>
                            <FaPlusCircle className="text-xs" /> New Client Quote
                        </Button>
                    </>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatisticsCard 
                    title="Active Covered Clients" 
                    value="342" 
                    change="+5.4%" 
                    description="total policies under care" 
                    indicatorColor="bg-[#2563EB]" 
                />
                <StatisticsCard 
                    title="Policies Sold (This Month)" 
                    value="28" 
                    change="+20.1%" 
                    description="vs 15 expected quota" 
                    indicatorColor="bg-[#16A34A]" 
                />
                <StatisticsCard 
                    title="Pending Renewals" 
                    value="14" 
                    change="Needs Attention" 
                    description="due in the next 30 days" 
                    indicatorColor="bg-[#F59E0B]" 
                />
                <StatisticsCard 
                    title="Accrued Commission YTD" 
                    value="$18,450" 
                    change="+12.4%" 
                    description="awaiting next payout cycle" 
                    indicatorColor="bg-gray-400" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="h-full flex flex-col justify-between">
                        <h2 className="text-[16px] font-medium text-[#111827] tracking-tight">Weekly Sales Volume (Last 6 Weeks)</h2>
                        <div className="relative w-full h-[220px] mt-6">
                            <svg viewBox="0 0 500 200" className="w-full h-full">
                                {/* Grid Lines */}
                                <line x1="40" y1="40" x2="490" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="40" y1="105" x2="490" y2="105" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="40" y1="170" x2="490" y2="170" stroke="#e2e8f0" strokeWidth="1" />

                                {/* Trend line starts at Wk 37 */}
                                <path 
                                    d="M 210 170 L 290 120 L 370 140 L 450 80" 
                                    fill="none" 
                                    stroke="#10B981" 
                                    strokeWidth="2.5" 
                                />

                                {/* Highlight points */}
                                <circle cx="210" cy="170" r="3.5" fill="#10B981" />
                                <circle cx="290" cy="120" r="3.5" fill="#10B981" />
                                <circle cx="370" cy="140" r="3.5" fill="#10B981" />
                                <circle cx="450" cy="80" r="3.5" fill="#10B981" />

                                {/* Y-axis Labels */}
                                <text x="30" y="44" textAnchor="end" fill="#94A3B8" fontSize="10">10</text>
                                <text x="30" y="109" textAnchor="end" fill="#94A3B8" fontSize="10">5</text>
                                <text x="30" y="174" textAnchor="end" fill="#94A3B8" fontSize="10">0</text>

                                {/* X-axis Labels */}
                                <text x="50" y="190" textAnchor="middle" fill="#94A3B8" fontSize="10">Wk 35</text>
                                <text x="130" y="190" textAnchor="middle" fill="#94A3B8" fontSize="10">Wk 36</text>
                                <text x="210" y="190" textAnchor="middle" fill="#94A3B8" fontSize="10">Wk 37</text>
                                <text x="290" y="190" textAnchor="middle" fill="#94A3B8" fontSize="10">Wk 38</text>
                                <text x="370" y="190" textAnchor="middle" fill="#94A3B8" fontSize="10">Wk 39</text>
                                <text x="450" y="190" textAnchor="middle" fill="#94A3B8" fontSize="10">Wk 40</text>
                            </svg>
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="h-full flex flex-col justify-between">
                        <h2 className="text-[16px] font-medium text-[#111827] tracking-tight">Productivity Shortcuts</h2>
                        <div className="space-y-4 mt-6">
                            <button 
                                onClick={() => { setCalcResult(null); setShowEstimateModal(true); }}
                                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-slate-50 transition-colors text-left cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
                                        <FaCalculator className="text-[18px]" />
                                    </div>
                                    <div>
                                        <h4 className="text-[13px] font-medium text-[#111827]">Calculate Quote</h4>
                                        <span className="text-[11px] text-[#6B7280]">Instant multi-line rate generator</span>
                                    </div>
                                </div>
                            </button>

                            <button 
                                onClick={() => setShowClausesModal(true)}
                                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-slate-50 transition-colors text-left cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#DC2626]/10 flex items-center justify-center text-[#DC2626]">
                                        <FaQuestionCircle className="text-[18px]" />
                                    </div>
                                    <div>
                                        <h4 className="text-[13px] font-medium text-[#111827]">First Notice of Loss</h4>
                                        <span className="text-[11px] text-[#6B7280]">Submit FNOL directly for client</span>
                                    </div>
                                </div>
                            </button>

                            <button 
                                onClick={() => { setAssessEmail(""); setAssessDetails(""); setShowAssessModal(true); }}
                                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-slate-50 transition-colors text-left cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
                                        <FaCalendarAlt className="text-[18px]" />
                                    </div>
                                    <div>
                                        <h4 className="text-[13px] font-medium text-[#111827]">Schedule Follow-up</h4>
                                        <span className="text-[11px] text-[#6B7280]">Book automatic email and call syncs</span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                <h2 className="text-[16px] font-medium text-[#111827] tracking-tight mb-4">Active Portfolio Clients</h2>
                <DataTable headers={["Client Name", "Policy Coverage", "Annual Premium / Renewal Horizon", "Status"]}>
                    {portfolioClients.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-3.5 text-[14px] font-medium text-[#111827]">{p.name}</td>
                            <td className="px-6 py-3.5 text-[14px] text-[#6B7280]">{p.coverage}</td>
                            <td className="px-6 py-3.5 text-[14px] text-[#6B7280]">{p.horizon}</td>
                            <td className="px-6 py-3.5 text-[14px]"><StatusBadge status={p.status} /></td>
                        </tr>
                    ))}
                </DataTable>
            </div>
        </div>
    );

    // 3. CUSTOMER DASHBOARD VIEW
    const renderCustomerDashboard = () => (
        <div className="space-y-6">
            <PageHeader 
                title={`Welcome back, ${name}`} 
                breadcrumb="Manage coverages, submit new claim requests, and review upcoming billings."
                actionButton={
                    <>
                        <Button variant="outline" className="h-9">
                            Support Desk Analyst
                        </Button>
                        <Button variant="primary" className="h-9">
                            <FaPlusCircle className="text-xs" /> Claim Quick File
                        </Button>
                    </>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatisticsCard title="Your Active Policies" value="2 Policies" change="Associated Property lines" description="active coverage count" indicatorColor="bg-blue-500" />
                <StatisticsCard title="Next Payment Due" value="Oct 15, 2024" change="$350.00 automated draft summary" description="premium billing schedule" indicatorColor="bg-amber-500" />
                <StatisticsCard title="Total Combined Coverage" value="$750,000" change="Active aggregate balance" description="combined limit" indicatorColor="bg-emerald-500" />
                <StatisticsCard title="Open Claim Status" value="1 Claim" change="Processing in final adjudication reviews" description="active claims" indicatorColor="bg-blue-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="h-full flex flex-col justify-between">
                        <h2 className="text-[16px] font-medium text-[#111827] tracking-tight mb-4">My Active Policies</h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50/50 border border-[#E5E7EB] rounded-xl flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-[13px] font-bold text-[#111827]">2023 Tesla Model Y</h4>
                                        <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-green-50 text-green-600">Active</span>
                                    </div>
                                    <p className="text-[11px] text-[#6B7280]">Auto comprehensive • Limits $100K/$300K • Renewal Date: Dec 15, 2024</p>
                                </div>
                                <span className="text-[14px] font-bold text-[#2563EB]">$120 / mo</span>
                            </div>
                            <div className="p-4 bg-slate-50/50 border border-[#E5E7EB] rounded-xl flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-[13px] font-bold text-[#111827]">Waterfront Townhouse</h4>
                                        <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-green-50 text-green-600">Active</span>
                                    </div>
                                    <p className="text-[11px] text-[#6B7280]">Homeowners • Limits $250k Buildings, 150k Personal • Renewal Date: Apr 10, 2025</p>
                                </div>
                                <span className="text-[14px] font-bold text-[#2563EB]">$230 / mo</span>
                            </div>
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="h-full flex flex-col justify-between">
                        <h2 className="text-[16px] font-medium text-[#111827] tracking-tight">Self-Service Desk</h2>
                        <div className="space-y-4 mt-6">
                            <Button variant="outline" className="w-full justify-start py-3"><FaPlusCircle className="text-blue-500" /> File New Claim (instant wizard)</Button>
                            <Button variant="outline" className="w-full justify-start py-3"><FaQuestionCircle className="text-emerald-500" /> Request Agent Support (no credentials)</Button>
                            <Button variant="outline" className="w-full justify-start py-3"><FaFileDownload className="text-purple-500" /> Download Claim Documents</Button>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-bold text-[#111827]">Active Claim Tracker</h3>
                    <div className="flex items-center gap-4 text-[11px]">
                        <span className="text-gray-400">Claim #CLM-90181 — Rear collision bumper</span>
                        <a href="/claims" className="text-blue-600 hover:underline font-semibold">Claim Ledger</a>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center text-[11px] font-medium text-gray-400">
                    <div className="text-left text-[#16A34A]">
                        <span className="block font-bold">● Filed</span>
                        <span className="text-[9px] text-gray-400">Oct 12, 10:42 AM</span>
                    </div>
                    <div className="text-[#16A34A]">
                        <span className="block font-bold">● Under Review</span>
                        <span className="text-[9px] text-gray-400">Oct 13, 03:00 PM</span>
                    </div>
                    <div className="text-gray-300">
                        <span className="block">● Adjudication</span>
                        <span className="text-[9px] text-gray-400">Pending Scheduling</span>
                    </div>
                    <div className="text-right text-gray-300">
                        <span className="block">● Payment Sent</span>
                        <span className="text-[9px] text-gray-400">Awaiting Settlement</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <MainLayout>
            {role === "admin" && renderAdminDashboard()}
            {role === "agent" && renderAgentDashboard()}
            {role === "customer" && renderCustomerDashboard()}

            <ConfirmationModal 
                isOpen={showAuditModal} 
                onClose={() => setShowAuditModal(false)} 
                onConfirm={handleConfirmAudit} 
                title="Generate Audit Report" 
                message="Are you sure you want to compile and generate the system audit report? This will bundle recent multi-tenant premium cashflows and logs."
            />

            {/* Modal 1: Premium Rate Estimation */}
            <Modal isOpen={showEstimateModal} onClose={() => setShowEstimateModal(false)} title="Premium Rate Estimation">
                <form onSubmit={handleCalculateRate} className="space-y-4 pt-2">
                    <FormInput 
                        type="number" 
                        label="Asset Value ($)" 
                        value={estValue} 
                        onChange={(e) => setEstValue(e.target.value)} 
                        required 
                    />
                    <FormSelect 
                        label="Risk Class Rating" 
                        value={estRateClass} 
                        onChange={(e) => setEstRateClass(e.target.value)} 
                        options={[
                            { value: "Low Risk", label: "Low Risk (Auto Tier 1)" },
                            { value: "Medium Risk", label: "Medium Risk (Standard Tier 2)" },
                            { value: "High Risk", label: "High Risk (Surcharge Tier 3)" }
                        ]}
                    />
                    
                    {calcResult !== null && (
                        <div className="p-3 bg-slate-50 border border-[#E5E7EB] rounded-lg">
                            <span className="text-[12px] text-[#6B7280] block">Estimated Premium:</span>
                            <span className="text-[18px] font-bold text-indigo-600">${calcResult} / Month</span>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E5E7EB]">
                        <Button variant="secondary" onClick={() => setShowEstimateModal(false)}>Close</Button>
                        <Button type="submit" variant="primary">Calculate Premium</Button>
                    </div>
                </form>
            </Modal>

            {/* Modal 2: Coverage Clauses Lookup */}
            <Modal isOpen={showClausesModal} onClose={() => setShowClausesModal(false)} title="Coverage Clauses Reference">
                <div className="space-y-4 pt-2">
                    <FormSelect 
                        label="Insurance Line of Business" 
                        value={selectedClausePool} 
                        onChange={(e) => setSelectedClausePool(e.target.value)} 
                        options={[
                            { value: "Auto", label: "Auto Liability & Collision" },
                            { value: "Property", label: "Property Fire & Hazard" },
                            { value: "Life", label: "Life Term Comprehensive" }
                        ]}
                    />

                    <div className="p-4 bg-slate-50 border border-[#E5E7EB] rounded-lg text-[13px] text-[#6B7280] space-y-2">
                        {selectedClausePool === "Auto" && (
                            <>
                                <p><strong>Clause A-12 (Liability):</strong> Pays for third-party bodily injuries up to limits of coverage ($250k standard).</p>
                                <p><strong>Clause A-14 (Collision):</strong> Underwriter covers vehicle repair costs minus designated deductible ($500 standard).</p>
                            </>
                        )}
                        {selectedClausePool === "Property" && (
                            <>
                                <p><strong>Clause P-04 (Hazard & Fire):</strong> Rebuild structures fully up to appraisal cap ($1.2M standard).</p>
                                <p><strong>Clause P-07 (Flooding Exclusions):</strong> Requires explicit supplementary rider attachments to activate.</p>
                            </>
                        )}
                        {selectedClausePool === "Life" && (
                            <>
                                <p><strong>Clause L-01 (Term Life):</strong> Full face-value payout to registered beneficiaries upon verification.</p>
                                <p><strong>Clause L-09 (Exclusions):</strong> Suicide clauses void within the initial 24 months of policy activation.</p>
                            </>
                        )}
                    </div>

                    <div className="flex justify-end pt-2 border-t border-[#E5E7EB]">
                        <Button variant="secondary" onClick={() => setShowClausesModal(false)}>Close</Button>
                    </div>
                </div>
            </Modal>

            {/* Modal 3: Dispatch Risk Assessment */}
            <Modal isOpen={showAssessModal} onClose={() => setShowAssessModal(false)} title="Dispatch Risk Assessment">
                <form onSubmit={handleDispatchAssess} className="space-y-4 pt-2">
                    <FormInput 
                        type="email" 
                        label="Client Email Address" 
                        placeholder="client@gmail.com"
                        value={assessEmail} 
                        onChange={(e) => setAssessEmail(e.target.value)} 
                        required 
                    />
                    <FormInput 
                        label="Risk Asset Description" 
                        placeholder="e.g. 2024 Tesla Model Y / Commercial Real Estate"
                        value={assessDetails} 
                        onChange={(e) => setAssessDetails(e.target.value)} 
                        required 
                    />

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E5E7EB]">
                        <Button variant="secondary" onClick={() => setShowAssessModal(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">Dispatch Assessment</Button>
                    </div>
                </form>
            </Modal>
        </MainLayout>
    );
}

export default Dashboard;