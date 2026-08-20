import { motion } from "framer-motion";
import Container from "../common/Container";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <section className="min-h-screen bg-slate-950 flex items-center">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Section */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">

              Manage Your

              <span className="text-blue-500">

                {" "}Money

              </span>

              <br />

              Smarter.

            </h1>

            <p className="mt-8 text-slate-400 text-lg">

              Upload statements.

              Analyse spending.

              Predict future expenses.

              Get AI financial advice.

            </p>
          </motion.div>

          {/* Right Section */}

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="
                rounded-3xl
                border
                border-slate-800
                bg-slate-900
                p-10
                shadow-2xl
              "
            >
              <h2 className="text-4xl font-bold">

                {title}

              </h2>

              <p className="mt-3 text-slate-400">

                {subtitle}

              </p>

              <div className="mt-10">

                {children}

              </div>

            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
};

export default AuthLayout;