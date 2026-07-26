import { motion } from "framer-motion";
import {
  Brain,
  Wallet,
  FileText,
  BarChart3,
} from "lucide-react";

import Card from "../common/Card";
import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";

const features = [
  {
    icon: Brain,
    title: "AI Insights",
    description:
      "Get personalised financial recommendations powered by AI.",
  },
  {
    icon: FileText,
    title: "Statement Upload",
    description:
      "Upload PDF or CSV bank statements and extract transactions automatically.",
  },
  {
    icon: Wallet,
    title: "Budget Prediction",
    description:
      "Predict future expenses and manage your monthly budget effectively.",
  },
  {
    icon: BarChart3,
    title: "Expense Analytics",
    description:
      "Visualise spending trends using beautiful interactive charts.",
  },
];

const Features = () => {
  return (
    <section className="py-28">

      <Container>

        <SectionTitle
          title="Everything you need"
          subtitle="Powerful AI features designed to help you understand and improve your financial habits."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {features.map((feature, index) => {

            const Icon = feature.icon;

            return (

              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
              >

                <Card className="h-full hover:-translate-y-2">

                  <div className="mb-6 inline-flex rounded-2xl bg-blue-600 p-4">

                    <Icon size={30} />

                  </div>

                  <h3 className="text-2xl font-bold">

                    {feature.title}

                  </h3>

                  <p className="mt-4 text-slate-400">

                    {feature.description}

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

export default Features;