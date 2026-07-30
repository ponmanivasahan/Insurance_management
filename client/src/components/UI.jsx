import React from "react";
import { Link } from "react-router-dom";

// PageHeader component
export function PageHeader({ title, breadcrumb, actionButton }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-[#E5E7EB] mb-6">
            <div>
                <h1 className="text-[20px] font-medium text-[#111827] leading-tight font-sans">
                    {title}
                </h1>
                {breadcrumb && (
                    <span className="text-[12px] text-[#6B7280] font-normal mt-1 block">
                        {breadcrumb}
                    </span>
                )}
            </div>
            {actionButton && (
                <div className="flex items-center gap-2">
                    {actionButton}
                </div>
            )}
        </div>
    );
}

// Card component
export function Card({ children, className = "", onClick }) {
    return (
        <div 
            onClick={onClick}
            className={`bg-white border border-[#E5E7EB] rounded-xl p-6 transition-all duration-200 hover:border-gray-300 ${onClick ? "cursor-pointer" : ""} ${className}`}
        >
            {children}
        </div>
    );
}

// StatisticsCard component
export function StatisticsCard({ title, value, change, description, indicatorColor = "bg-[#2563EB]" }) {
    const isPositive = change?.startsWith("+");
    return (
        <Card className="flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-wider">{title}</span>
                <span className={`w-2 h-2 rounded-full ${indicatorColor}`}></span>
            </div>
            <div className="mt-4">
                <h3 className="text-[20px] font-medium text-[#111827] tracking-tight">{value}</h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                    {change && (
                        <span className={`text-[12px] font-medium ${isPositive ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                            {change}
                        </span>
                    )}
                    <span className="text-[12px] text-[#6B7280]">
                        {description}
                    </span>
                </div>
            </div>
        </Card>
    );
}

// Button component
export function Button({ 
    children, 
    onClick, 
    type = "button", 
    variant = "primary", 
    disabled = false,
    className = "" 
}) {
    const baseStyle = "px-4 py-2 rounded-lg text-[14px] font-medium transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border";
    
    const variants = {
        primary: "bg-[#2563EB] hover:bg-blue-700 text-white border-transparent",
        secondary: "bg-gray-100 hover:bg-gray-200 text-[#111827] border-transparent",
        outline: "bg-white hover:bg-gray-50 text-[#111827] border-[#E5E7EB]",
        danger: "bg-[#DC2626] hover:bg-red-700 text-white border-transparent",
        success: "bg-[#16A34A] hover:bg-green-700 text-white border-transparent"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}

// StatusBadge component
export function StatusBadge({ status }) {
    const cleanStatus = status?.trim();
    
    let styles = "bg-gray-50 text-gray-700 border-gray-100";
    if (["Active", "Approved", "Paid", "verified"].includes(cleanStatus)) {
        styles = "bg-green-50 text-[#16A34A] border-green-100";
    } else if (["Suspended", "Rejected", "Expired", "Lapsed", "Cancelled", "overdue"].includes(cleanStatus)) {
        styles = "bg-red-50 text-[#DC2626] border-red-100";
    } else if (["Pending", "Under Review", "pending"].includes(cleanStatus)) {
        styles = "bg-amber-50 text-[#F59E0B] border-amber-100";
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[12px] font-medium border ${styles}`}>
            {cleanStatus}
        </span>
    );
}

// DataTable component
export function DataTable({ headers, children, maxHeight = "max-h-[300px]" }) {
    const hasData = React.Children.toArray(children).some(child => child !== null && child !== undefined && (Array.isArray(child) ? child.length > 0 : true));

    return (
        <div className={`overflow-x-auto ${maxHeight} overflow-y-auto`}>
            <table className="min-w-full divide-y divide-[#E5E7EB] border-collapse text-left">
                <thead>
                    <tr className="bg-gray-50/50 border-b border-[#E5E7EB]">
                        {headers.map((h, i) => (
                            <th 
                                key={i} 
                                className="px-6 py-3 text-[12px] font-medium text-[#6B7280] uppercase tracking-wider"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] bg-white">
                    {hasData ? children : (
                        <tr>
                            <td colSpan={headers.length} className="px-6 py-12 text-center text-[#6B7280]">
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-[#E5E7EB] animate-pulse">
                                        <svg className="w-5 h-5 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    </div>
                                    <span className="text-[13px] font-medium text-[#111827]">No active logs or matching records found.</span>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

// FormInput component
export function FormInput({ 
    label, 
    type = "text", 
    placeholder, 
    value, 
    onChange, 
    required = false,
    className = ""
}) {
    return (
        <div className={`w-full space-y-1.5 ${className}`}>
            {label && (
                <label className="block text-[12px] font-medium text-[#6B7280] uppercase tracking-wider">
                    {label} {required && <span className="text-[#DC2626]">*</span>}
                </label>
            )}
            <input
                type={type}
                required={required}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#2563EB] transition-colors duration-150"
            />
        </div>
    );
}

// FormSelect component
export function FormSelect({ 
    label, 
    options, 
    value, 
    onChange, 
    required = false,
    className = ""
}) {
    return (
        <div className={`w-full space-y-1.5 ${className}`}>
            {label && (
                <label className="block text-[12px] font-medium text-[#6B7280] uppercase tracking-wider">
                    {label} {required && <span className="text-[#DC2626]">*</span>}
                </label>
            )}
            <select
                required={required}
                value={value}
                onChange={onChange}
                className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#111827] focus:outline-none focus:border-[#2563EB] transition-colors duration-150"
            >
                {options.map((opt, i) => (
                    <option key={i} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

// FormTextarea component
export function FormTextarea({ 
    label, 
    placeholder, 
    value, 
    onChange, 
    required = false,
    className = ""
}) {
    return (
        <div className={`w-full space-y-1.5 ${className}`}>
            {label && (
                <label className="block text-[12px] font-medium text-[#6B7280] uppercase tracking-wider">
                    {label} {required && <span className="text-[#DC2626]">*</span>}
                </label>
            )}
            <textarea
                required={required}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#2563EB] transition-colors duration-150 h-24 resize-none"
            />
        </div>
    );
}

// Modal component
export function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-[2px] flex justify-center items-center z-50 p-4">
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 w-full max-w-md shadow-none flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center pb-4 border-b border-[#E5E7EB] mb-4">
                    <h2 className="text-[18px] font-medium text-[#111827] leading-none">{title}</h2>
                    <button 
                        onClick={onClose} 
                        className="text-[#6B7280] hover:text-[#111827] transition-colors text-[18px] cursor-pointer"
                    >
                        &times;
                    </button>
                </div>
                <div className="overflow-y-auto flex-1 pr-1">
                    {children}
                </div>
            </div>
        </div>
    );
}

// SearchBar component
export function SearchBar({ value, onChange, placeholder = "Search records..." }) {
    return (
        <div className="relative w-full max-w-xs">
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg py-1.5 pl-3 pr-8 text-[12px] text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#2563EB] transition-colors duration-150"
            />
        </div>
    );
}

// ConfirmationModal component
export function ConfirmationModal({ isOpen, onClose, onConfirm, title = "Confirm Action", message = "Are you sure you want to proceed?" }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-[2px] flex justify-center items-center z-50 p-4">
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 w-full max-w-md shadow-none flex flex-col">
                <h3 className="text-[16px] font-medium text-[#111827] mb-2">{title}</h3>
                <p className="text-[14px] text-[#6B7280] mb-6">{message}</p>
                <div className="flex justify-end gap-3 pt-2 border-t border-[#E5E7EB]">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={onConfirm}>
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    );
}
