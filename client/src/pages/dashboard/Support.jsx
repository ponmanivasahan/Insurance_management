import { useState } from "react";
import MainLayout from "../Layout/Mainlayout";
import { Card, PageHeader, StatisticsCard, DataTable, StatusBadge, Button, FormInput, FormSelect, FormTextarea } from "../../components/UI";
import { FaSearch, FaComments, FaEnvelope, FaPhoneAlt, FaPaperclip, FaChevronDown } from "react-icons/fa";

function Support() {
    const [tickets, setTickets] = useState([
        { id: "#TST-9125", subject: "Requesting multi-car rate validation", status: "Pending", updated: "Today, 12:21 PM" },
        { id: "#TST-8401", subject: "Submitted window replacement invoice", status: "Open", updated: "Yesterday, 10:11 AM" }
    ]);

    const [form, setForm] = useState({ subject: "", category: "Policies & Coverages", description: "" });
    const [openFaq, setOpenFaq] = useState(null);

    const handleSubmitTicket = (e) => {
        e.preventDefault();
        const generatedId = `#TST-${Math.floor(8000 + Math.random() * 1999)}`;
        setTickets([
            ...tickets,
            {
                id: generatedId,
                subject: form.subject,
                status: "Open",
                updated: "Just Now"
            }
        ]);
        setForm({ subject: "", category: "Policies & Coverages", description: "" });
    };

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <PageHeader 
                    title="Support Center"
                    breadcrumb="Connect with specialists, submit requests, check ticket progress, and access help resources."
                    actionButton={
                        <Button variant="outline" className="h-9">
                            Notifications (2)
                        </Button>
                    }
                />

                {/* Banner search card */}
                <div className="w-full bg-[#0F172A] text-white rounded-xl p-8 text-center space-y-4">
                    <h2 className="text-[20px] font-bold">How can we help you today?</h2>
                    <div className="relative max-w-xl mx-auto">
                        <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
                        <input 
                            type="text" 
                            placeholder="Search for articles, guides, or key topics..." 
                            className="w-full bg-slate-800 text-white placeholder-gray-400 pl-10 pr-4 py-2.5 rounded-lg border border-slate-700 text-[13px] focus:outline-none"
                        />
                    </div>
                </div>

                {/* Three Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 bg-white border border-[#E5E7EB] flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <FaComments className="text-[22px] text-[#2563EB]" />
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">● 12 Active</span>
                            </div>
                            <h3 className="text-[14px] font-bold text-[#111827]">Live Web Chat</h3>
                            <p className="text-[11.5px] text-[#6B7280] leading-relaxed">
                                Instant response from our team and automated coverage specialists.
                            </p>
                        </div>
                        <Button variant="primary" className="w-full py-2">Initiate Chat</Button>
                    </Card>

                    <Card className="p-6 bg-white border border-[#E5E7EB] flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <FaEnvelope className="text-[22px] text-[#F59E0B]" />
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 font-medium">Est 4h response</span>
                            </div>
                            <h3 className="text-[14px] font-bold text-[#111827]">Email Ticket</h3>
                            <p className="text-[11.5px] text-[#6B7280] leading-relaxed">
                                Submit custom inquiry tickets directly to our support agents.
                            </p>
                        </div>
                        <Button variant="outline" className="w-full py-2">Send Email</Button>
                    </Card>

                    <Card className="p-6 bg-white border border-[#E5E7EB] flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <FaPhoneAlt className="text-[22px] text-[#10B981]" />
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 font-medium">Mon - Fri, 9am - 6pm</span>
                            </div>
                            <h3 className="text-[14px] font-bold text-[#111827]">Phone Support</h3>
                            <p className="text-[11.5px] text-[#6B7280] leading-relaxed">
                                Speak to a customer service representative via our contact center.
                            </p>
                        </div>
                        <Button variant="outline" className="w-full py-2">Dial 1-800-INS-FLOW</Button>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Tickets & FAQ */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Active Help Tickets Table */}
                        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                            <h3 className="text-[15px] font-bold text-[#111827] mb-4">Active Help Tickets</h3>
                            <DataTable headers={["Ticket ID", "Subject", "Status", "Last Updated", "Action"]}>
                                {tickets.map(t => (
                                    <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-3 whitespace-nowrap text-[13px] font-medium text-slate-500">{t.id}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-[13px] font-bold text-[#111827]">{t.subject}</td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <StatusBadge status={t.status} />
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-[12px] text-gray-400">{t.updated}</td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <Button variant="primary" className="px-3 py-1 text-[11px] font-bold">Reply</Button>
                                        </td>
                                    </tr>
                                ))}
                            </DataTable>
                        </div>

                        {/* Frequently Asked Questions Accordions */}
                        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                            <h3 className="text-[15px] font-bold text-[#111827] mb-4">Frequently Asked Questions</h3>
                            <div className="space-y-2">
                                {[
                                    { q: "How do I change my automated billing date?", a: "You can modify your automated premium payments schedule date directly inside the Billing & Payments screen under Saved Methods or request assistance." },
                                    { q: "What documents are required to secure a self-policy execution?", a: "You typically need to upload a government-issued photo ID (JPEG/PDF) and a valid proof of asset ownership (e.g. car title or utility statement)." },
                                    { q: "How long does a typical comprehensive auto claim take to resolve?", a: "Most standard claims are adjudicated and verified by an assigned claims inspector within 3-5 business days from lossless submission." }
                                ].map((item, idx) => (
                                    <div key={idx} className="border border-[#E5E7EB] rounded-lg">
                                        <button 
                                            onClick={() => toggleFaq(idx)}
                                            className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-[13px] text-[#111827] hover:bg-slate-50/50 cursor-pointer"
                                        >
                                            <span>{item.q}</span>
                                            <FaChevronDown className={`text-slate-400 transition-transform ${openFaq === idx ? "transform rotate-180" : ""}`} />
                                        </button>
                                        {openFaq === idx && (
                                            <div className="px-4 pb-3 text-[12.5px] text-[#6B7280] border-t border-[#f1f5f9] pt-2">
                                                {item.a}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Submit Ticket Form */}
                    <div>
                        <Card className="bg-white border border-[#E5E7EB] p-5">
                            <h3 className="text-[15px] font-bold text-[#111827]">Submit New Ticket</h3>
                            <p className="text-[11.5px] text-[#6B7280] mb-4">Create formal inquiry tickets for manual support review</p>
                            <form onSubmit={handleSubmitTicket} className="space-y-4">
                                <FormInput 
                                    required 
                                    label="Inquiry Subject" 
                                    placeholder="Brief summary of issue..." 
                                    value={form.subject} 
                                    onChange={(e) => setForm({ ...form, subject: e.target.value })} 
                                />
                                <FormSelect 
                                    label="Inquiry Category" 
                                    value={form.category} 
                                    onChange={(e) => setForm({ ...form, category: e.target.value })} 
                                    options={[
                                        { value: "Policies & Coverages", label: "Policies & Coverages" },
                                        { value: "Billing", label: "Billing" },
                                        { value: "Claims", label: "Claims" },
                                        { value: "Account", label: "Account" }
                                    ]}
                                />
                                <FormTextarea 
                                    required 
                                    label="Detailed Description" 
                                    placeholder="Explain the details of your request..." 
                                    value={form.description} 
                                    onChange={(e) => setForm({ ...form, description: e.target.value })} 
                                />
                                <div className="flex items-center gap-1.5 text-[12px] text-[#2563EB] font-medium cursor-pointer hover:underline">
                                    <FaPaperclip />
                                    <span>Attach Supporting Files (Max 10MB)</span>
                                </div>
                                <Button type="submit" variant="primary" className="w-full py-2">Submit Ticket Request</Button>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default Support;
