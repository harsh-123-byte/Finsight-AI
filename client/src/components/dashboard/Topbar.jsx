import { useState } from "react";
import {
  Search,
  ChevronDown,
  UserCircle2,
  CalendarDays,
  Menu,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { logoutUser } from "../../services/authService";

const Topbar = ({ searchQuery, onSearchChange, onMenuClick }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const handleSettings = () => {
    setShowProfileMenu(false);
    navigate("/settings");
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      // ignore
    }

    logout();
    navigate("/");
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <header className="flex items-center justify-between gap-3 border-b border-slate-800 bg-slate-900 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
      {/* Left Side */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onMenuClick} className="rounded-lg p-2 hover:bg-slate-800 lg:hidden" aria-label="Open navigation">
            <Menu size={22} />
          </button>
          <h2 className="truncate text-lg font-bold sm:text-2xl">
          {greeting}, {user?.name || "User"} 👋
          </h2>
        </div>

        <div className="mt-2 hidden items-center gap-2 text-sm text-slate-400 sm:flex">
          <CalendarDays size={16} />
          <span>{today}</span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />

          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search transactions..."
            className="w-80 rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500"
          />
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 transition hover:border-blue-500"
          >
            <div className="relative">
              <UserCircle2
                size={42}
                className="text-blue-400"
              />

              <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-slate-950 bg-green-500"></span>
            </div>

            <div className="hidden text-left lg:block">
              <p className="font-semibold">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-slate-400">
                Premium User
              </p>
            </div>

            <ChevronDown size={18} />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
              <button onClick={() => { setShowProfileMenu(false); navigate('/settings'); }} className="w-full px-5 py-3 text-left transition hover:bg-slate-800">
                👤 My Profile
              </button>

              <button onClick={handleSettings} className="w-full px-5 py-3 text-left transition hover:bg-slate-800">
                ⚙️ Settings
              </button>

              <button onClick={handleLogout} className="w-full px-5 py-3 text-left text-red-400 transition hover:bg-slate-800">
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;