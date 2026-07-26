import { Wallet } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div
        className="
        p-2
        rounded-xl
        bg-blue-600
      "
      >
        <Wallet size={24} />
      </div>

      <h1
        className="
        text-2xl
        font-bold
        tracking-wide
      "
      >
        FinSight AI
      </h1>
    </div>
  );
};

export default Logo;