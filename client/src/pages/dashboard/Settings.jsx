import { useEffect, useState } from "react";
import MainLayout from "../Layout/Mainlayout";

function Settings() {
    const [role, setRole] = useState("admin");
    const [mfa, setMfa] = useState(true);
    const [ipLock, setIpLock] = useState(false);
    const [emailTrigger, setEmailTrigger] = useState(true);
    const [smsTrigger, setSmsTrigger] = useState(true);
    const [failedRetry, setFailedRetry] = useState(false);
    const [showKey, setShowKey] = useState(false);

    useEffect(() => {
        setRole(sessionStorage.getItem("role") || "admin");
    }, []);

    const toggleMfa = () => setMfa(!mfa);
    const toggleIpLock = () => setIpLock(!ipLock);
    const toggleEmail = () => setEmailTrigger(!emailTrigger);
    const toggleSms = () => setSmsTrigger(!smsTrigger);
    const toggleFailedRetry = () => setFailedRetry(!failedRetry);

    const handleDeploy = () => {
        alert("Live settings deployed successfully to all clusters!");
    };

    return (
        <MainLayout>
            <div className="space-y-6 max-w-[1600px] mx-auto">
                
                {/* Upper Header Control Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e2e8f0]">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Global Platform Settings
                        </h1>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                            Configure system rules, broker commissions, security credentials, and compliance protocols.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="bg-white border border-[#e2e8f0] text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                            Platform Status: Secure
                        </button>
                        <button 
                            onClick={handleDeploy}
                            className="bg-[#2563eb] text-white hover:bg-blue-700 text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                            Deploy Live Settings
                        </button>
                    </div>
                </div>

                {/* Top Row: Profile Configuration & Security Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Platform Profile Configuration */}
                    <div className="lg:col-span-2 bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm space-y-4">
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-2">
                            Platform Profile Configuration
                        </h2>
                        
                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tenant Company Identity</label>
                            <input 
                                type="text"
                                defaultValue="InsureFlow Platform Inc."
                                className="w-full bg-white border border-[#e2e8f0] rounded-lg p-3 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">System Operations Email</label>
                            <input 
                                type="email"
                                defaultValue="ops@insureflow-platform.com"
                                className="w-full bg-white border border-[#e2e8f0] rounded-lg p-3 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Platform Security & Timeout Controls */}
                    <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm space-y-6">
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                            Platform Security & Timeout Controls
                        </h2>

                        {/* MFA Toggle */}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h4 className="text-xs font-bold text-slate-950">Enforce Multi-Factor Auth (MFA)</h4>
                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Mandatory 2FA validation on all agent/auditor logins.</p>
                            </div>
                            <button 
                                onClick={toggleMfa}
                                className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${mfa ? "bg-blue-600" : "bg-slate-300"}`}
                            >
                                <span className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${mfa ? "translate-x-4" : "translate-x-0"}`}></span>
                            </button>
                        </div>

                        {/* IP Lock Toggle */}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h4 className="text-xs font-bold text-slate-950">IP Access Restriction Lock</h4>
                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Isolate database queries to corporate VPN range.</p>
                            </div>
                            <button 
                                onClick={toggleIpLock}
                                className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${ipLock ? "bg-blue-600" : "bg-slate-300"}`}
                            >
                                <span className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${ipLock ? "translate-x-4" : "translate-x-0"}`}></span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Row Grid: Underwriting, Triggers & API Keys */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Automated Underwriting & Terms */}
                    <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm space-y-4">
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-2">
                            Automated Underwriting & Terms
                        </h2>

                        <div className="space-y-3.5 text-xs">
                            <div className="flex justify-between items-center py-2 border-b border-slate-50 font-semibold text-slate-600">
                                <span>Auto-Renewal Buffer Period</span>
                                <span className="text-[#2563eb] font-bold">30 Days Prior</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-50 font-semibold text-slate-600">
                                <span>Default Auto Damage Broker Fee</span>
                                <span className="text-[#2563eb] font-bold">2.5% Premium</span>
                            </div>
                            <div className="flex justify-between items-center py-2 font-semibold text-slate-600">
                                <span>Grace Period for Non-Payment</span>
                                <span className="text-[#2563eb] font-bold">15 Calendar Days</span>
                            </div>
                        </div>
                    </div>

                    {/* System Email/SMS Triggers */}
                    <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm space-y-6">
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                            System Email/SMS Triggers
                        </h2>

                        {/* Claim Approval Email Toggle */}
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-xs font-semibold text-slate-700">Claim Approval Notifications (Email)</span>
                            <button 
                                onClick={toggleEmail}
                                className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${emailTrigger ? "bg-blue-600" : "bg-slate-300"}`}
                            >
                                <span className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${emailTrigger ? "translate-x-4" : "translate-x-0"}`}></span>
                            </button>
                        </div>

                        {/* SMS Alert Toggle */}
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-xs font-semibold text-slate-700">SLA Warning Alert (Instant SMS)</span>
                            <button 
                                onClick={toggleSms}
                                className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${smsTrigger ? "bg-blue-600" : "bg-slate-300"}`}
                            >
                                <span className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${smsTrigger ? "translate-x-4" : "translate-x-0"}`}></span>
                            </button>
                        </div>

                        {/* Failed Notification Toggle */}
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-xs font-semibold text-slate-700">Failed Renewal Retry Notifications</span>
                            <button 
                                onClick={toggleFailedRetry}
                                className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${failedRetry ? "bg-blue-600" : "bg-slate-300"}`}
                            >
                                <span className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${failedRetry ? "translate-x-4" : "translate-x-0"}`}></span>
                            </button>
                        </div>
                    </div>

                    {/* API Keys & Gateway Access */}
                    <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm space-y-4">
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-2">
                            API Keys & Gateway Access
                        </h2>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Production API Endpoint Authorization</label>
                            <div className="flex items-center justify-between bg-slate-50 border border-[#e2e8f0] rounded-lg p-3 text-xs">
                                <span className="font-mono text-slate-700 truncate select-all">
                                    {showKey ? "pk_live_09x218aef82180bacd4825902" : "pk_live_09×218aef82180ba..."}
                                </span>
                                <button 
                                    onClick={() => setShowKey(!showKey)}
                                    className="text-blue-600 font-bold hover:underline ml-2"
                                >
                                    {showKey ? "Hide" : "Reveal Key"}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <span className="text-xs font-semibold text-slate-500">Live Webhook Dispatch Status</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700">
                                Live Connected
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}

export default Settings;
