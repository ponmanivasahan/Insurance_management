import { useState } from "react";
import MainLayout from "../Layout/Mainlayout";
import { Card, PageHeader, StatisticsCard, DataTable, StatusBadge, Button } from "../../components/UI";
import { toast } from "react-hot-toast";

function Commission() {
    const [statements] = useState([
        { id: "POL-7724", name: "David Vance", type: "Umbrella Liability Premium", premium: "$2,850", rate: "12%", commission: "$342.00", status: "Paid / Disbursed" },
        { id: "POL-7102", name: "Amanda Sterling", type: "Comprehensive Business Risk", premium: "$12,400", rate: "14%", commission: "$1,736.00", status: "Pending Payout" },
        { id: "POL-6512", name: "Gregory Peck", type: "Basic Homeowners Standard", premium: "$1,420", rate: "11%", commission: "$156.20", status: "Paid / Disbursed" },
        { id: "POL-6204", name: "Melinda Gates", type: "Whole Family Life coverage", premium: "$890", rate: "11%", commission: "$97.90", status: "Paid / Disbursed" }
    ]);

    return (
        <MainLayout>
            <div className="space-y-6">
                <PageHeader 
                    title="Earnings & Commissions Portfolio"
                    breadcrumb="Live updates of written premium earnings, upcoming payouts, and milestone incentives."
                    actionButton={
                        <Button variant="primary" className="h-9" onClick={() => toast.success("Premium payout request for realized YTD earnings ($54,820) submitted successfully to the billing review center!")}>
                            Request Premium Payout
                        </Button>
                    }
                />

                {/* Grid of 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatisticsCard title="YTD Realized Earnings" value="$54,820" change="+14.2%" description="written premium performance" indicatorColor="bg-blue-500" />
                    <StatisticsCard title="This Month's Earnings" value="$6,840" change="+8.6%" description="current active cycle" indicatorColor="bg-emerald-500" />
                    <StatisticsCard title="Pending Outstandings" value="$1,950" change="Awaiting Cycle" description="processing payout system" indicatorColor="bg-amber-500" />
                    <StatisticsCard title="Q3 Performance Bonus" value="$2,500" change="Unlocked" description="reached next tier award" indicatorColor="bg-red-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bar Chart Card */}
                    <div className="lg:col-span-2">
                        <Card className="h-full flex flex-col justify-between">
                            <h2 className="text-[16px] font-medium text-[#111827] tracking-tight">Earnings Trend Chart (Last 6 Months)</h2>
                            <div className="relative w-full h-[220px] mt-6">
                                <svg viewBox="0 0 500 200" className="w-full h-full">
                                    {/* Grid Lines */}
                                    <line x1="40" y1="40" x2="490" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                                    <line x1="40" y1="105" x2="490" y2="105" stroke="#f1f5f9" strokeWidth="1" />
                                    <line x1="40" y1="170" x2="490" y2="170" stroke="#e2e8f0" strokeWidth="1" />

                                    {/* Y-axis Labels */}
                                    <text x="30" y="44" textAnchor="end" fill="#94A3B8" fontSize="10">$6k</text>
                                    <text x="30" y="109" textAnchor="end" fill="#94A3B8" fontSize="10">$4k</text>
                                    <text x="30" y="174" textAnchor="end" fill="#94A3B8" fontSize="10">$0</text>

                                    {/* Column Bars */}
                                    <rect x="65" y="110" width="30" height="60" fill="#2563EB" rx="4" />
                                    <rect x="135" y="100" width="30" height="70" fill="#2563EB" rx="4" />
                                    <rect x="205" y="105" width="30" height="65" fill="#2563EB" rx="4" />
                                    <rect x="275" y="90" width="30" height="80" fill="#2563EB" rx="4" />
                                    <rect x="345" y="80" width="30" height="90" fill="#2563EB" rx="4" />
                                    <rect x="415" y="65" width="30" height="105" fill="#2563EB" rx="4" />

                                    {/* X-axis Labels */}
                                    <text x="80" y="190" textAnchor="middle" fill="#94A3B8" fontSize="10">May</text>
                                    <text x="150" y="190" textAnchor="middle" fill="#94A3B8" fontSize="10">Jun</text>
                                    <text x="220" y="190" textAnchor="middle" fill="#94A3B8" fontSize="10">Jul</text>
                                    <text x="290" y="190" textAnchor="middle" fill="#94A3B8" fontSize="10">Aug</text>
                                    <text x="360" y="190" textAnchor="middle" fill="#94A3B8" fontSize="10">Sep</text>
                                    <text x="430" y="190" textAnchor="middle" fill="#94A3B8" fontSize="10">Oct</text>
                                </svg>
                            </div>
                        </Card>
                    </div>

                    {/* Milestone Card */}
                    <div>
                        <Card className="h-full flex flex-col justify-between">
                            <div>
                                <h2 className="text-[16px] font-medium text-[#111827] tracking-tight">Incentive Milestone Tier</h2>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-[13px] font-semibold text-[#111827]">Elite Premium tier</span>
                                    <span className="text-[12px] font-medium text-[#2563EB]">72% Completed</span>
                                </div>
                                {/* Progress Bar */}
                                <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-[#2563EB] h-full" style={{ width: "72%" }}></div>
                                </div>
                                <p className="text-[11.5px] text-[#6B7280] mt-3 leading-relaxed">
                                    Collect another <strong className="text-[#111827]">$3,420</strong> in written monthly premium to qualify for the 14% elite rate bump tier.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-[#f1f5f9] mt-6 space-y-2">
                                <div className="flex items-center justify-between text-[13px]">
                                    <span className="text-[#6B7280]">Current rate payout</span>
                                    <span className="font-semibold text-[#111827]">11.5% Base</span>
                                </div>
                                <div className="flex items-center justify-between text-[13px]">
                                    <span className="text-[#6B7280]">Upcoming expected rate</span>
                                    <span className="font-semibold text-[#16A34A]">14.0% Elite</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Policy Commission Statement */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                    <h3 className="text-[16px] font-medium text-[#111827] tracking-tight mb-4">Policy Commission Statement</h3>
                    <DataTable headers={["Policy ID", "Client Name", "Coverage Type", "Premium Paid", "Rate", "Your Commission", "Status"]}>
                        {statements.map((s) => (
                            <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-[#2563EB]">{s.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-[#111827]">{s.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280]">{s.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#111827] font-medium">{s.premium}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280]">{s.rate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#2563EB] font-bold">{s.commission}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={s.status} />
                                </td>
                            </tr>
                        ))}
                    </DataTable>
                </div>
            </div>
        </MainLayout>
    );
}

export default Commission;
