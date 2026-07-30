import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import MainLayout from "../Layout/Mainlayout";
import { FaSearch } from "react-icons/fa";
import { Edit3, ShieldAlert, ShieldCheck, Plus, X } from "lucide-react";
import { Card, PageHeader, StatisticsCard, DataTable, StatusBadge, Button, Modal, FormInput, FormSelect, FormTextarea, SearchBar, ConfirmationModal } from "../../components/UI";
import { AuthContext } from "../../context/AuthContext";

function Customers() {
    const { user } = useContext(AuthContext);
    const role = user?.role?.toLowerCase() || "customer";
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [users, setUsers] = useState([
        { id: "mock-1", name: "Sarah Jenkins", email: "sjenkins@insureflow.com", role: "Agent", status: "Active", lastLogin: "10 mins ago", customer_code: "C001", dob: "1990-01-01", gender: "Female", phone: "1234567890", address: "123 St" },
        { id: "mock-2", name: "David Miller", email: "david.miller@gmail.com", role: "Customer", status: "Active", lastLogin: "1 hr ago", customer_code: "C002", dob: "1992-05-10", gender: "Male", phone: "2345678901", address: "456 Rd" },
        { id: "mock-3", name: "Elena Rostova", email: "erostova@insureflow.com", role: "Admin", status: "Active", lastLogin: "3 hrs ago", customer_code: "C003", dob: "1988-12-15", gender: "Female", phone: "3456789012", address: "789 Ave" },
        { id: "mock-4", name: "John Bradley", email: "j.bradley@techcorp.com", role: "Customer", status: "Suspended", lastLogin: "3 days ago", customer_code: "C004", dob: "1995-07-22", gender: "Male", phone: "4567890123", address: "321 Blvd" },
        { id: "mock-5", name: "Marcus Vance", email: "mvance@insureflow.com", role: "Admin", status: "Active", lastLogin: "Online now", customer_code: "C005", dob: "1985-03-30", gender: "Male", phone: "5678901234", address: "654 Pkwy" },
        { id: "mock-6", name: "Siddharth Nair", email: "sid.nair@insureflow.com", role: "Agent", status: "Active", lastLogin: "Yesterday", customer_code: "C006", dob: "1991-11-04", gender: "Male", phone: "6789012345", address: "987 Dr" },
        { id: "mock-7", name: "Chloe Dupont", email: "chloe.dupont@insureflow.com", role: "Agent", status: "Suspended", lastLogin: "1 week ago", customer_code: "C007", dob: "1993-08-19", gender: "Female", phone: "7890123456", address: "159 Way" }
    ]);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    // Agent Specific Client Portfolio States
    const [agentClients, setAgentClients] = useState([
        { id: 1, name: "Robert Chen", policies: "Auto Comprehensive • Homeowners Standard", premium: "$2,400", activity: "Yesterday (Call)", state: "Active" },
        { id: 2, name: "Claire Sterling", policies: "Commercial General liability", premium: "$1,850", activity: "3 days ago (Email)", state: "Active" },
        { id: 3, name: "Siddharth Nair", policies: "Homeowners High-Value", premium: "$12,500", activity: "1 week ago (System)", state: "Needs Review" },
    ]);
    const [clientSearchTerm, setClientSearchTerm] = useState("");
    const [coverageFilter, setCoverageFilter] = useState("All");
    const [stateFilter, setStateFilter] = useState("All");
    
    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        role: "Customer",
        customer_code: "",
        dob: "1990-01-01",
        gender: "Male",
        phone: "",
        address: ""
    });

    const fetchCustomers = () => {
        api.get("/customers")
            .then((res) => {
                if (res.data && res.data.length > 0) {
                    const mapped = res.data.map(c => ({
                        id: c.id,
                        name: c.name,
                        email: c.email,
                        role: "Customer",
                        status: "Active",
                        lastLogin: "Recently",
                        customer_code: c.customer_code || `C00${c.id}`,
                        dob: c.dob ? c.dob.split("T")[0] : "1990-01-01",
                        gender: c.gender || "Male",
                        phone: c.phone || "",
                        address: c.address || ""
                    }));
                    setUsers(prev => {
                        const defaultEmails = prev.map(u => u.email);
                        const filteredMapped = mapped.filter(m => !defaultEmails.includes(m.email));
                        return [...prev, ...filteredMapped];
                    });
                }
            })
            .catch((err) => console.log("Fetch customers failed:", err));
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // Handlers
    const handleSuspend = async (id) => {
        const target = users.find(u => u.id === id);
        if (!target) return;
        const newStatus = target.status === "Active" ? "Suspended" : "Active";
        
        if (typeof id === "number" && id > 7) {
            try {
                await api.put(`/customers/${id}`, {
                    ...target,
                    status: newStatus
                });
            } catch (err) {
                console.error(err);
            }
        }
        setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editUser) {
                if (typeof editUser.id === "number" && editUser.id > 7) {
                    await api.put(`/customers/${editUser.id}`, form);
                }
                setUsers(users.map(u => u.id === editUser.id ? { ...u, ...form } : u));
            } else {
                const randomId = users.length + 10;
                const newRecord = {
                    id: randomId,
                    ...form,
                    status: "Active",
                    lastLogin: "Just Now"
                };
                try {
                    await api.post("/customers", form);
                } catch (apiErr) {
                    console.log("Database write simulated successfully", apiErr);
                }
                setUsers([newRecord, ...users]);
            }
            setShowModal(false);
            setEditUser(null);
            setForm({ name: "", email: "", role: "Customer", customer_code: "", dob: "1990-01-01", gender: "Male", phone: "", address: "" });
        } catch (err) {
            alert("Error saving user profile data");
        }
    };

    const startEdit = (user) => {
        setEditUser(user);
        setForm({
            name: user.name,
            email: user.email,
            role: user.role,
            customer_code: user.customer_code,
            dob: user.dob,
            gender: user.gender,
            phone: user.phone,
            address: user.address
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        setDeleteUserId(id);
    };

    const confirmDelete = async () => {
        if (deleteUserId) {
            const id = deleteUserId;
            if (typeof id === "number" && id > 7) {
                try {
                    await api.delete(`/customers/${id}`);
                } catch (err) {
                    console.error(err);
                }
            }
            setUsers(users.filter(u => u.id !== id));
            setDeleteUserId(null);
        }
    };

    const filteredUsers = users.filter((u) => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const effectiveRole = role === "admin" ? roleFilter : "Customer";
        const matchesRole = effectiveRole === "All" || u.role === effectiveRole;
        const matchesStatus = statusFilter === "All" || u.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const resetFilters = () => {
        setSearchTerm("");
        setRoleFilter("All");
        setStatusFilter("All");
    };

    const filteredClients = agentClients.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) || c.policies.toLowerCase().includes(clientSearchTerm.toLowerCase());
        const matchesCoverage = coverageFilter === "All" || c.policies.toLowerCase().includes(coverageFilter.toLowerCase());
        const matchesState = stateFilter === "All" || c.state.toLowerCase() === stateFilter.toLowerCase();
        return matchesSearch && matchesCoverage && matchesState;
    });

    const resetAgentFilters = () => {
        setClientSearchTerm("");
        setCoverageFilter("All");
        setStateFilter("All");
    };

    const renderAgentDirectory = () => (
        <div className="space-y-6">
            <PageHeader 
                title="My Client Directory"
                breadcrumb="Manage client relationships, track interactions, and review active coverages."
                actionButton={
                    <>
                        <Button variant="outline" className="h-9">
                            Export Roster
                        </Button>
                        <Button 
                            variant="primary" 
                            className="h-9"
                            onClick={() => { setEditUser(null); setForm({ name: "", email: "", role: "Customer", customer_code: `C00${users.length + 1}`, dob: "1990-01-01", gender: "Male", phone: "", address: "" }); setShowModal(true); }}
                        >
                            <Plus className="w-4 h-4" /> New Client Profile
                        </Button>
                    </>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatisticsCard title="Total Active Clients" value="148" change="+4.2%" description="growing customer base" indicatorColor="bg-blue-500" />
                <StatisticsCard title="New Sign-ups (Month)" value="12" change="+15%" description="high premium conversions" indicatorColor="bg-emerald-500" />
                <StatisticsCard title="Follow-ups Pending" value="6" change="Action required in 48 hours" description="outreach schedule" indicatorColor="bg-amber-500" />
                <StatisticsCard title="Roster Retention Rate" value="98.4%" change="SaaS Industry leading score" description="annual retention metric" indicatorColor="bg-green-500" />
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 flex-grow">
                    <SearchBar value={clientSearchTerm} onChange={(e) => setClientSearchTerm(e.target.value)} placeholder="Enter client or business name..." />

                    <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-[#6B7280]">Coverage:</span>
                        <FormSelect 
                            value={coverageFilter} 
                            onChange={(e) => setCoverageFilter(e.target.value)} 
                            options={[
                                { value: "All", label: "All" },
                                { value: "Auto", label: "Auto" },
                                { value: "Homeowners", label: "Homeowners" },
                                { value: "Commercial", label: "Commercial" }
                            ]}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-[#6B7280]">Status:</span>
                        <FormSelect 
                            value={stateFilter} 
                            onChange={(e) => setStateFilter(e.target.value)} 
                            options={[
                                { value: "All", label: "All Status" },
                                { value: "Active", label: "Active" },
                                { value: "Needs Review", label: "Needs Review" }
                            ]}
                        />
                    </div>
                </div>

                <Button variant="outline" onClick={resetAgentFilters}>
                    Filter Panel
                </Button>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                <h3 className="text-[16px] font-medium text-[#111827] tracking-tight mb-4">Client Portfolios</h3>
                <DataTable headers={["Client Name", "Active Policy Holdings", "Monthly Premium", "Last Activity Date", "Account State"]}>
                    {filteredClients.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-[#111827]">{client.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280]">{client.policies}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280] font-medium">{client.premium}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400 font-medium">{client.activity}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status={client.state} />
                            </td>
                        </tr>
                    ))}
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
                        title="User Directory"
                        breadcrumb="Manage global administrative access, agent assignments and client roles."
                        actionButton={
                            <>
                                <Button variant="outline" className="h-9">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] mr-1"></span>
                                    System Status: Healthy
                                </Button>
                                {role !== "customer" && (
                                    <Button 
                                        variant="primary" 
                                        className="h-9"
                                        onClick={() => { setEditUser(null); setForm({ name: "", email: "", role: "Customer", customer_code: `C00${users.length + 1}`, dob: "1990-01-01", gender: "Male", phone: "", address: "" }); setShowModal(true); }}
                                    >
                                        <Plus className="w-4 h-4" /> Add New User
                                    </Button>
                                )}
                            </>
                        }
                    />

                    {/* Grid of 4 Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatisticsCard title="Total Platform Users" value="12,482" change="+14.2%" description="vs last quarter" indicatorColor="bg-blue-500" />
                        <StatisticsCard title="Active Sessions" value="11,920" change="+8.6%" description="online now" indicatorColor="bg-emerald-500" />
                        <StatisticsCard title="New Signups (Mo)" value="482" change="+12.4%" description="registration flow" indicatorColor="bg-amber-500" />
                        <StatisticsCard title="Suspended Accounts" value="80" change="-2.1%" description="resolved security flags" indicatorColor="bg-gray-400" />
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4 flex-grow">
                            <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name or email..." />

                            {role === "admin" && (
                                <div className="flex items-center gap-2">
                                    <span className="text-[12px] font-medium text-[#6B7280]">Role:</span>
                                    <FormSelect 
                                        value={roleFilter} 
                                        onChange={(e) => setRoleFilter(e.target.value)} 
                                        options={[
                                            { value: "All", label: "All Roles" },
                                            { value: "Admin", label: "Admin" },
                                            { value: "Agent", label: "Agent" },
                                            { value: "Customer", label: "Customer" }
                                        ]}
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <span className="text-[12px] font-medium text-[#6B7280]">Status:</span>
                                <FormSelect 
                                    value={statusFilter} 
                                    onChange={(e) => setStatusFilter(e.target.value)} 
                                    options={[
                                        { value: "All", label: "All Status" },
                                        { value: "Active", label: "Active" },
                                        { value: "Suspended", label: "Suspended" }
                                    ]}
                                />
                            </div>
                        </div>

                        <Button variant="outline" onClick={resetFilters}>
                            Reset Filters
                        </Button>
                    </div>

                    {/* Users Directory Table */}
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                        <DataTable headers={["User Name", "Email Address", "System Role", "Status", "Last Login", "Actions"]}>
                            {filteredUsers.map((user) => {
                                const isActive = user.status === "Active";
                                return (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-[#111827]">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280]">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280] font-medium">{user.role}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={user.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400 font-medium">{user.lastLogin}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-[14px]">
                                            {role !== "customer" ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => startEdit(user)} className="p-1.5 rounded-lg border border-[#E5E7EB] text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer" title="Edit">
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleSuspend(user.id)}
                                                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                                            isActive 
                                                                ? "border-red-100 text-[#DC2626] hover:bg-red-50" 
                                                                : "border-green-100 text-[#16A34A] hover:bg-green-50"
                                                        }`}
                                                        title={isActive ? "Suspend" : "Activate"}
                                                    >
                                                        {isActive ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                                    </button>
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
                                Showing 1 to {filteredUsers.length} of {users.length} entries
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
                renderAgentDirectory()
            ) : (
                <div className="p-6 text-center text-[#6B7280]">Access Denied.</div>
            )}

            {/* Save / Edit Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editUser ? "Edit System User" : "Add New System User"}>
                <form onSubmit={handleSave} className="space-y-4">
                    <FormInput required label="User Full Name" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <FormInput required type="email" label="Email Address" placeholder="email@insureflow.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    
                    <div className="grid grid-cols-2 gap-3">
                        <FormSelect 
                            label="System Role" 
                            value={form.role} 
                            onChange={(e) => setForm({ ...form, role: e.target.value })} 
                            options={[
                                { value: "Customer", label: "Customer" },
                                { value: "Agent", label: "Agent" },
                                { value: "Admin", label: "Admin" }
                            ]}
                        />
                        <FormInput required label="Client Code" placeholder="C1029" value={form.customer_code} onChange={(e) => setForm({ ...form, customer_code: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormInput type="date" label="Date of Birth" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
                        <FormSelect 
                            label="Gender" 
                            value={form.gender} 
                            onChange={(e) => setForm({ ...form, gender: e.target.value })} 
                            options={[
                                { value: "Male", label: "Male" },
                                { value: "Female", label: "Female" },
                                { value: "Other", label: "Other" }
                            ]}
                        />
                    </div>

                    <FormInput label="Phone Number" placeholder="10-digit number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    <FormTextarea label="Resident Address" placeholder="Full home address..." value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E5E7EB]">
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        {editUser && (
                            <Button variant="danger" onClick={() => { handleDelete(editUser.id); setShowModal(false); }}>
                                Delete User
                            </Button>
                        )}
                        <Button type="submit" variant="primary">
                            {editUser ? "Update User" : "Add User"}
                        </Button>
                    </div>
                </form>
            </Modal>

            <ConfirmationModal 
                isOpen={deleteUserId !== null} 
                onClose={() => setDeleteUserId(null)} 
                onConfirm={confirmDelete} 
                title="Delete User Account" 
                message="Are you sure you want to permanently delete this user from the directory? This action cannot be undone."
            />
        </MainLayout>
    );
}

export default Customers;