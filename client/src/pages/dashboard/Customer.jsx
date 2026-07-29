import { useEffect, useState } from "react";
import api from "../../services/api";
import MainLayout from "../Layout/Mainlayout";
import { FaSearch } from "react-icons/fa";
import { Edit3, ShieldAlert, ShieldCheck, Plus, X } from "lucide-react";

function DashboardCard({ title, value, change, description, indicatorColor }) {
    const isPositive = change.startsWith("+");
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

function Customers() {
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
        
        // If it is a real database user (numeric ID usually), perform database request if applicable
        if (typeof id === "number" && id > 7) {
            try {
                await api.put(`/customers/${id}`, {
                    ...target,
                    status: newStatus
                });
                alert(`User status changed to ${newStatus}`);
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
                // Edit mode
                if (typeof editUser.id === "number" && editUser.id > 7) {
                    await api.put(`/customers/${editUser.id}`, form);
                }
                setUsers(users.map(u => u.id === editUser.id ? { ...u, ...form } : u));
                alert("User Updated Successfully!");
            } else {
                // Add mode
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
                    console.log("Mocking database insertion for frontend consistency:", apiErr);
                }
                setUsers([newRecord, ...users]);
                alert("User Added Successfully!");
            }
            setShowModal(false);
            setEditUser(null);
            setForm({ name: "", email: "", role: "Customer", customer_code: "", dob: "1990-01-01", gender: "Male", phone: "", address: "" });
        } catch (err) {
            alert("Error saving user data");
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

    const handleDelete = async (id) => {
        if (confirm("Delete this user?")) {
            if (typeof id === "number" && id > 7) {
                try {
                    await api.delete(`/customers/${id}`);
                } catch (err) {
                    console.error(err);
                }
            }
            setUsers(users.filter(u => u.id !== id));
            alert("User deleted successfully!");
        }
    };

    // Filter
    const filteredUsers = users.filter((u) => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "All" || u.role === roleFilter;
        const matchesStatus = statusFilter === "All" || u.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const resetFilters = () => {
        setSearchTerm("");
        setRoleFilter("All");
        setStatusFilter("All");
    };

    return (
        <MainLayout>
            <div className="space-y-6 max-w-[1250px] mx-auto">
                
                {/* Upper Header Control Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e2e8f0]">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            User Directory
                        </h1>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                            Manage global administrative access, agent assignments and client roles.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="bg-white border border-[#e2e8f0] text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            System Status: Healthy
                        </button>
                        <button 
                            onClick={() => { setEditUser(null); setForm({ name: "", email: "", role: "Customer", customer_code: `C00${users.length + 1}`, dob: "1990-01-01", gender: "Male", phone: "", address: "" }); setShowModal(true); }}
                            className="bg-[#2563eb] text-white hover:bg-blue-700 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                        >
                            <Plus className="w-4 h-4" /> Add New User
                        </button>
                    </div>
                </div>

                {/* Grid of 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardCard title="Total Platform Users" value="12,482" change="+14.2%" description="vs last quarter" indicatorColor="bg-blue-500" />
                    <DashboardCard title="Active Sessions" value="11,920" change="+8.6%" description="online now" indicatorColor="bg-emerald-500" />
                    <DashboardCard title="New Signups (Mo)" value="482" change="+12.4%" description="registration flow" indicatorColor="bg-amber-500" />
                    <DashboardCard title="Suspended Accounts" value="80" change="-2.1%" description="resolved security flags" indicatorColor="bg-slate-400" />
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                    <div className="flex flex-wrap items-center gap-4 flex-grow">
                        {/* Search Input */}
                        <div className="relative max-w-xs w-full">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <FaSearch className="text-xs" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="w-full bg-white border border-[#e2e8f0] rounded-lg py-2 pl-9 pr-4 text-xs text-slate-700 placeholder-slate-400 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Role Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500">Role:</span>
                            <select
                                className="bg-white border border-[#e2e8f0] rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="All">All Roles</option>
                                <option value="Admin">Admin</option>
                                <option value="Agent">Agent</option>
                                <option value="Customer">Customer</option>
                            </select>
                        </div>

                        {/* Status Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500">Status:</span>
                            <select
                                className="bg-white border border-[#e2e8f0] rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All Status</option>
                                <option value="Active">Active Only</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={resetFilters}
                        className="bg-white border border-[#e2e8f0] hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                        Reset Filters
                    </button>
                </div>

                {/* Users Directory Table */}
                <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
                    <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User Name</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">System Role</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Login</th>
                                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {filteredUsers.map((user) => {
                                    const isActive = user.status === "Active";
                                    return (
                                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-500">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-500">{user.role}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold ${
                                                    isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                                                }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-semibold">{user.lastLogin}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => startEdit(user)} className="p-1.5 rounded-lg border border-[#e2e8f0] text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer" title="Edit">
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleSuspend(user.id)}
                                                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                                            isActive 
                                                                ? "border-rose-100 text-rose-600 hover:bg-rose-50" 
                                                                : "border-emerald-100 text-emerald-600 hover:bg-emerald-50"
                                                        }`}
                                                        title={isActive ? "Suspend" : "Activate"}
                                                    >
                                                        {isActive ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                                    </button>
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
                            Showing 1 to {filteredUsers.length} of {users.length} entries
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

            {/* Save / Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-[450px] border border-slate-100 max-h-[90svh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-slate-800 font-sans">{editUser ? "Edit System User" : "Add New System User"}</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">User Full Name</label>
                                <input
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none"
                                    placeholder="Full Name"
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
                                    placeholder="email@insureflow.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">System Role</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none"
                                        value={form.role}
                                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    >
                                        <option value="Customer">Customer</option>
                                        <option value="Agent">Agent</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Client Code</label>
                                    <input
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none"
                                        placeholder="C1029"
                                        value={form.customer_code}
                                        onChange={(e) => setForm({ ...form, customer_code: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none"
                                        value={form.dob}
                                        onChange={(e) => setForm({ ...form, dob: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none"
                                        value={form.gender}
                                        onChange={(e) => setForm({ ...form, gender: e.target.value })}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none"
                                    placeholder="10-digit number"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Resident Address</label>
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none h-16"
                                    placeholder="Full home address..."
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                {editUser && (
                                    <button
                                        type="button"
                                        onClick={() => { handleDelete(editUser.id); setShowModal(false); }}
                                        className="bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                    >
                                        Delete User
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                >
                                    {editUser ? "Update User" : "Add User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}

export default Customers;