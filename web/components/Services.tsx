"use client";

import { motion } from "framer-motion";
import {
  Code,
  Database,
  DollarSign,
  RefreshCw,
  SettingsIcon,
  Zap,
} from "lucide-react";

const ServiceIcon = ({
  icon: Icon,
  className,
}: {
  icon: React.ElementType; // Use React.ElementType for the icon prop
  className: string;
}) => {
  return <Icon className={className} />;
};

const services = [
  {
    title: "Web Development",
    description:
      "Building responsive, scalable web applications with modern technologies.",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Management Systems",
    description:
      "Building efficient systems for inventory, employees, and overall business management.",
    icon: Database,
    color: "from-red-500 to-orange-500",
  },
  {
    title: "Payment Integration",
    description:
      "Integrating local payment systems like Waafi API for secure and seamless transactions.",
    icon: DollarSign, // Choose an appropriate icon like a dollar sign or wallet icon
    color: "from-green-500 to-teal-500",
  },

  {
    title: "Custom Solutions",
    description:
      "Developing tailor-made software to address unique business challenges and requirements.",
    icon: SettingsIcon,
    color: "from-indigo-500 to-blue-500",
  },

  {
    title: "API Development",
    description: "Designing and implementing robust backend services and APIs.",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "Ongoing System Improvements",
    description:
      "Upgrading and enhancing existing systems to meet modern demands and ensure continued success.",
    icon: RefreshCw,
    color: "from-gray-500 to-black-500",
  },
];

const Services = () => {
  return (
    <section
      id="services"
      className="w-full py-20 " // Using system background color
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            How Can I Help You?
          </h2>
          <p className=" max-w-2xl mx-auto">
            I offer a comprehensive range of services to help bring your digital
            ideas to life
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-70 transition-opacity duration-300 blur-xl`}
              />
              <div className="relative p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border hover:border-primary/50 transition-all duration-300">
                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-r ${service.color} p-3 mb-6 flex items-center justify-center`}
                >
                  <ServiceIcon
                    icon={service.icon}
                    className="w-full h-full text-white"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  {service.title}
                </h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
