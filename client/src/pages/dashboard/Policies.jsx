import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import MainLayout from "../Layout/Mainlayout";
import { FaFileDownload, FaPlusCircle } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { Card, PageHeader, StatisticsCard, DataTable, StatusBadge, Button, Modal, FormInput, FormSelect, SearchBar, ConfirmationModal } from "../../components/UI";

function Policies() {
    const { user } = useContext(AuthContext);
    const [role, setRole] = useState("customer");
    const [cancelPolicyId, setCancelPolicyId] = useState(null);
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

    // Customer Specific Policy States
    const [customerTab, setCustomerTab] = useState("All");
    const [customerPolicies] = useState([
        { id: "POL-0912-C", name: "2023 Tesla Model Y", type: "Comprehensive automobile", coverage: "$100,000", premium: "$120 / mo", start: "Jan 12, 2024", end: "Jan 12, 2025", status: "Active" },
        { id: "POL-6512-H", name: "Waterfront Townhouse", type: "Homeowners Multi-hazard Protection", coverage: "$850,000", premium: "$230 / mo", start: "Jul 15, 2023", end: "Jul 15, 2025", status: "Active" },
        { id: "POL-1104-L", name: "Term Life Protection", type: "Term Life standard Execution", coverage: "$300,000", premium: "$85 / mo", start: "Mar 10, 2018", end: "Mar 10, 2023", status: "Expired" }
    ]);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        id: "",
        holder: "",
        type: "Auto (Full)",
        premium: "$100",
        coverage: "$250,000",
        start: "2024-01-01",
        end: "2025-01-01",
        status: "Active"
    });

    useEffect(() => {
        if (user) {
            setRole(user.role?.toLowerCase() || "customer");
        }

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
            .catch(err => console.log("Policies API skipped/fallback used:", err));
    }, [user]);

    const handleCreate = async (e) => {
        e.preventDefault();
        const randId = `POL-${Math.floor(1000 + Math.random() * 9000)}`;
        const newPolicy = {
            ...form,
            id: randId
        };
        try {
            await api.post("/policies", {
                customer_id: 1,
                policy_type_id: 1,
                policy_number: randId,
                premium_amount: Number(form.premium.replace("$", "")),
                coverage_amount: 100000,
                start_date: form.start,
                end_date: form.end,
                payment_frequency: "Monthly"
            });
        } catch (apiErr) {
            console.log("Database write simulated successfully", apiErr);
        }
        setPolicies([newPolicy, ...policies]);
        setShowModal(false);
    };

    const handleRenew = (id) => {
        setPolicies(policies.map(p => p.id === id ? { ...p, status: "Active", end: "2026-01-12" } : p));
    };

    const handleCancel = (id) => {
        setCancelPolicyId(id);
    };

    const confirmCancel = () => {
        if (cancelPolicyId) {
            setPolicies(policies.map(p => p.id === cancelPolicyId ? { ...p, status: "Expired" } : p));
            setCancelPolicyId(null);
        }
    };

    const filteredPolicies = policies.filter((p) => {
        const matchesSearch = p.id.toLowerCase().includes(searchTerm.toLowerCase()) || p.holder.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === "All" || p.type.toLowerCase().includes(typeFilter.toLowerCase());
        return matchesSearch && matchesType;
    });

    const resetFilters = () => {
        setSearchTerm("");
        setTypeFilter("All");
    };

    const filteredCustomerPolicies = customerPolicies.filter(p => {
        if (customerTab === "All") return true;
        return p.status === customerTab;
    });

    const renderCustomerPolicies = () => (
        <div className="space-y-6">
            <PageHeader 
                title="My Policies"
                breadcrumb="Online and active premium subscriptions, coverage limits, and claim-making options."
                actionButton={
                    <Button variant="primary" className="h-9">
                        Purchase New Policy
                    </Button>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatisticsCard title="Total Covered" value="3 Policies" change="2 Active, 1 Expired" description="total active contracts" indicatorColor="bg-blue-500" />
                <StatisticsCard title="Combined Aggregate Protection" value="$1,250,000" change="Auto, Liability, Home and Life" description="accrued coverage limit" indicatorColor="bg-emerald-500" />
                <StatisticsCard title="Next Renewal Outflow" value="$435.00" change="Automated payments active" description="scheduled payouts" indicatorColor="bg-blue-600" />
                <StatisticsCard title="Next Policy Renewal" value="Dec 15, 2024" change="Standard Health Coverage" description="upcoming deadline" indicatorColor="bg-amber-500" />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-[#E5E7EB] pb-3">
                {["All", "Active", "Expired"].map(t => (
                    <button 
                        key={t}
                        onClick={() => setCustomerTab(t)}
                        className={`px-4 py-1.5 rounded-lg text-[13px] font-medium cursor-pointer transition-colors ${
                            customerTab === t 
                                ? "bg-[#2563EB] text-white" 
                                : "text-[#6B7280] hover:bg-slate-50"
                        }`}
                    >
                        {t === "All" ? "All Policies" : t === "Active" ? "Active (2)" : "Expired (1)"}
                    </button>
                ))}
            </div>

            {/* Policies Cards List */}
            <div className="space-y-4">
                {filteredCustomerPolicies.map(p => (
                    <div key={p.id} className="p-5 bg-white border border-[#E5E7EB] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] text-lg font-bold">
                                🛡️
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="text-[14px] font-bold text-[#111827]">{p.name}</h4>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.status === "Active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                                        {p.status}
                                    </span>
                                </div>
                                <p className="text-[12px] text-[#6B7280] mt-0.5">{p.type} • Policy: {p.id}</p>
                                <p className="text-[11px] text-gray-400 mt-1">Effective Dates: {p.start} - {p.end}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 text-right">
                            <div className="space-y-0.5">
                                <span className="text-[10px] text-[#6B7280] block uppercase tracking-wider">Coverage Amount</span>
                                <span className="text-[14px] font-bold text-[#111827]">{p.coverage}</span>
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[10px] text-[#6B7280] block uppercase tracking-wider">Premium</span>
                                <span className="text-[14px] font-bold text-[#2563EB]">{p.premium}</span>
                            </div>
                            <Button variant="outline" className="h-9">
                                View Details
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderAgentPolicies = () => (
        <div className="space-y-6">
            <PageHeader 
                title="Policy Portfolio"
                breadcrumb="Track sold products, monitor active coverage states, and review expiration dates."
                actionButton={
                    <>
                        <Button variant="outline" className="h-9">
                            Audit Reports
                        </Button>
                        <Button variant="primary" className="h-9">
                            Run Renewal Campaign
                        </Button>
                    </>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatisticsCard title="Policies Active" value="318" change="+5.4% total live policy contracts" description="total active logs" indicatorColor="bg-blue-500" />
                <StatisticsCard title="Under Contract Coverage" value="$4.8M" change="+12% accrued coverage book value" description="currently active limit" indicatorColor="bg-emerald-500" />
                <StatisticsCard title="Renewals in 30 Days" value="14" change="Action needed to retain" description="payout risks check" indicatorColor="bg-amber-500" />
                <StatisticsCard title="Lapsed (Year)" value="4" change="Low cancellation risk rate" description="lapsed contracts count" indicatorColor="bg-red-500" />
            </div>

            {/* Expirations alert section */}
            <div>
                <h3 className="text-[15px] font-bold text-[#111827] mb-3 flex items-center justify-between">
                    <span>Renewal Horizon Expirations (Next 30 Days)</span>
                    <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">4 High Action Accounts</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1 */}
                    <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[13px] font-bold text-red-800">Robert Chen (Auto Comprehensive)</h4>
                            <span className="text-[10px] font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">EXPIRES IN 4 DAYS</span>
                        </div>
                        <p className="text-[11.5px] text-red-700 leading-relaxed">
                            Robert is currently awaiting confirmation. Automated reminder already triggered via InsureFlow campaign.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[13px] font-bold text-amber-800">Claire Sterling (Business Liability)</h4>
                            <span className="text-[10px] font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">EXPIRES IN 12 DAYS</span>
                        </div>
                        <p className="text-[11.5px] text-amber-700 leading-relaxed">
                            Draft rate prepared. Schedule a followup call with the commercial operations coordinator.
                        </p>
                    </div>
                </div>
            </div>

            {/* Sold Policy Book table */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                <h3 className="text-[15px] font-bold text-[#111827] mb-4">Sold Policy Book</h3>
                <DataTable headers={["Policy ID", "Client Name", "Coverage Type", "Premium Value / Renewal Date", "State"]}>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-blue-600">POL-2023-88</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] font-bold text-[#111827]">Robert Chen</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280]">Auto Comprehensive ($250K Caps)</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#111827] font-medium">$2,400 <span className="text-gray-400 font-normal ml-1">Nov 12, 2024</span></td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status="Active" />
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-blue-600">POL-2023-90</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] font-bold text-[#111827]">Siddharth Nair</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280]">High-Value Homeowners Standard</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#111827] font-medium">$12,500 <span className="text-gray-400 font-normal ml-1">Jan 15, 2025</span></td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status="Active" />
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-blue-600">POL-2023-92</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] font-bold text-[#111827]">Claire Sterling</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280]">Commercial General liability</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#111827] font-medium">$1,850 <span className="text-gray-400 font-normal ml-1">Dec 04, 2024</span></td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status="Pending Renewal" />
                        </td>
                    </tr>
                </DataTable>
            </div>
        </div>
    );

    return (
        <MainLayout>
            {role === "admin" ? (
                <div className="space-y-6">
                    {/* Upper Header Control Row */}
                    <PageHeader 
                        title="Premium Policy Catalog"
                        breadcrumb="Overview of system underwriting pools, coverage clauses and expirations."
                        actionButton={
                            <>
                                <Button variant="outline" className="h-9">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] mr-1"></span>
                                    Live Feeds: Active
                                </Button>
                                <Button 
                                    variant="primary" 
                                    className="h-9"
                                    onClick={() => {
                                        setForm({ id: "", holder: "", type: "Auto (Full)", premium: "$124", coverage: "$250,000", start: "2024-01-01", end: "2025-01-01", status: "Active" });
                                        setShowModal(true);
                                    }}
                                >
                                    <FaPlusCircle className="text-xs" /> Underwrite New Policy
                                </Button>
                            </>
                        }
                    />

                    {/* Grid of 4 Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatisticsCard title="Total Covered Policies" value="48,924" change="+14.2%" description="cumulative active logs" indicatorColor="bg-blue-500" />
                        <StatisticsCard title="Active Risk Pools" value="42,102" change="+8.6%" description="currently paying premiums" indicatorColor="bg-emerald-500" />
                        <StatisticsCard title="Expired / Grace Period" value="4,982" change="-2.1%" description="outstanding invoices" indicatorColor="bg-red-500" />
                        <StatisticsCard title="Pending Renewal Requests" value="1,840" change="Critical SLA" description="adjudication checks" indicatorColor="bg-amber-500" />
                    </div>

                    {/* Search and Filters Control bar */}
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4 flex-grow">
                            <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by ID or holder name..." />

                            <div className="flex items-center gap-2">
                                <span className="text-[12px] font-medium text-[#6B7280]">Type:</span>
                                <FormSelect 
                                    value={typeFilter} 
                                    onChange={(e) => setTypeFilter(e.target.value)} 
                                    options={[
                                        { value: "All", label: "All Types" },
                                        { value: "Auto", label: "Auto" },
                                        { value: "Property", label: "Property" },
                                        { value: "Health", label: "Health" },
                                        { value: "Life", label: "Life" },
                                        { value: "Travel", label: "Travel" }
                                    ]}
                                />
                            </div>
                        </div>

                        <Button variant="outline" onClick={resetFilters}>
                            Reset Filters
                        </Button>
                    </div>

                    {/* Policies Catalog Ledger */}
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                        <DataTable headers={["Policy ID", "Policy Holder", "Pool Type", "Premium / Mo", "Coverage Limit", "Effective Date", "Expiration", "Status", "Actions"]}>
                            {filteredPolicies.map((p) => {
                                const isExpired = p.status === "Expired";
                                return (
                                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-[#111827]">{p.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280]">{p.holder}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280]">{p.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-[#111827]">{p.premium}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400 font-semibold">{p.coverage}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">{p.start}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">{p.end}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={p.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-[14px]">
                                            <div className="flex items-center justify-end gap-2">
                                                {isExpired ? (
                                                    <button onClick={() => handleRenew(p.id)} className="px-2.5 py-1 text-[12px] font-medium rounded-lg border border-[#E5E7EB] text-[#16A34A] hover:bg-green-50 transition-colors cursor-pointer">
                                                        Renew
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleCancel(p.id)} className="px-2.5 py-1 text-[12px] font-medium rounded-lg border border-[#E5E7EB] text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer">
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </DataTable>

                        {/* Table Footer Pagination */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-[#E5E7EB]">
                            <span className="text-[12px] text-[#6B7280]">
                                Showing 1 to {filteredPolicies.length} of {policies.length} entries
                            </span>
                            
                            <div className="flex items-center gap-1">
                                <Button variant="outline" className="px-3 py-1">Previous</Button>
                                <Button variant="primary" className="px-3 py-1 font-bold">1</Button>
                                <Button variant="outline" className="px-3 py-1">2</Button>
                                <Button variant="outline" className="px-3 py-1">Next</Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : role === "agent" ? (
                renderAgentPolicies()
            ) : role === "customer" ? (
                renderCustomerPolicies()
            ) : (
                <div className="p-6 text-center text-[#6B7280]">Access Denied.</div>
            )}

            {/* Create New Policy Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Underwrite New Policy">
                <form onSubmit={handleCreate} className="space-y-4">
                    <FormInput required label="Policy Holder Name" placeholder="Full legal name" value={form.holder} onChange={(e) => setForm({ ...form, holder: e.target.value })} />
                    
                    <div className="grid grid-cols-2 gap-3">
                        <FormSelect 
                            label="Coverage Type" 
                            value={form.type} 
                            onChange={(e) => setForm({ ...form, type: e.target.value })} 
                            options={[
                                { value: "Auto (Full)", label: "Auto (Full)" },
                                { value: "Property (Fire)", label: "Property (Fire)" },
                                { value: "Health (Premium)", label: "Health (Premium)" },
                                { value: "Life (Comprehensive)", label: "Life (Comprehensive)" },
                                { value: "Travel (Yearly)", label: "Travel (Yearly)" }
                            ]}
                        />
                        <FormInput required label="Coverage Limit" placeholder="$250,000" value={form.coverage} onChange={(e) => setForm({ ...form, coverage: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormInput required label="Monthly Premium" placeholder="$124" value={form.premium} onChange={(e) => setForm({ ...form, premium: e.target.value })} />
                        <FormSelect 
                            label="Status" 
                            value={form.status} 
                            onChange={(e) => setForm({ ...form, status: e.target.value })} 
                            options={[
                                { value: "Active", label: "Active" },
                                { value: "Pending Renewal", label: "Pending Renewal" }
                            ]}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormInput type="date" label="Effective Start Date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
                        <FormInput type="date" label="Expiration Date" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} />
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E5E7EB]">
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Underwrite Policy
                        </Button>
                    </div>
                </form>
            </Modal>

            <ConfirmationModal 
                isOpen={cancelPolicyId !== null} 
                onClose={() => setCancelPolicyId(null)} 
                onConfirm={confirmCancel} 
                title="Cancel Policy Agreement" 
                message="Are you sure you want to cancel this policy? The status will be marked as Expired and coverage limits suspended."
            />
        </MainLayout>
    );
}

export default Policies;
