import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaThLarge, FaUsers, FaUserShield, FaFileContract, FaClipboardCheck, FaChartBar, FaSignOutAlt, FaFolderOpen, FaCog, FaMoneyBillWave, FaCalendarAlt, FaQuestionCircle } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

function Sidebar() {
    const { user, logoutUser } = useContext(AuthContext);
    const location = useLocation();

    const role = user?.role?.toLowerCase() || "customer";
    const name = user?.name || "Premium User";

    const getLinkStyle = (path) => {
        const isCurrent = location.pathname === path;
        return isCurrent
            ? "flex items-center gap-3 px-4 py-3 text-[14px] font-medium transition-all duration-150 border-l-[3px] border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB]"
            : "flex items-center gap-3 px-4 py-3 text-[14px] font-normal transition-all duration-150 text-[#6B7280] hover:text-[#111827] hover:bg-gray-50 border-l-[3px] border-transparent";
    };

    return (
        <div className="w-64 h-screen bg-[#FFFFFF] border-r border-[#E5E7EB] text-[#111827] fixed top-0 left-0 flex flex-col justify-between z-40 select-none">
            <div>
                {/* Brand / Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-[#E5E7EB] mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-[16px] font-medium text-[#111827] leading-none tracking-tight font-sans">
                            InsureFlow
                        </h2>
                        <span className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider block mt-1">
                            {role === "admin" ? "SYSTEM ADMIN" : role === "agent" ? "LICENSED AGENT" : "POLICYHOLDER"}
                        </span>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-0.5">
                    <Link className={getLinkStyle("/dashboard")} to="/dashboard">
                        <FaThLarge className="text-base" /> Dashboard
                    </Link>

                    {role === "admin" && (
                        <>
                            <Link className={getLinkStyle("/employees")} to="/employees">
                                <FaUserShield className="text-base" /> Agents
                            </Link>
                            <Link className={getLinkStyle("/customers")} to="/customers">
                                <FaUsers className="text-base" /> Users
                            </Link>
                            <Link className={getLinkStyle("/policies")} to="/policies">
                                <FaFileContract className="text-base" /> Policies
                            </Link>
                            <Link className={getLinkStyle("/claims")} to="/claims">
                                <FaClipboardCheck className="text-base" /> Claims
                            </Link>
                            <Link className={getLinkStyle("/reports")} to="/reports">
                                <FaChartBar className="text-base" /> Reports
                            </Link>
                        </>
                    )}

                    {role === "agent" && (
                        <>
                            <Link className={getLinkStyle("/customers")} to="/customers">
                                <FaUsers className="text-base" /> My Clients
                            </Link>
                            <Link className={getLinkStyle("/quotes")} to="/quotes">
                                <FaFolderOpen className="text-base" /> Quotes
                            </Link>
                            <Link className={getLinkStyle("/policies")} to="/policies">
                                <FaFileContract className="text-base" /> Policies
                            </Link>
                            <Link className={getLinkStyle("/commission")} to="/commission">
                                <FaMoneyBillWave className="text-base" /> Commission
                            </Link>
                            <Link className={getLinkStyle("/calendar")} to="/calendar">
                                <FaCalendarAlt className="text-base" /> Calendar
                            </Link>
                        </>
                    )}

                    {role === "customer" && (
                        <>
                            <Link className={getLinkStyle("/policies")} to="/policies">
                                <FaFileContract className="text-base" /> My Policies
                            </Link>
                            <Link className={getLinkStyle("/claims")} to="/claims">
                                <FaClipboardCheck className="text-base" /> Claims
                            </Link>
                            <Link className={getLinkStyle("/payments")} to="/payments">
                                <FaMoneyBillWave className="text-base" /> Payments
                            </Link>
                            <Link className={getLinkStyle("/documents")} to="/documents">
                                <FaFolderOpen className="text-base" /> Documents
                            </Link>
                            <Link className={getLinkStyle("/support")} to="/support">
                                <FaQuestionCircle className="text-base" /> Support
                            </Link>
                        </>
                    )}
                </nav>
            </div>

            {/* Bottom Profile / Settings */}
            <div className="pb-6">

                <button 
                    onClick={logoutUser}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-normal text-[#DC2626] hover:bg-red-50 border-l-[3px] border-transparent text-left cursor-pointer transition-colors"
                >
                    <FaSignOutAlt className="text-base" /> <span>Logout</span>
                </button>

                <div className="mx-6 pt-4 border-t border-[#E5E7EB] flex items-center gap-3 mt-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-[#E5E7EB] flex items-center justify-center text-[12px] font-bold text-[#111827]">
                        {name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-[12px] font-medium text-[#111827] truncate max-w-[140px] leading-tight">{name}</h4>
                        <span className="text-[10px] text-[#6B7280]">Active Session</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;