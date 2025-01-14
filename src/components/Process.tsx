import { Search, Code, LineChart } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover",
    description: "Understand your business needs through consultation and in-depth analysis.",
    details: "We start by deeply understanding your business goals, challenges, and vision through comprehensive consultation sessions."
  },
  {
    icon: Code,
    title: "Design & Implement",
    description: "Develop custom AI workflows, cloud solutions, and marketing strategies.",
    details: "Our team creates tailored solutions that align with your objectives, implementing cutting-edge technologies and proven methodologies."
  },
  {
    icon: LineChart,
    title: "Optimize & Support",
    description: "Continuously improve with analytics and feedback-driven optimization.",
    details: "We monitor performance, gather insights, and make data-driven improvements to ensure long-term success and ROI."
  }
];

export default function Process() {
  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Our Process</h2>
          <p className="text-xl text-gray-300">
            A proven methodology that delivers results through strategic planning and execution
          </p>
        </div>
        
        <div className="space-y-12 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 group">
                <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/20 group-hover:bg-white/10 transition-all duration-300">
                  <step.icon className="h-8 w-8" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl font-bold text-white/20">0{index + 1}</span>
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                  </div>
                  <p className="text-lg text-gray-300 mb-4">{step.description}</p>
                  <p className="text-gray-400">{step.details}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-10 top-24 bottom-0 w-[1px] bg-gradient-to-b from-white/20 to-transparent h-20"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}