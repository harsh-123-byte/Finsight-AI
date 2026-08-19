import { motion } from "framer-motion";
import {
  FileText,
  Brain,
  IndianRupee,
  Clock3,
} from "lucide-react";

import Card from "../common/Card";
import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";

const stats = [
  {
    icon: FileText,
    number: "12K+",
    title: "Statements Processed",
  },
  {
    icon: Brain,
    number: "96%",
    title: "AI Prediction Accuracy",
  },
  {
    icon: IndianRupee,
    number: "₹2.4Cr",
    title: "Transactions Analysed",
  },
  {
    icon: Clock3,
    number: "24/7",
    title: "AI Financial Assistant",
  },
];

const Stats = () => {
  return (
    <section id="analytics" className="scroll-mt-20 py-28">

      <Container>

        <SectionTitle
          title="Trusted by Thousands"
          subtitle="Built to simplify personal finance with intelligent insights."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {stats.map((stat, index) => {

            const Icon = stat.icon;

            return (

              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
              >

                <Card className="text-center hover:-translate-y-2">

                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">

                    <Icon size={30} />

                  </div>

                  <h2 className="text-4xl font-extrabold text-blue-400">

                    {stat.number}

                  </h2>

                  <p className="mt-4 text-slate-400">

                    {stat.title}

                  </p>

                </Card>

              </motion.div>

            );

          })}

        </div>

      </Container>

    </section>
  );
};

export default Stats;