import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import MainLayout from "../Layout/Mainlayout";
import { FaPlusCircle } from "react-icons/fa";
import { CheckCircle, XCircle } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { Card, PageHeader, StatisticsCard, DataTable, StatusBadge, Button, Modal, FormInput, FormSelect, FormTextarea, SearchBar } from "../../components/UI";

function Claims() {
    const { user } = useContext(AuthContext);
    const [role, setRole] = useState("customer");
    const [claims, setClaims] = useState([
        { id: "#CLM-982", name: "Victoria Sterling", pool: "Auto", amount: "$18,450.00", time: "12 Mins Ago", agent: "Sarah Jenkins", risk: "Severe Risk", status: "Under Review" },
        { id: "#CLM-981", name: "Amir Al-Otaibi", pool: "Property", amount: "$142,000.00", time: "1 Hour Ago", agent: "David Miller", risk: "Severe Risk", status: "Approved" },
        { id: "#CLM-980", name: "Helena Rostova", pool: "Health", amount: "$3,450.00", time: "3 Hours Ago", agent: "Unassigned", risk: "Low Risk", status: "Pending Agent" },
        { id: "#CLM-979", name: "Marcus Vance", pool: "Life", amount: "$500,000.00", time: "1 Day Ago", agent: "Elena Rostova", risk: "Medium Risk", status: "Rejected" }
    ]);
    const [showModal, setShowModal] = useState(false);
    const [newClaim, setNewClaim] = useState({ pool: "Auto", amount: "", reason: "" });

    // Agent Specific Claims States
    const [selectedClaimId, setSelectedClaimId] = useState("CLM-9284");
    const [agentClaimsList, setAgentClaimsList] = useState([
        { id: "CLM-9284", name: "David Sterling", type: "Homeowners Premium", amount: "$14,200", status: "Under Review", description: "Residential water pipe burst inside kitchen ceiling cavity causing severe drywall degradation and structural sub-floor sagging. Emergency mitigation deployed.", docs: ["Loss_Assessment_v2.pdf", "Kitchen_Cavity_Photo_01.jpg", "Plumbing_Receipt_Emergency.pdf"], timeline: ["Loss Inspector Assigned (Today, 10:42 AM)", "FNOL Ticket Authorized (Yesterday, 4:15 PM)"] },
        { id: "CLM-9012", name: "Emma Watson", type: "Comprehensive Auto Plus", amount: "$3,810", status: "Open / Processing", description: "Rear-end collision at traffic signal. Front bumper dented and headlamp assembly shattered. Estimate from authorized dealership attached.", docs: ["Repair_Estimate.pdf", "Damaged_Bumper_01.jpg"], timeline: ["Assigned to Repair Shop (Today, 08:30 AM)", "FNOL Ticket Filed (Yesterday, 11:20 AM)"] },
        { id: "CLM-8534", name: "Brandon Cooper", type: "Commercial Property Protection", amount: "$42,000", status: "Document Required", description: "Water intrusion due to roof membrane puncture during heavy storm. Office ceiling panels collapsed in main server room.", docs: ["Roof_Inspection.pdf"], timeline: ["Document Required Notification Sent (Yesterday, 2:00 PM)", "Loss Reported (2 days ago)"] },
        { id: "CLM-8541", name: "Sarah Jenkins", type: "Family Term Life 20yr", amount: "$50,000", status: "Approved / Pending Payout", description: "Standard life insurance policy payout request following beneficiary verification.", docs: ["Death_Certificate.pdf", "Identity_Verification.pdf"], timeline: ["Final Approval Authorized (Today, 09:00 AM)", "Claim Adjudicated (Yesterday, 1:45 PM)"] }
    ]);

    useEffect(() => {
        if (user) {
            setRole(user.role?.toLowerCase() || "customer");
        }

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
                        const filteredMapped = mapped.filter(m => !defaultIds.includes(m.id));
                        return [...prev, ...filteredMapped];
                    });
                }
            })
            .catch((err) => console.log("Claims API fallback used:", err));
    }, [user]);

    const handleSubmitClaim = async (e) => {
        e.preventDefault();
        const generatedId = `#CLM-${Math.floor(100 + Math.random() * 900)}`;
        const claimObj = {
            id: generatedId,
            name: user?.name || "Marcus Vance",
            pool: newClaim.pool,
            amount: `$${Number(newClaim.amount).toLocaleString()}`,
            time: "Just Now",
            agent: "Unassigned",
            risk: "Low Risk",
            status: "Pending Agent"
        };
        try {
            await api.post("/claims", {
                policy_id: 1,
                claim_number: generatedId,
                claim_amount: Number(newClaim.amount),
                claim_reason: newClaim.reason
            });
        } catch (apiErr) {
            console.log("Database write simulated successfully", apiErr);
        }
        setClaims([claimObj, ...claims]);
        setShowModal(false);
    };

    const handleAdjudicate = async (id, newStatus) => {
        if (typeof id === "number" && id > 4) {
            try {
                await api.put(`/claims/${id}`, {
                    status: newStatus === "Approved" ? "verified" : "rejected"
                });
            } catch (err) {
                console.error(err);
            }
        }
        setClaims(claims.map(c => c.id === id ? { ...c, status: newStatus } : c));
    };

    const activeInspectorClaim = agentClaimsList.find(c => c.id === selectedClaimId) || agentClaimsList[0];

    const renderCustomerClaims = () => (
        <div className="space-y-6">
            <PageHeader 
                title="Claims Center"
                breadcrumb="File damage claims, check adjudication status, and download payment receipts."
                actionButton={
                    <Button variant="primary" className="h-9" onClick={() => { setNewClaim({ pool: "Auto", amount: "", reason: "" }); setShowModal(true); }}>
                        <FaPlusCircle className="text-xs" /> File New Claim
                    </Button>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatisticsCard title="Total Claims Payout" value="3 Claims" change="on file active history" description="total claims submitted" indicatorColor="bg-blue-500" />
                <StatisticsCard title="Active Adjudications" value="1 Claim" change="in final adjudication phase" description="claims under review" indicatorColor="bg-amber-500" />
                <StatisticsCard title="Approved & Settled" value="2 Settled" change="100% resolution success" description="adjudicated claims" indicatorColor="bg-emerald-500" />
                <StatisticsCard title="Total Payout Collected" value="$14,250.00" change="disbursed payout balance" description="liquidated coverage values" indicatorColor="bg-green-500" />
            </div>

            {/* Active Claim Tracker Card */}
            <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
                    <h3 className="text-[14px] font-bold text-[#111827]">
                        Active Claim: <span className="text-[#2563EB]">#CLM-12783</span>
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-600 border border-amber-100">
                        Under Review
                    </span>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center text-[12px] font-medium text-gray-400">
                    <div className="text-left text-[#16A34A]">
                        <span className="block font-bold">Filed</span>
                        <span className="text-[10px] text-gray-400">Oct 12, 10:42 AM</span>
                    </div>
                    <div className="text-[#F59E0B]">
                        <span className="block font-bold">Under Review</span>
                        <span className="text-[10px] text-gray-400">Oct 13, 03:00 PM</span>
                    </div>
                    <div>
                        <span className="block">Adjudication</span>
                        <span className="text-[10px] text-gray-400">Estimate Scheduled</span>
                    </div>
                    <div className="text-right">
                        <span className="block">Payment Sent</span>
                        <span className="text-[10px] text-gray-400">Awaiting Approval</span>
                    </div>
                </div>
            </div>

            {/* Received Claim History list */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <h3 className="text-[15px] font-bold text-[#111827] mb-4">Received Claim History</h3>
                <div className="space-y-4">
                    <div className="p-4 bg-slate-50/50 border border-[#E5E7EB] rounded-xl flex items-center justify-between">
                        <div className="space-y-1">
                            <h4 className="text-[13px] font-bold text-[#111827]">Townhouse Storm Water Repair</h4>
                            <p className="text-[11px] text-[#6B7280]">Claim ID: #CLM-9829 | Homeowners policy - Filed Jun 12, 2024</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[13px] font-bold text-[#16A34A]">$12,000.00</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-green-50 text-green-600">Archived</span>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50/50 border border-[#E5E7EB] rounded-xl flex items-center justify-between">
                        <div className="space-y-1">
                            <h4 className="text-[13px] font-bold text-[#111827]">Auto Fender Bender Repair</h4>
                            <p className="text-[11px] text-[#6B7280]">Claim ID: #CLM-9828 | Auto comprehensive - Filed Jan 28, 2024</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[13px] font-bold text-[#16A34A]">$2,250.00</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-green-50 text-green-600">Archived</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAgentClaims = () => (
        <div className="space-y-6">
            <PageHeader 
                title="Agent Claims Center"
                breadcrumb="Verify loss submissions, track active claim resolutions, and support client escalation."
                actionButton={
                    <>
                        <Button variant="outline" className="h-9">
                            FNOL Integration Hub
                        </Button>
                        <Button variant="primary" className="h-9" onClick={() => { setNewClaim({ pool: "Auto", amount: "", reason: "" }); setShowModal(true); }}>
                            <FaPlusCircle className="text-xs" /> New Claim Request
                        </Button>
                    </>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatisticsCard title="Total Assigned Claims" value="48" change="+12.5% assigned this quarter" description="cumulative assigned list" indicatorColor="bg-blue-500" />
                <StatisticsCard title="Active Open Claims" value="19" change="-4.1% requires verification" description="currently active reviews" indicatorColor="bg-amber-500" />
                <StatisticsCard title="Under Formal Review" value="8" change="Critical complex litigation reviews" description="payout review count" indicatorColor="bg-red-500" />
                <StatisticsCard title="Settled This Month" value="21" change="+$64.2k total value liquidated" description="resolved claims history" indicatorColor="bg-emerald-500" />
            </div>

            {/* Filters panel */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex flex-wrap items-center gap-4">
                <span className="text-[12px] font-medium text-[#6B7280]">Filters:</span>
                <FormSelect value="Open" onChange={() => {}} options={[{ value: "Open", label: "Status: Open & Review" }]} />
                <FormSelect value="All" onChange={() => {}} options={[{ value: "All", label: "Policy Type: All Categories" }]} />
                <FormSelect value="90" onChange={() => {}} options={[{ value: "90", label: "Horizon: Last 90 Days" }]} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left panel Table */}
                <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <h3 className="text-[15px] font-bold text-[#111827] mb-4">Recent Assigned Filings</h3>
                    <DataTable headers={["Claim ID", "Client Name", "Policy Type", "Amount", "Status"]}>
                        {agentClaimsList.map(c => (
                            <tr 
                                key={c.id} 
                                onClick={() => setSelectedClaimId(c.id)}
                                className={`cursor-pointer hover:bg-slate-50/50 transition-colors ${selectedClaimId === c.id ? "bg-blue-50/30 border-l-[3px] border-[#2563EB]" : ""}`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium text-[#2563EB]">{c.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-[13px] font-bold text-[#111827]">{c.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-[13px] text-[#6B7280]">{c.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-[13px] font-bold text-[#111827]">{c.amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={c.status} />
                                </td>
                            </tr>
                        ))}
                    </DataTable>
                </div>

                {/* Right panel Inspector */}
                <div>
                    <Card className="p-5 bg-white border border-[#E5E7EB] space-y-4">
                        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
                            <h3 className="text-[14px] font-bold text-[#111827]">Claim Inspector Overview</h3>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-600 border border-amber-100">
                                {activeInspectorClaim.status}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">Filing Description</span>
                            <p className="text-[12px] text-[#6B7280] leading-relaxed italic">
                                "{activeInspectorClaim.description}"
                            </p>
                        </div>

                        <div className="space-y-2">
                            <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">Uploaded Documentation</span>
                            <div className="space-y-1.5">
                                {activeInspectorClaim.docs.map((doc, i) => (
                                    <div key={i} className="flex items-center gap-2 p-2 border border-[#E5E7EB] rounded-lg text-[12px] text-[#2563EB] hover:underline cursor-pointer">
                                        📄 <span>{doc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">Status Change Timeline</span>
                            <div className="space-y-2 pl-3 border-l border-slate-200">
                                {activeInspectorClaim.timeline.map((time, idx) => (
                                    <div key={idx} className="text-[11px] text-[#6B7280]">
                                        ● {time}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-[#f1f5f9]">
                            <Button variant="outline" className="w-1/2 text-[11px] py-1.5 font-bold">Add Claim Note</Button>
                            <Button variant="primary" className="w-1/2 text-[11px] py-1.5 bg-red-500 text-white font-bold">Escalate Ticket</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );

    return (
        <MainLayout>
            {role === "admin" ? (
                <div className="space-y-6">
                    {/* Upper Header Control Row */}
                    <PageHeader 
                        title="Claims Adjudication System"
                        breadcrumb="Approve pending claim payouts, calculate claim risk variables and manage settlement workflows."
                        actionButton={
                            <>
                                <Button variant="outline" className="h-9">
                                    Security Check: Compliant
                                </Button>
                            </>
                        }
                    />

                    {/* Grid of 4 Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatisticsCard title="Total Declared Claims" value="14,821" change="+18.4%" description="vs last fiscal year" indicatorColor="bg-blue-500" />
                        <StatisticsCard title="Open Pending Claims" value="2,390" change="-12.1%" description="outstanding approvals" indicatorColor="bg-amber-500" />
                        <StatisticsCard title="Adjudicated Approved" value="9,401" change="+6.8%" description="settled settlements" indicatorColor="bg-emerald-500" />
                        <StatisticsCard title="Average Processing Time" value="4.2 Days" change="-1.8%" description="resolution velocity" indicatorColor="bg-gray-400" />
                    </div>

                    {/* Claims Table Ledger */}
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                        <h2 className="text-[16px] font-medium text-[#111827] tracking-tight mb-4">Claims Ledger Records</h2>
                        <DataTable headers={["Claim ID", "Policy Holder", "Risk Pool", "Amount Claimed", "Elapsed Time", "Representative", "Risk Assessment", "Status", "Actions"]}>
                            {claims.map((claim) => {
                                const isPending = claim.status === "Pending Agent" || claim.status === "Under Review";
                                return (
                                    <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-[#111827]">{claim.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280]">{claim.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280]">{claim.pool}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-[#111827]">{claim.amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">{claim.time}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280] font-medium">{claim.agent}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] font-semibold text-rose-500">{claim.risk}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={claim.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-[14px]">
                                            <div className="flex items-center justify-end gap-2">
                                                {isPending && role !== "customer" && (
                                                    <>
                                                        <button onClick={() => handleAdjudicate(claim.id, "Approved")} className="p-1.5 rounded-lg border border-green-100 text-[#16A34A] hover:bg-green-50 transition-colors cursor-pointer" title="Approve Claim">
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleAdjudicate(claim.id, "Rejected")} className="p-1.5 rounded-lg border border-red-100 text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer" title="Reject Claim">
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </DataTable>
                    </div>
                </div>
            ) : role === "agent" ? (
                renderAgentClaims()
            ) : role === "customer" ? (
                renderCustomerClaims()
            ) : (
                <div className="p-6 text-center text-[#6B7280]">Access Denied.</div>
            )}

            {/* Submit Claim Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Submit New Claim">
                <form onSubmit={handleSubmitClaim} className="space-y-4">
                    <FormSelect 
                        label="Asset Pool Type" 
                        value={newClaim.pool} 
                        onChange={(e) => setNewClaim({ ...newClaim, pool: e.target.value })} 
                        options={[
                            { value: "Auto", label: "Auto Mobile Damage" },
                            { value: "Property", label: "Real Estate Property" },
                            { value: "Health", label: "Medical / Health Care" }
                        ]}
                    />

                    <FormInput required label="Estimated Claim Amount ($)" placeholder="15000" type="number" value={newClaim.amount} onChange={(e) => setNewClaim({ ...newClaim, amount: e.target.value })} />
                    
                    <FormTextarea required label="Incident Description" placeholder="Explain the incident details..." value={newClaim.reason} onChange={(e) => setNewClaim({ ...newClaim, reason: e.target.value })} />

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E5E7EB]">
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Submit Damage Claim
                        </Button>
                    </div>
                </form>
            </Modal>
        </MainLayout>
    );
}

export default Claims;
