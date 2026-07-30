import { useState } from "react";
import MainLayout from "../Layout/Mainlayout";
import { Card, PageHeader, Button, Modal, FormInput, FormSelect } from "../../components/UI";

function Calendar() {
    const [selectedDay, setSelectedDay] = useState(12);
    const [events, setEvents] = useState([
        { id: 1, day: 12, time: "10:00 AM - 11:00 AM", title: "Robert Chen Premium Review", topic: "Coverage upgrade assessment", tag: "Client Sync", tagBg: "bg-blue-50 text-blue-600" },
        { id: 2, day: 12, time: "02:30 PM - 03:00 PM", title: "Claire Sterling Policy Sync", topic: "Retaining standard homeowner plan", tag: "Renewal Call", tagBg: "bg-amber-50 text-amber-600" },
        { id: 3, day: 12, time: "04:15 PM - 04:45 PM", title: "Marcus Broady Documentation", topic: "Signature verification", tag: "Follow-up", tagBg: "bg-emerald-50 text-emerald-600" },
        { id: 4, day: 15, time: "09:00 AM - 10:00 AM", title: "Siddharth Nair Renewal Sync", topic: "Property and umbrella quote walk-through", tag: "Renewal Call", tagBg: "bg-amber-50 text-amber-600" },
        { id: 5, day: 16, time: "11:30 AM - 12:00 PM", title: "Tesla Model Y Claim Check", topic: "Verify damage assessor comments", tag: "Follow-up", tagBg: "bg-emerald-50 text-emerald-600" }
    ]);

    const [tasks, setTasks] = useState([
        { id: 1, text: "Upload verified loss assessment for David Sterling (CLM-9284)", due: "Due: in 2 days", priority: "High Priority", color: "text-[#DC2626] bg-red-50 border-red-100" },
        { id: 2, text: "Process umbrella signature verification for Siddharth Nair", due: "Due: in 5 days", priority: "Medium Priority", color: "text-[#F59E0B] bg-amber-50 border-amber-100" },
        { id: 3, text: "Schedule preliminary assessment for newly submitted auto claim CLM-9012", due: "Due: in 7 days", priority: "Low Priority", color: "text-[#2563EB] bg-blue-50 border-blue-100" }
    ]);

    // Meeting modal states
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        client: "",
        time: "10:00 AM - 11:00 AM",
        tag: "Client Sync",
        topic: ""
    });

    const handleCreateMeeting = (e) => {
        e.preventDefault();
        const tagBgs = {
            "Client Sync": "bg-blue-50 text-blue-600",
            "Renewal Call": "bg-amber-50 text-amber-600",
            "Follow-up": "bg-emerald-50 text-emerald-600"
        };
        const newEvent = {
            id: events.length + 1,
            day: selectedDay,
            time: form.time,
            title: `${form.client} Meeting`,
            topic: form.topic || "Discussion on coverage features",
            tag: form.tag,
            tagBg: tagBgs[form.tag] || "bg-gray-50 text-gray-600"
        };
        setEvents([...events, newEvent]);
        setShowModal(false);
        setForm({ client: "", time: "10:00 AM - 11:00 AM", tag: "Client Sync", topic: "" });
    };

    const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
    const selectedDayEvents = events.filter(ev => ev.day === selectedDay);

    return (
        <MainLayout>
            <div className="space-y-6">
                <PageHeader 
                    title="Appointment & Deadline Calendar"
                    breadcrumb="Coordinate client reviews, renewal check-ins, policy expirations, and scheduled tasks."
                    actionButton={
                        <Button variant="primary" className="h-9" onClick={() => setShowModal(true)}>
                            Schedule New Meeting
                        </Button>
                    }
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Calendar & Today's Agenda */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Mini Calendar Widget */}
                        <Card className="p-4 bg-white border border-[#E5E7EB] flex flex-col justify-between">
                            <div>
                                <h3 className="text-[14px] font-bold text-[#111827] mb-3">October 2024</h3>
                                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-slate-400">
                                    <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-center text-[11px] mt-2">
                                    {/* Offset blanks */}
                                    <span className="text-gray-300">28</span><span className="text-gray-300">29</span><span className="text-gray-300">30</span>
                                    
                                    {daysInMonth.map(day => {
                                        const isSelected = selectedDay === day;
                                        const hasEvents = events.some(e => e.day === day);
                                        return (
                                            <button 
                                                key={day}
                                                onClick={() => setSelectedDay(day)}
                                                className={`w-6 h-6 flex items-center justify-center mx-auto rounded-full text-[11px] cursor-pointer transition-colors ${
                                                    isSelected 
                                                        ? "font-bold bg-[#2563EB] text-white" 
                                                        : hasEvents 
                                                            ? "bg-blue-50 text-[#2563EB] font-semibold hover:bg-blue-100" 
                                                            : "text-[#111827] hover:bg-slate-100"
                                                }`}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </Card>
 
                        {/* Today's Agenda List */}
                        <div className="md:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col justify-between">
                            <h3 className="text-[14px] font-bold text-[#111827] mb-4">
                                Agenda for October {selectedDay}, 2024
                            </h3>
                            <div className="space-y-4">
                                {selectedDayEvents.length === 0 ? (
                                    <div className="text-center py-8 text-[#6B7280] text-[13px]">
                                        No appointments scheduled for this date.
                                    </div>
                                ) : (
                                    selectedDayEvents.map(ev => (
                                        <div key={ev.id} className="p-3 bg-slate-50/50 border border-[#E5E7EB] rounded-xl flex items-center justify-between">
                                            <div className="space-y-1">
                                                <span className="text-[11px] font-semibold text-[#2563EB]">{ev.time}</span>
                                                <h4 className="text-[13px] font-bold text-[#111827]">{ev.title}</h4>
                                                <p className="text-[11px] text-[#6B7280]">{ev.topic}</p>
                                            </div>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ev.tagBg}`}>{ev.tag}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Upcoming Crucial Actions */}
                    <div>
                        <Card className="h-full p-5 bg-white border border-[#E5E7EB] flex flex-col justify-between">
                            <div>
                                <h3 className="text-[14px] font-bold text-[#111827] mb-4">Upcoming Crucial Actions</h3>
                                <div className="space-y-4">
                                    {tasks.map(t => (
                                        <div key={t.id} className="p-3 border border-slate-100 rounded-xl space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${t.color}`}>{t.priority}</span>
                                                <span className="text-[10px] text-gray-400">{t.due}</span>
                                            </div>
                                            <p className="text-[12px] text-[#111827] leading-snug">{t.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Schedule Meeting Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule New Meeting">
                <form onSubmit={handleCreateMeeting} className="space-y-4">
                    <FormInput 
                        required 
                        label="Client / Attendee Name" 
                        placeholder="e.g. Robert Chen" 
                        value={form.client} 
                        onChange={(e) => setForm({ ...form, client: e.target.value })} 
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                        <FormInput 
                            required 
                            label="Meeting Time Frame" 
                            placeholder="e.g. 10:00 AM - 11:00 AM" 
                            value={form.time} 
                            onChange={(e) => setForm({ ...form, time: e.target.value })} 
                        />
                        <FormSelect 
                            label="Meeting Purpose / Tag" 
                            value={form.tag} 
                            onChange={(e) => setForm({ ...form, tag: e.target.value })} 
                            options={[
                                { value: "Client Sync", label: "Client Sync" },
                                { value: "Renewal Call", label: "Renewal Call" },
                                { value: "Follow-up", label: "Follow-up" }
                            ]}
                        />
                    </div>

                    <FormInput 
                        label="Discussion Topic Details" 
                        placeholder="e.g. Plan coverage upgrades" 
                        value={form.topic} 
                        onChange={(e) => setForm({ ...form, topic: e.target.value })} 
                    />

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E5E7EB]">
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Confirm Appointment
                        </Button>
                    </div>
                </form>
            </Modal>
        </MainLayout>
    );
}

export default Calendar;
