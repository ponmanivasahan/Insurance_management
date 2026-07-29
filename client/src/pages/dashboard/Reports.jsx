import { useEffect, useState } from "react";
import api from "../../services/api";
import MainLayout from "../Layout/Mainlayout";
import { FaSyncAlt } from "react-icons/fa";

function Reports() {
    const [stats, setStats] = useState({
        totalPremium: "$4.82M"
    });

    useEffect(() => {
        api.get("/dashboard")
            .then(res => {
                if (res.data && res.data.totalPremium) {
                    setStats({
                        totalPremium: `$${(Number(res.data.totalPremium) / 1000000).toFixed(2)}M`
                    });
                }
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <MainLayout>
            <div className="space-y-6 max-w-[1600px] mx-auto">
                
                {/* Upper Header Control Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e2e8f0]">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Analytics & Reporting Engine
                        </h1>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                            Audit platform health, revenue metrics, performance statistics, and loss ratio trends.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="bg-white border border-[#e2e8f0] text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                            Platform Status: Secure
                        </button>
                        <button className="bg-[#2563eb] text-white hover:bg-blue-700 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer">
                            Generate Live Report
                        </button>
                    </div>
                </div>

                {/* Live Parameter Panel */}
                <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                    <div className="flex flex-wrap items-center gap-4 flex-grow text-xs text-slate-500 font-semibold">
                        <span>Live Parameter Panel:</span>
                        <div className="bg-white border border-[#e2e8f0] px-3 py-2 rounded-lg text-slate-700">
                            Period: Last 6 Months
                        </div>
                        <div className="bg-white border border-[#e2e8f0] px-3 py-2 rounded-lg text-slate-700">
                            Breakdown: Multi-Tenant Pool
                        </div>
                    </div>
                    <button className="bg-[#2563eb] text-white hover:bg-blue-700 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer">
                        <FaSyncAlt className="text-xs" />
                        Refresh Datasets
                    </button>
                </div>

                {/* Charts Row: Cashflow Line Chart & Claims Distribution Donut Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Premium Cashflow Line Chart */}
                    <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 lg:col-span-2 flex flex-col justify-between shadow-sm">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                                Platform Premium Cashflow (Last 6 Months)
                            </h2>
                        </div>
                        
                        <div className="relative w-full h-[220px] mt-6">
                            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                                <line x1="0" y1="50" x2="600" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="0" y1="100" x2="600" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="0" y1="150" x2="600" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                                
                                <path
                                    d="M 50,160 Q 150,150 250,110 T 450,115 T 550,60"
                                    fill="none"
                                    stroke="#2563eb"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                />
                                
                                <circle cx="250" cy="110" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                                <circle cx="550" cy="60" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                            </svg>
                            
                            <div className="absolute left-2 top-0 flex flex-col justify-between h-full text-[9px] text-slate-400 font-semibold pointer-events-none">
                                <span>$6.0M</span>
                                <span>$4.0M</span>
                                <span>$2.0M</span>
                                <span>$0</span>
                            </div>
                        </div>

                        <div className="flex justify-between px-8 text-[11px] text-[#64748b] font-semibold mt-4">
                            <span>May</span>
                            <span>Jun</span>
                            <span>Jul</span>
                            <span>Aug</span>
                            <span>Sep</span>
                            <span>Oct</span>
                        </div>
                    </div>

                    {/* Declared Claims Distribution */}
                    <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 flex flex-col justify-between shadow-sm">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                                Declared Claims Distribution
                            </h2>
                        </div>

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
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]"></span>
                                    <span>Auto Policies (45%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
                                    <span>Property Damage (30%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span>
                                    <span>Health / Injury (15%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8]"></span>
                                    <span>Term Life (10%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Row 2: Top Agent Commission & Policyholder Acquisition Funnel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Top Agent Commission & Closed Volumes */}
                    <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 lg:col-span-2 flex flex-col justify-between shadow-sm">
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-4">
                            Top Agent Commission & Closed Volumes
                        </h2>
                        
                        <div className="space-y-5">
                            {/* Agent 1 */}
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-900 mb-1.5">
                                    <span>Victoria Sterling</span>
                                    <span className="text-[#2563eb] font-semibold">$145k / Mo</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                    <div className="bg-[#2563eb] h-full rounded-full" style={{ width: "70%" }}></div>
                                </div>
                            </div>

                            {/* Agent 2 */}
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-900 mb-1.5">
                                    <span>David Miller</span>
                                    <span className="text-[#2563eb] font-semibold">$112k / Mo</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                    <div className="bg-[#2563eb] h-full rounded-full" style={{ width: "55%" }}></div>
                                </div>
                            </div>

                            {/* Agent 3 */}
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-900 mb-1.5">
                                    <span>Sarah Jenkins</span>
                                    <span className="text-[#2563eb] font-semibold">$98k / Mo</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                    <div className="bg-[#2563eb] h-full rounded-full" style={{ width: "45%" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Policyholder Acquisition Funnel */}
                    <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-4">
                            Policyholder Acquisition Funnel
                        </h2>

                        <div className="space-y-3.5 text-xs">
                            <div className="flex justify-between items-center py-2 border-b border-slate-50 font-bold">
                                <span className="text-[#2563eb]">1. Platform Leads Generated</span>
                                <span className="text-slate-700">100% (24,800)</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-50 font-semibold">
                                <span className="text-slate-600">2. Completed Policy Applications</span>
                                <span className="text-slate-700">68% (16,864)</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-50 font-semibold">
                                <span className="text-slate-600">3. Premium Quote Conversions</span>
                                <span className="text-slate-700">42% (10,416)</span>
                            </div>
                            <div className="flex justify-between items-center py-2 font-semibold">
                                <span className="text-slate-600">4. Underwritten & Active Policies</span>
                                <span className="text-slate-700">24% (5,952)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audit Reports & Downloader Table Card */}
                <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-4">
                        Audit Reports & Downloader
                    </h2>

                    <div className="space-y-4">
                        {/* Report Item 1 */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-slate-100">
                            <div>
                                <h4 className="text-xs font-bold text-slate-950">Monthly Financial Premium Summary</h4>
                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Comprehensive analysis of premium revenue, broker commissions, and automated payout audits.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="bg-white border border-[#2563eb] text-[#2563eb] text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">Download CSV</button>
                                <button className="bg-white border border-[#e2e8f0] text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">Schedule Audit</button>
                            </div>
                        </div>

                        {/* Report Item 2 */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
                            <div>
                                <h4 className="text-xs font-bold text-slate-950">Loss Ratio Audit Report</h4>
                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Disbursed claims vs active premium ledger mapping to evaluate cross-risk pool margin wellness.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="bg-white border border-[#2563eb] text-[#2563eb] text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">Download CSV</button>
                                <button className="bg-white border border-[#e2e8f0] text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">Schedule Audit</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}

export default Reports;
