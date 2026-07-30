import { useEffect, useState } from "react";
import api from "../../services/api";
import MainLayout from "../Layout/Mainlayout";
import { FaSyncAlt } from "react-icons/fa";
import { Card, PageHeader, StatisticsCard, DataTable, StatusBadge, Button } from "../../components/UI";

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
            <div className="space-y-6">
                
                {/* Upper Header Control Row */}
                <PageHeader 
                    title="Analytics & Reporting Engine"
                    breadcrumb="Audit platform health, revenue metrics, performance statistics, and loss ratio trends."
                    actionButton={
                        <>
                            <Button variant="outline" className="h-9">
                                Platform Status: Secure
                            </Button>
                            <Button variant="primary" className="h-9">
                                Generate Live Report
                            </Button>
                        </>
                    }
                />

                {/* Live Parameter Panel */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4 flex-grow text-[12px] text-[#6B7280]">
                        <span className="font-medium text-[#111827]">Live Parameter Panel:</span>
                        <div className="bg-white border border-[#E5E7EB] px-3 py-1.5 rounded-lg text-[#111827]">
                            Period: Last 6 Months
                        </div>
                        <div className="bg-white border border-[#E5E7EB] px-3 py-1.5 rounded-lg text-[#111827]">
                            Breakdown: Multi-Tenant Pool
                        </div>
                    </div>
                    <Button variant="secondary" className="h-9">
                        <FaSyncAlt className="text-xs mr-1" /> Refresh Datasets
                    </Button>
                </div>

                {/* Premium Cashflow Line Graph and Pie chart */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card className="h-full flex flex-col justify-between">
                            <h2 className="text-[16px] font-medium text-[#111827] tracking-tight">Premium Cashflow Projections</h2>
                            <div className="relative w-full h-[220px] mt-6">
                                <svg viewBox="0 0 500 200" className="w-full h-full">
                                    <defs>
                                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0"/>
                                        </linearGradient>
                                    </defs>
                                    {/* Grid Lines */}
                                    <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                                    <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                                    <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                                    {/* Path Area */}
                                    <path d="M 10 170 Q 120 150 220 110 T 400 70 T 490 50 L 490 190 L 10 190 Z" fill="url(#areaGradient)" />
                                    {/* Path Line */}
                                    <path d="M 10 170 Q 120 150 220 110 T 400 70 T 490 50" fill="none" stroke="#10b981" strokeWidth="2.5" />
                                    {/* Circles */}
                                    <circle cx="10" cy="170" r="4" fill="#10b981" />
                                    <circle cx="220" cy="110" r="4" fill="#10b981" />
                                    <circle cx="490" cy="50" r="4" fill="#10b981" />
                                </svg>
                                <div className="flex justify-between text-[12px] text-[#6B7280] font-medium px-2 mt-2">
                                    <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div>
                        <Card className="h-full flex flex-col justify-between">
                            <h2 className="text-[16px] font-medium text-[#111827] tracking-tight">Declared Claims Distribution</h2>
                            <div className="relative flex justify-center items-center h-[180px] mt-6">
                                <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                                    {/* Auto: 55% */}
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="12" strokeDasharray="138.23 251.32" strokeDashoffset="0" />
                                    {/* Property: 25% */}
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="62.83 251.32" strokeDashoffset="-138.23" />
                                    {/* Others: 20% */}
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="50.26 251.32" strokeDashoffset="-201.06" />
                                </svg>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-semibold mt-4">
                                <div>
                                    <span className="inline-block w-2.5 h-2.5 bg-[#3b82f6] rounded-full mr-1.5"></span>
                                    <span className="text-[#111827]">Auto (55%)</span>
                                </div>
                                <div>
                                    <span className="inline-block w-2.5 h-2.5 bg-[#10b981] rounded-full mr-1.5"></span>
                                    <span className="text-[#111827]">Property (25%)</span>
                                </div>
                                <div>
                                    <span className="inline-block w-2.5 h-2.5 bg-[#f59e0b] rounded-full mr-1.5"></span>
                                    <span className="text-[#111827]">Others (20%)</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Additional Performance stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <h2 className="text-[16px] font-medium text-[#111827] tracking-tight mb-4">Top Agent Closed Volumes</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[12px] font-medium text-[#111827] mb-1">
                                    <span>Elena Rostova</span>
                                    <span>$145K (SLA: 9.8)</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-[#2563EB] h-full" style={{ width: "95%" }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[12px] font-medium text-[#111827] mb-1">
                                    <span>Siddharth Nair</span>
                                    <span>$98K (SLA: 9.5)</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-[#2563EB] h-full" style={{ width: "70%" }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[12px] font-medium text-[#111827] mb-1">
                                    <span>Sarah Jenkins</span>
                                    <span>$82K (SLA: 9.2)</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-[#2563EB] h-full" style={{ width: "60%" }}></div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-[16px] font-medium text-[#111827] tracking-tight mb-4">Acquisition Funnel Status</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[12px] font-medium text-[#111827] mb-1">
                                    <span>Platform Leads</span>
                                    <span>10,480 Users</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full" style={{ width: "90%" }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[12px] font-medium text-[#111827] mb-1">
                                    <span>Registered Quotes</span>
                                    <span>4,821 Applications</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full" style={{ width: "45%" }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[12px] font-medium text-[#111827] mb-1">
                                    <span>Active Underwritten Policies</span>
                                    <span>1,842 Policies</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full" style={{ width: "18%" }}></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Audit Reports List */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                    <h2 className="text-[16px] font-medium text-[#111827] tracking-tight mb-4">Available Audit PDF Reports</h2>
                    <DataTable headers={["Document Title", "Generated Time", "Format Scope", "Action"]}>
                        <tr className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-[#111827]">Premium Revenue Audit (Oct 2024)</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">2 Hours Ago</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280]">Excel / CSV</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] font-semibold text-blue-600">
                                <button className="hover:underline cursor-pointer">Download CSV</button>
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-[#111827]">Compliance & SLA Audit (Q3 2024)</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">1 Day Ago</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280]">Acrobat PDF</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] font-semibold text-blue-600">
                                <button className="hover:underline cursor-pointer">Schedule Audit</button>
                            </td>
                        </tr>
                    </DataTable>
                </div>

            </div>
        </MainLayout>
    );
}

export default Reports;
