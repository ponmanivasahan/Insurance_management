import { useEffect, useState, useContext } from "react";
import MainLayout from "../Layout/Mainlayout";
import { AuthContext } from "../../context/AuthContext";
import { Card, PageHeader, Button, FormInput, FormSelect } from "../../components/UI";

function Settings() {
    const { user } = useContext(AuthContext);
    const [role, setRole] = useState("customer");
    const [mfa, setMfa] = useState(true);
    const [ipLock, setIpLock] = useState(false);
    const [emailTrigger, setEmailTrigger] = useState(true);
    const [smsTrigger, setSmsTrigger] = useState(true);
    const [failedRetry, setFailedRetry] = useState(false);
    const [showKey, setShowKey] = useState(false);

    useEffect(() => {
        if (user) {
            setRole(user.role?.toLowerCase() || "customer");
        }
    }, [user]);

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
            <div className="space-y-6">
                
                {/* Upper Header Control Row */}
                <PageHeader 
                    title="Global Platform Settings"
                    breadcrumb="Configure system rules, broker commissions, security credentials, and compliance protocols."
                    actionButton={
                        <>
                            <Button variant="outline" className="h-9">
                                Platform Status: Secure
                            </Button>
                            <Button variant="primary" className="h-9" onClick={handleDeploy}>
                                Deploy Live Settings
                            </Button>
                        </>
                    }
                />

                {/* Top Row: Profile Configuration & Security Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Platform Profile Configuration */}
                    <div className="lg:col-span-2">
                        <Card className="space-y-4">
                            <h2 className="text-[16px] font-medium text-[#111827] tracking-tight mb-2">
                                Platform Profile Configuration
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormInput label="Tenant Identity Name" placeholder="InsureFlow Platform Inc." />
                                <FormInput label="Ops Control Email" placeholder="ops@insureflow-platform.com" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormInput label="Support Phone SLA Line" placeholder="+1 (800) 555-FLOW" />
                                <FormSelect 
                                    label="Default Commission Scheme" 
                                    options={[
                                        { value: "SDR-8", label: "Standard SDR (8.0% Volume)" },
                                        { value: "SDR-12", label: "Premium Broker (12.0% Volume)" }
                                    ]}
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Timeout & Security Controls */}
                    <div>
                        <Card className="space-y-4">
                            <h2 className="text-[16px] font-medium text-[#111827] tracking-tight mb-2">
                                Timeout & Security Controls
                            </h2>
                            <div className="space-y-3 text-[14px]">
                                <div className="flex items-center justify-between py-1">
                                    <div>
                                        <span className="font-medium text-[#111827] block">Multi-Factor MFA</span>
                                        <span className="text-[12px] text-[#6B7280]">Force MFA for admin routes</span>
                                    </div>
                                    <input type="checkbox" checked={mfa} onChange={toggleMfa} className="w-4 h-4 rounded text-[#2563EB]" />
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <div>
                                        <span className="font-medium text-[#111827] block">Restrict IP Address Access</span>
                                        <span className="text-[12px] text-[#6B7280]">Allow only whitelisted IPs</span>
                                    </div>
                                    <input type="checkbox" checked={ipLock} onChange={toggleIpLock} className="w-4 h-4 rounded text-[#2563EB]" />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Underwriting Terms & Automated SMS/Email Triggers */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Underwriting Rule Parameters */}
                    <div className="lg:col-span-2">
                        <Card className="space-y-4">
                            <h2 className="text-[16px] font-medium text-[#111827] tracking-tight mb-2">
                                Underwriting Rule Parameters
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <FormInput label="Claim Auto-Approve Limit" placeholder="$5,000" />
                                <FormInput label="Max Policy Term Buffer" placeholder="30 Days" />
                                <FormInput label="Default Damage Ded. Fee" placeholder="$500.00" />
                            </div>
                        </Card>
                    </div>

                    {/* Automated Notification Triggers */}
                    <div>
                        <Card className="space-y-4">
                            <h2 className="text-[16px] font-medium text-[#111827] tracking-tight mb-2">
                                Automated Notification Triggers
                            </h2>
                            <div className="space-y-3 text-[14px]">
                                <div className="flex items-center justify-between py-1">
                                    <div>
                                        <span className="font-medium text-[#111827] block">Email Warning Alert</span>
                                        <span className="text-[12px] text-[#6B7280]">Send email notifications</span>
                                    </div>
                                    <input type="checkbox" checked={emailTrigger} onChange={toggleEmail} className="w-4 h-4 rounded text-[#2563EB]" />
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <div>
                                        <span className="font-medium text-[#111827] block">SMS Warning Alert</span>
                                        <span className="text-[12px] text-[#6B7280]">Send SMS notifications</span>
                                    </div>
                                    <input type="checkbox" checked={smsTrigger} onChange={toggleSms} className="w-4 h-4 rounded text-[#2563EB]" />
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <div>
                                        <span className="font-medium text-[#111827] block">Failed Retry Warn</span>
                                        <span className="text-[12px] text-[#6B7280]">Email admins on failed logins</span>
                                    </div>
                                    <input type="checkbox" checked={failedRetry} onChange={toggleFailedRetry} className="w-4 h-4 rounded text-[#2563EB]" />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* API Credentials Management */}
                {role === "admin" && (
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-4">
                        <h2 className="text-[16px] font-medium text-[#111827] tracking-tight">
                            Platform API Integration Credentials
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50/50 p-4 border border-[#E5E7EB] rounded-lg">
                            <div className="flex-1 font-mono text-[13px] text-[#111827]">
                                {showKey ? "live_pk_51NzWqJLy3xK1Sdf98042Klsad92348" : "••••••••••••••••••••••••••••••••••••••••"}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" className="px-3 py-1 text-[12px] h-8" onClick={() => setShowKey(!showKey)}>
                                    {showKey ? "Hide Secret Key" : "Reveal Secret Key"}
                                </Button>
                                <Button variant="outline" className="px-3 py-1 text-[12px] h-8">
                                    Roll API Credentials
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </MainLayout>
    );
}

export default Settings;
