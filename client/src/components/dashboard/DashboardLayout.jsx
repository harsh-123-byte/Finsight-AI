import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children, searchQuery, onSearchChange }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <Topbar searchQuery={searchQuery} onSearchChange={onSearchChange} />

          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;