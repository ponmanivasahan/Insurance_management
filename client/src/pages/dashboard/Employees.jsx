import { useEffect, useState } from "react";
import api from "../../services/api";
import MainLayout from "../Layout/Mainlayout";
import { FaSearch } from "react-icons/fa";
import { Eye, UserCheck, Plus, X, Trash } from "lucide-react";

function DashboardCard({ title, value, change, description, indicatorColor }) {
    const isPositive = change.startsWith("+") || change.startsWith("Elena") || change.startsWith("Audit");
    
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

function Employees() {
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
    const [slaFilter, setSlaFilter] = useState("All");

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

    // Filter agents list
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
            // Edit Agent
            setAgents(agents.map(a => a.id === editAgent.id ? { ...a, ...form } : a));
            alert("Agent Details Updated!");
        } else {
            // Add Agent
            const newRecord = {
                id: agents.length + 10,
                ...form
            };
            setAgents([newRecord, ...agents]);
            alert("New Agent Created Successfully!");
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
        if (confirm("Remove this agent?")) {
            setAgents(agents.filter(a => a.id !== id));
            alert("Agent removed successfully.");
        }
    };

    const resetFilters = () => {
        setSearchTerm("");
        setRegionFilter("All");
        setSlaFilter("All");
    };

    return (
        <MainLayout>
            <div className="space-y-6 max-w-[1250px] mx-auto">
                
                {/* Upper Header Control Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e2e8f0]">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Agent Performance & Control
                        </h1>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                            Monitor conversion rate metrics, client allocations, and credentialing audits.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="bg-white border border-[#e2e8f0] text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            System Status: Healthy
                        </button>
                        <button 
                            onClick={() => { setEditAgent(null); setForm({ name: "", email: "", region: "North East", clients: 0, policies: 0, revenue: "$0", sla: "8.0/10", status: "Pending" }); setShowModal(true); }}
                            className="bg-[#2563eb] text-white hover:bg-blue-700 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                        >
                            <Plus className="w-4 h-4" /> Approve Pending Agent
                        </button>
                    </div>
                </div>

                {/* Grid of 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardCard title="Total Registered Agents" value="342" change="+3.2%" description="growth rate" indicatorColor="bg-blue-500" />
                    <DashboardCard title="Top Performing Region" value="North East" change="Elena R." description="highest volume" indicatorColor="bg-emerald-500" />
                    <DashboardCard title="Avg. Conversion Rate" value="68.4%" change="+4.1%" description="pipeline velocity" indicatorColor="bg-amber-500" />
                    <DashboardCard title="Pending Applications" value="12" change="Audit req." description="awaiting compliance check" indicatorColor="bg-slate-400" />
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
                                placeholder="Search agent portfolio..."
                                className="w-full bg-white border border-[#e2e8f0] rounded-lg py-2 pl-9 pr-4 text-xs text-slate-700 placeholder-slate-400 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Region Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500">Region:</span>
                            <select
                                className="bg-white border border-[#e2e8f0] rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
                                value={regionFilter}
                                onChange={(e) => setRegionFilter(e.target.value)}
                            >
                                <option value="All">All Regions</option>
                                <option value="North East">North East</option>
                                <option value="South West">South West</option>
                                <option value="Mid West">Mid West</option>
                                <option value="International">International</option>
                                <option value="East Coast">East Coast</option>
                            </select>
                        </div>
                    </div>

                    {/* Reset button */}
                    <button
                        onClick={resetFilters}
                        className="bg-white border border-[#e2e8f0] hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                        Reset
                    </button>
                </div>

                {/* Agents Directory Table */}
                <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
                    <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Agent Name</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Region</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Clients Managed</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Policies Sold</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Revenue Generated</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">SLA Rating</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {filteredAgents.map((agent) => {
                                    const isApproved = agent.status === "Approved";
                                    const slaColor = agent.sla === "N/A" ? "text-slate-400" : "text-emerald-500";
                                    
                                    return (
                                        <tr key={agent.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{agent.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-500">{agent.region}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-semibold">{agent.clients}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-semibold">{agent.policies}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{agent.revenue}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${slaColor}`}>{agent.sla}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold ${
                                                    isApproved ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                                }`}>
                                                    {agent.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => startEdit(agent)} className="p-1.5 rounded-lg border border-[#e2e8f0] text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer" title="View Profile / Edit">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {!isApproved && (
                                                        <button 
                                                            onClick={() => handleApprove(agent.id)}
                                                            className="p-1.5 rounded-lg border border-emerald-100 text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                                                            title="Approve"
                                                        >
                                                            <UserCheck className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
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
                            Showing 1 to {filteredAgents.length} of {agents.length} entries
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

            {/* Edit / Add Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-[400px] border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-slate-800">{editAgent ? "Edit Agent Profile" : "Register Agent"}</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Agent Name</label>
                                <input
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none"
                                    placeholder="Elena Rostova"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none"
                                    placeholder="agent@insureflow.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Region</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none"
                                        value={form.region}
                                        onChange={(e) => setForm({ ...form, region: e.target.value })}
                                    >
                                        <option value="North East">North East</option>
                                        <option value="South West">South West</option>
                                        <option value="Mid West">Mid West</option>
                                        <option value="International">International</option>
                                        <option value="East Coast">East Coast</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">SLA Rating</label>
                                    <input
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none"
                                        placeholder="9.0/10"
                                        value={form.sla}
                                        onChange={(e) => setForm({ ...form, sla: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Clients Count</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none"
                                        value={form.clients}
                                        onChange={(e) => setForm({ ...form, clients: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Policies Sold</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none"
                                        value={form.policies}
                                        onChange={(e) => setForm({ ...form, policies: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                {editAgent && (
                                    <button
                                        type="button"
                                        onClick={() => { handleDelete(editAgent.id); setShowModal(false); }}
                                        className="bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                                    >
                                        <Trash className="w-3.5 h-3.5" /> Remove
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                >
                                    {editAgent ? "Save Changes" : "Create Agent"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}

export default Employees;
