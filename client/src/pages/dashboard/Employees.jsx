import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import MainLayout from "../Layout/Mainlayout";
import { FaSearch } from "react-icons/fa";
import { Eye, UserCheck, Plus, X, Trash } from "lucide-react";
import { Card, PageHeader, StatisticsCard, DataTable, StatusBadge, Button, Modal, FormInput, FormSelect, SearchBar, ConfirmationModal } from "../../components/UI";
import { AuthContext } from "../../context/AuthContext";

function Employees() {
    const { user } = useContext(AuthContext);
    const role = user?.role?.toLowerCase() || "customer";
    const [deleteAgentId, setDeleteAgentId] = useState(null);
    const [agents, setAgents] = useState([
        { id: "mock-1", name: "Elena Rostova", region: "North East", clients: 148, policies: 312, revenue: "$1.24M", sla: "9.8/10", status: "Approved", email: "erostova@insureflow.com" },
        { id: "mock-2", name: "Sarah Jenkins", region: "South West", clients: 92, policies: 180, revenue: "$840K", sla: "9.2/10", status: "Approved", email: "sjenkins@insureflow.com" },
        { id: "mock-3", name: "Siddharth Nair", region: "Mid West", clients: 110, policies: 204, revenue: "$910K", sla: "9.5/10", status: "Approved", email: "sid.nair@insureflow.com" },
        { id: "mock-4", name: "Raymond Reddington", region: "International", clients: 240, policies: 580, revenue: "$3.40M", sla: "8.7/10", status: "Approved", email: "raymond@blacklist.com" },
        { id: "mock-5", name: "Chloe Dupont", region: "North West", clients: 45, policies: 60, revenue: "$180K", sla: "7.8/10", status: "Pending", email: "chloe.dupont@insureflow.com" },
        { id: "mock-6", name: "Douglas Powers", region: "East Coast", clients: 0, policies: 0, revenue: "$0", sla: "N/A", status: "Pending", email: "austin.powers@unlimited.com" }
    ]);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [regionFilter, setRegionFilter] = useState("All");

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [editAgent, setEditAgent] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        region: "North East",
        clients: 0,
        policies: 0,
        revenue: "$0",
        sla: "8.0/10",
        status: "Pending"
    });

    useEffect(() => {
        api.get("/employees")
            .then(res => {
                if (res.data && res.data.length > 0) {
                    const mapped = res.data.map(emp => ({
                        id: emp.id,
                        name: emp.name,
                        region: "Mid West",
                        clients: 24,
                        policies: 48,
                        revenue: "$120K",
                        sla: "8.5/10",
                        status: "Approved",
                        email: emp.email
                    }));
                    setAgents(prev => {
                        const defaultNames = prev.map(a => a.name);
                        const filteredMapped = mapped.filter(m => !defaultNames.includes(m.name));
                        return [...prev, ...filteredMapped];
                    });
                }
            })
            .catch(err => console.log("Employees API skipped/fallback used:", err));
    }, []);

    const filteredAgents = agents.filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRegion = regionFilter === "All" || a.region === regionFilter;
        return matchesSearch && matchesRegion;
    });

    const handleApprove = (id) => {
        setAgents(agents.map(a => a.id === id ? { ...a, status: "Approved" } : a));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (editAgent) {
            setAgents(agents.map(a => a.id === editAgent.id ? { ...a, ...form } : a));
        } else {
            const newRecord = {
                id: agents.length + 10,
                ...form
            };
            setAgents([newRecord, ...agents]);
        }
        setShowModal(false);
        setEditAgent(null);
        setForm({ name: "", email: "", region: "North East", clients: 0, policies: 0, revenue: "$0", sla: "8.0/10", status: "Pending" });
    };

    const startEdit = (agent) => {
        setEditAgent(agent);
        setForm({
            name: agent.name,
            email: agent.email,
            region: agent.region,
            clients: agent.clients,
            policies: agent.policies,
            revenue: agent.revenue,
            sla: agent.sla,
            status: agent.status
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        setDeleteAgentId(id);
    };

    const confirmDelete = () => {
        if (deleteAgentId) {
            setAgents(agents.filter(a => a.id !== deleteAgentId));
            setDeleteAgentId(null);
        }
    };

    const resetFilters = () => {
        setSearchTerm("");
        setRegionFilter("All");
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                
                {/* Upper Header Control Row */}
                <PageHeader 
                    title="Agent Performance & Control"
                    breadcrumb="Monitor conversion rate metrics, client allocations, and credentialing audits."
                    actionButton={
                        <>
                            <Button variant="outline" className="h-9">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] mr-1"></span>
                                System Status: Healthy
                            </Button>
                            {role === "admin" && (
                                <Button 
                                    variant="primary" 
                                    className="h-9"
                                    onClick={() => { setEditAgent(null); setForm({ name: "", email: "", region: "North East", clients: 0, policies: 0, revenue: "$0", sla: "8.0/10", status: "Pending" }); setShowModal(true); }}
                                >
                                    <Plus className="w-4 h-4" /> Register New Agent
                                </Button>
                            )}
                        </>
                    }
                />

                {/* Grid of 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatisticsCard title="Total Registered Agents" value="342" change="+3.2%" description="growth rate" indicatorColor="bg-blue-500" />
                    <StatisticsCard title="Top Performing Region" value="North East" change="Elena R." description="highest volume" indicatorColor="bg-emerald-500" />
                    <StatisticsCard title="Avg. Conversion Rate" value="68.4%" change="+4.1%" description="pipeline velocity" indicatorColor="bg-amber-500" />
                    <StatisticsCard title="Pending Applications" value="12" change="Audit req." description="awaiting compliance check" indicatorColor="bg-gray-400" />
                </div>

                {/* Search and Filters Control bar */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4 flex-grow">
                        <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search agent portfolio..." />

                        <div className="flex items-center gap-2">
                            <span className="text-[12px] font-medium text-[#6B7280]">Region:</span>
                            <FormSelect 
                                value={regionFilter} 
                                onChange={(e) => setRegionFilter(e.target.value)} 
                                options={[
                                    { value: "All", label: "All Regions" },
                                    { value: "North East", label: "North East" },
                                    { value: "South West", label: "South West" },
                                    { value: "Mid West", label: "Mid West" },
                                    { value: "International", label: "International" },
                                    { value: "East Coast", label: "East Coast" }
                                ]}
                            />
                        </div>
                    </div>

                    <Button variant="outline" onClick={resetFilters}>
                        Reset
                    </Button>
                </div>

                {/* Agents Directory Table */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                    <DataTable headers={["Agent Name", "Region", "Clients Managed", "Policies Sold", "Revenue Generated", "SLA Rating", "Status", "Actions"]}>
                        {filteredAgents.map((agent) => {
                            const isApproved = agent.status === "Approved";
                            return (
                                <tr key={agent.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-[#111827]">{agent.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280]">{agent.region}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280] font-medium">{agent.clients}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280] font-medium">{agent.policies}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-[#111827]">{agent.revenue}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#16A34A] font-semibold">{agent.sla}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={agent.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-[14px]">
                                        {role === "admin" ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => startEdit(agent)} className="p-1.5 rounded-lg border border-[#E5E7EB] text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer" title="View Profile / Edit">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {!isApproved && (
                                                    <button 
                                                        onClick={() => handleApprove(agent.id)}
                                                        className="p-1.5 rounded-lg border border-green-100 text-[#16A34A] hover:bg-green-50 transition-colors cursor-pointer"
                                                        title="Approve"
                                                    >
                                                        <UserCheck className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-gray-300">-</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </DataTable>

                    {/* Table Footer Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-[#E5E7EB]">
                        <span className="text-[12px] text-[#6B7280]">
                            Showing 1 to {filteredAgents.length} of {agents.length} entries
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

            {/* Edit / Add Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editAgent ? "Edit Agent Profile" : "Register Agent"}>
                <form onSubmit={handleSave} className="space-y-4">
                    <FormInput required label="Agent Name" placeholder="Elena Rostova" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <FormInput required type="email" label="Email Address" placeholder="agent@insureflow.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    
                    <div className="grid grid-cols-2 gap-3">
                        <FormSelect 
                            label="Region" 
                            value={form.region} 
                            onChange={(e) => setForm({ ...form, region: e.target.value })} 
                            options={[
                                { value: "North East", label: "North East" },
                                { value: "South West", label: "South West" },
                                { value: "Mid West", label: "Mid West" },
                                { value: "International", label: "International" },
                                { value: "East Coast", label: "East Coast" }
                            ]}
                        />
                        <FormInput label="SLA Rating" placeholder="9.0/10" value={form.sla} onChange={(e) => setForm({ ...form, sla: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormInput type="number" label="Clients Count" value={form.clients} onChange={(e) => setForm({ ...form, clients: Number(e.target.value) })} />
                        <FormInput type="number" label="Policies Sold" value={form.policies} onChange={(e) => setForm({ ...form, policies: Number(e.target.value) })} />
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E5E7EB]">
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        {editAgent && (
                            <Button variant="danger" onClick={() => { handleDelete(editAgent.id); setShowModal(false); }}>
                                Remove
                            </Button>
                        )}
                        <Button type="submit" variant="primary">
                            {editAgent ? "Save Changes" : "Create Agent"}
                        </Button>
                    </div>
                </form>
            </Modal>

            <ConfirmationModal 
                isOpen={deleteAgentId !== null} 
                onClose={() => setDeleteAgentId(null)} 
                onConfirm={confirmDelete} 
                title="Remove Agent Account" 
                message="Are you sure you want to permanently remove this agent from the system? This action cannot be undone."
            />
        </MainLayout>
    );
}

export default Employees;
