import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { logoutUser } from "../../services/authService";
import {
  LayoutDashboard,
  Receipt,
  Upload,
  Brain,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    path: "/transactions",
    icon: Receipt,
  },
  {
    title: "Upload Statement",
    path: "/upload",
    icon: Upload,
  },
  {
    title: "AI Insights",
    path: "/analytics",
    icon: Brain,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      // ignore errors
    }

    logout();
    navigate("/");
  };

  return (
    <aside
      className={`sticky top-0 h-screen border-r border-slate-800 bg-slate-900 transition-all duration-300 ${
        collapsed ? "w-24" : "w-72"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        {!collapsed && (
          <button
            onClick={() => navigate("/")}
            className="text-2xl font-black text-blue-500 transition hover:text-blue-300"
          >
            FinSight AI
          </button>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-2 hover:bg-slate-800"
        >
          {collapsed ? (
            <PanelLeftOpen size={22} />
          ) : (
            <PanelLeftClose size={22} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-8 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `mb-3 flex w-full items-center gap-4 rounded-xl px-4 py-3 transition-all ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-blue-600 hover:text-white"
                }`
              }
            >
              <Icon size={22} />

              {!collapsed && (
                <span className="font-medium">
                  {item.title}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 left-3 right-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-500 py-3 font-semibold transition hover:bg-red-600"
        >
          <LogOut size={20} />

          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;