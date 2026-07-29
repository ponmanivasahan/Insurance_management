import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaThLarge, FaUsers, FaUserShield, FaFileContract, FaClipboardCheck, FaChartBar, FaSignOutAlt, FaCalendarAlt, FaFileInvoice, FaMoneyBillWave, FaFolderOpen, FaCog } from "react-icons/fa";

function Sidebar() {
    const [role, setRole] = useState("admin");
    const [name, setName] = useState("Marcus Vance");
    const location = useLocation();

    useEffect(() => {
        setRole(sessionStorage.getItem("role") || "admin");
        setName(sessionStorage.getItem("name") || "Marcus Vance");
    }, []);

    const isActive = (path) => {
        return location.pathname === path 
            ? "bg-[#2563eb] text-white" 
            : "text-[#94a3b8] hover:bg-[#1e293b] hover:text-white";
    };

    return (
        <div className="w-64 h-screen bg-[#0b1329] border-r border-[#1e293b] text-white fixed flex flex-col justify-between z-40">
            <div>
                {/* Brand / Logo */}
                <div className="flex items-center gap-3 px-6 py-5">
                    <div className="w-9 h-9 rounded-xl bg-[#2563eb] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-base font-bold tracking-wide text-white leading-none">
                            InsureFlow
                        </h2>
                        <span className="text-[10px] text-[#64748b] font-semibold uppercase tracking-wider">
                            {role === "admin" ? "SYSTEM ADMIN" : role === "agent" ? "LICENSED AGENT" : role === "customer" ? "POLICYHOLDER" : `${role.toUpperCase()} PORTAL`}
                        </span>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="mt-6 px-3 space-y-1">
                    <Link className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive("/dashboard")}`} to="/dashboard">
                        <FaThLarge className="text-base" /> Dashboard
                    </Link>

                    {role === "admin" && (
                        <>
                            <Link className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive("/employees")}`} to="/employees">
                                <FaUserShield className="text-base" /> Agents
                            </Link>
                            <Link className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive("/customers")}`} to="/customers">
                                <FaUsers className="text-base" /> Users
                            </Link>
                            <Link className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive("/policies")}`} to="/policies">
                                <FaFileContract className="text-base" /> Policies
                            </Link>
                            <Link className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive("/claims")}`} to="/claims">
                                <FaClipboardCheck className="text-base" /> Claims
                            </Link>
                            <Link className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive("/reports")}`} to="/reports">
                                <FaChartBar className="text-base" /> Reports
                            </Link>
                        </>
                    )}

                    {role === "agent" && (
                        <>
                            <Link className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive("/customers")}`} to="/customers">
                                <FaUsers className="text-base" /> My Clients
                            </Link>
                            <Link className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive("/quotes")}`} to="/quotes">
                                <FaFileInvoice className="text-base" /> Quotes
                            </Link>
                            <Link className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive("/policies")}`} to="/policies">
                                <FaFileContract className="text-base" /> Policies
                            </Link>
                            <Link className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive("/commission")}`} to="/commission">
                                <FaClipboardCheck className="text-base" /> Commission
                            </Link>
                            <Link className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive("/calendar")}`} to="/calendar">
                                <FaCalendarAlt className="text-base" /> Calendar
                            </Link>
                        </>
                    )}

                    {role === "customer" && (
                        <>
                            <Link className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive("/policies")}`} to="/policies">
                                <FaFileContract className="text-base" /> My Policies
                            </Link>
                            <Link className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive("/claims")}`} to="/claims">
                                <FaClipboardCheck className="text-base" /> Claims
                            </Link>
                            <Link className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive("/payments")}`} to="/payments">
                                <FaMoneyBillWave className="text-base" /> Payments
                            </Link>
                            <Link className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive("/documents")}`} to="/documents">
                                <FaFolderOpen className="text-base" /> Documents
                            </Link>
                        </>
                    )}
                </nav>
            </div>

            {/* Bottom Profile / Settings */}
            <div className="px-3 pb-6 space-y-2">
                <Link className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive("/settings")}`} to="/settings">
                    <FaCog className="text-base text-[#94a3b8]" /> <span className="text-[#94a3b8]">Settings</span>
                </Link>

                <button 
                    onClick={() => {
                        sessionStorage.clear();
                        window.location.href = "/";
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-all duration-150 text-left cursor-pointer"
                >
                    <FaSignOutAlt className="text-base" /> <span>Logout</span>
                </button>

                <div className="px-3 pt-4 border-t border-[#1e293b] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-300">
                        {name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-slate-200 truncate max-w-[140px] leading-tight">{name}</h4>
                        <span className="text-[10px] text-slate-500 font-medium">Active Session</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;