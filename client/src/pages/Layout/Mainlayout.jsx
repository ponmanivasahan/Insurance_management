import Sidebar from "../dashboard/Sidebar";

function MainLayout({ children }) {
    return (
        <div className="flex">

            <Sidebar />

            <div className="ml-64 flex-1 min-w-0">

                <div className="p-6 bg-slate-50 min-h-screen">
                    {children}
                </div>

            </div>

        </div>
    );
}

export default MainLayout;