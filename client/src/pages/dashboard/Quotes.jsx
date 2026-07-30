import { useState } from "react";
import MainLayout from "../Layout/Mainlayout";
import { Plus } from "lucide-react";
import { Card, PageHeader, StatisticsCard, DataTable, StatusBadge, Button, Modal, FormInput, FormSelect } from "../../components/UI";
import { FaCalculator, FaFileContract, FaPlusCircle, FaQuestionCircle, FaCalendarAlt } from "react-icons/fa";

function Quotes() {
    const [quotes, setQuotes] = useState([
        { id: "QF-2024-89", name: "Robert Chen", type: "Auto Comprehensive Tier 2", premium: "$120 / mo", state: "Accepted" },
        { id: "QF-2024-91", name: "Claire Sterling", type: "Commercial General liability", premium: "$220 / mo", state: "Sent / Pending" },
        { id: "QF-2024-92", name: "Marcus Broady", type: "Starter Liability", premium: "$85 / mo", state: "Draft" }
    ]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newQuote, setNewQuote] = useState({
        name: "",
        type: "Auto Comprehensive Tier 2",
        premium: ""
    });

    const handleCreateQuote = (e) => {
        e.preventDefault();
        const generatedId = `QF-2024-${90 + quotes.length + 1}`;
        setQuotes([
            ...quotes,
            {
                id: generatedId,
                name: newQuote.name,
                type: newQuote.type,
                premium: `$${newQuote.premium} / mo`,
                state: "Draft"
            }
        ]);
        setNewQuote({ name: "", type: "Auto Comprehensive Tier 2", premium: "" });
        setShowCreateModal(false);
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <PageHeader 
                    title="Rate Quotations"
                    breadcrumb="Prepare and monitor custom policy proposals for new leads."
                    actionButton={
                        <>
                            <Button variant="outline" className="h-9">
                                Rate Tables
                            </Button>
                            <Button variant="primary" className="h-9" onClick={() => setShowCreateModal(true)}>
                                <Plus className="w-4 h-4" /> Create New Quote
                            </Button>
                        </>
                    }
                />

                {/* Grid of 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatisticsCard title="New Quotes (Month)" value="42" change="+12.4%" description="leads generated" indicatorColor="bg-blue-500" />
                    <StatisticsCard title="Conversion Success" value="68.2%" change="+5.1%" description="proposal acceptance rate" indicatorColor="bg-emerald-500" />
                    <StatisticsCard title="Avg. Account Value" value="$1,240" change="+3.4%" description="per premium quote" indicatorColor="bg-blue-600" />
                    <StatisticsCard title="Awaiting Customer Response" value="18" change="Requires active agent push" description="follow-ups needed" indicatorColor="bg-amber-500" />
                </div>

                {/* Instant Plan Comparisons */}
                <div>
                    <h3 className="text-[16px] font-medium text-[#111827] tracking-tight mb-4">Instant Plan Comparisons</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Plan 1 */}
                        <Card className="border border-[#E5E7EB] bg-white flex flex-col justify-between p-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[14px] font-bold text-[#111827]">Basic Starter Coverage</h4>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-600">Economy Tier</span>
                                </div>
                                <div className="text-[20px] font-bold text-[#111827]">
                                    $85 <span className="text-[12px] font-normal text-[#6B7280]">/ month</span>
                                </div>
                                <ul className="space-y-2 text-[12px] text-[#6B7280] list-disc list-inside pt-2 border-t border-[#f1f5f9]">
                                    <li>Standard Liability Caps ($100K/$300K)</li>
                                    <li>Basic Claims Concierge Desk</li>
                                    <li>Optional Roadside Assistance Addon</li>
                                </ul>
                            </div>
                        </Card>

                        {/* Plan 2 - Selected/Featured */}
                        <Card className="border-2 border-[#2563EB] bg-white flex flex-col justify-between p-6 relative">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[14px] font-bold text-[#111827]">Gold Premium Protection</h4>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-600">Agent Choice</span>
                                </div>
                                <div className="text-[20px] font-bold text-[#111827]">
                                    $120 <span className="text-[12px] font-normal text-[#6B7280]">/ month</span>
                                </div>
                                <ul className="space-y-2 text-[12px] text-[#6B7280] list-disc list-inside pt-2 border-t border-[#f1f5f9]">
                                    <li>Extended Liability Caps ($250K/$500K)</li>
                                    <li>Comprehensive Car Rental Inclusions</li>
                                    <li>Free Multi-device Telematics Tracker</li>
                                </ul>
                            </div>
                        </Card>

                        {/* Plan 3 */}
                        <Card className="border border-[#E5E7EB] bg-white flex flex-col justify-between p-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[14px] font-bold text-[#111827]">Total Umbrella Umbrella</h4>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-600">High Net Worth</span>
                                </div>
                                <div className="text-[20px] font-bold text-[#111827]">
                                    $220 <span className="text-[12px] font-normal text-[#6B7280]">/ month</span>
                                </div>
                                <ul className="space-y-2 text-[12px] text-[#6B7280] list-disc list-inside pt-2 border-t border-[#f1f5f9]">
                                    <li>High Limit Liability Caps ($1M/Total)</li>
                                    <li>VIP Legal Counsel Protection</li>
                                    <li>Global Coverage Extension Rights</li>
                                </ul>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Quotes Pipeline Table */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                    <h3 className="text-[16px] font-medium text-[#111827] tracking-tight mb-4">Quotes Pipeline</h3>
                    <DataTable headers={["Quote ID", "Client Name", "Coverage Type", "Total Premium", "State"]}>
                        {quotes.map((q) => (
                            <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-[#2563EB]">{q.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-[#111827]">{q.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280]">{q.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#111827] font-medium">{q.premium}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={q.state} />
                                </td>
                            </tr>
                        ))}
                    </DataTable>
                </div>
            </div>

            {/* Create Quote Modal */}
            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Quote">
                <form onSubmit={handleCreateQuote} className="space-y-4">
                    <FormInput required label="Client Name" placeholder="e.g. Robert Chen" value={newQuote.name} onChange={(e) => setNewQuote({ ...newQuote, name: e.target.value })} />
                    <FormSelect 
                        label="Coverage Type" 
                        value={newQuote.type} 
                        onChange={(e) => setNewQuote({ ...newQuote, type: e.target.value })} 
                        options={[
                            { value: "Auto Comprehensive Tier 2", label: "Auto Comprehensive Tier 2" },
                            { value: "Commercial General liability", label: "Commercial General liability" },
                            { value: "Starter Liability", label: "Starter Liability" }
                        ]}
                    />
                    <FormInput required type="number" label="Monthly Premium ($)" placeholder="e.g. 120" value={newQuote.premium} onChange={(e) => setNewQuote({ ...newQuote, premium: e.target.value })} />
                    
                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E5E7EB]">
                        <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Create Draft
                        </Button>
                    </div>
                </form>
            </Modal>
        </MainLayout>
    );
}

export default Quotes;
