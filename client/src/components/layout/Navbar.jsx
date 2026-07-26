import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

import useAuth from "../../hooks/useAuth";
import Logo from "../common/Logo";
import Button from "../common/Button";
import Container from "../common/Container";

const Navbar = () => {
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
      <Container className="flex h-20 items-center justify-between">

        <Logo />

        <div className="hidden md:flex items-center gap-8">

          <Link
            to="/"
            className="text-slate-300 hover:text-white transition"
          >
            Features
          </Link>

          <Link
            to="/"
            className="text-slate-300 hover:text-white transition"
          >
            Analytics
          </Link>

          <Link
            to="/"
            className="text-slate-300 hover:text-white transition"
          >
            Pricing
          </Link>

          <Link
            to="/"
            className="text-slate-300 hover:text-white transition"
          >
            About
          </Link>

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

        <button className="md:hidden">
          <Menu />
        </button>

      </Container>
    </nav>
  );
};

export default Navbar;