import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

import useAuth from "../../hooks/useAuth";
import Logo from "../common/Logo";
import Button from "../common/Button";
import Container from "../common/Container";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
      <Container className="relative flex h-20 items-center justify-between">

        <Logo />

        <div className="hidden md:flex items-center gap-8">

          <a
            href="#features"
            className="text-slate-300 hover:text-white transition"
          >
            Features
          </a>

          <a
            href="#analytics"
            className="text-slate-300 hover:text-white transition"
          >
            Analytics
          </a>

          <a
            href="#about"
            className="text-slate-300 hover:text-white transition"
          >
            About
          </a>

        </div>

        <div className="hidden md:flex items-center gap-4">

          <Link to="/login">
            <Button variant="secondary">
              Login
            </Button>
          </Link>

          <Button onClick={handleGetStarted}>
            Get Started
          </Button>

        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-slate-200 hover:bg-slate-800 md:hidden"
        >
          <Menu />
        </button>

        {menuOpen && (
          <div className="absolute left-4 right-4 top-[4.5rem] rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-2xl md:hidden">
            <div className="flex flex-col gap-2">
              <a onClick={() => setMenuOpen(false)} href="#features" className="rounded-lg px-3 py-3 text-slate-300 hover:bg-slate-800 hover:text-white">Features</a>
              <a onClick={() => setMenuOpen(false)} href="#analytics" className="rounded-lg px-3 py-3 text-slate-300 hover:bg-slate-800 hover:text-white">Analytics</a>
              <a onClick={() => setMenuOpen(false)} href="#about" className="rounded-lg px-3 py-3 text-slate-300 hover:bg-slate-800 hover:text-white">About</a>
              <div className="mt-2 flex gap-2 border-t border-slate-800 pt-3">
                <Link onClick={() => setMenuOpen(false)} className="flex-1" to="/login"><Button className="w-full" variant="secondary">Login</Button></Link>
                <Button className="flex-1" onClick={() => { setMenuOpen(false); handleGetStarted(); }}>Get Started</Button>
              </div>
            </div>
          </div>
        )}

      </Container>
    </nav>
  );
};

export default Navbar;