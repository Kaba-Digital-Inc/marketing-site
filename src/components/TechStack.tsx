import { Code2, Database, Cloud, Shield } from "lucide-react";

const technologies = [
  { icon: Code2, label: "Modern Frontend" },
  { icon: Database, label: "Scalable Backend" },
  { icon: Cloud, label: "Cloud Infrastructure" },
  { icon: Shield, label: "Security First" }
];

export default function TechStack() {
  return (
    <section id="tech-stack" className="py-24 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Our Tech Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {technologies.map((tech, index) => (
            <div 
              key={index} 
              className="text-center p-6 border border-white/10 rounded-lg hover:border-white/20 transition-all duration-300 hover:scale-105"
            >
              <tech.icon className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{tech.label}</h3>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <p className="text-lg text-gray-300">
            We leverage cutting-edge technologies to deliver scalable, secure, and performant solutions for our clients.
          </p>
        </div>
      </div>
    </section>
  );
}