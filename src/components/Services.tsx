import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Search, Palette, MessageSquare, Megaphone, Bot } from "lucide-react";

const services = [
  {
    icon: Cloud,
    title: "Cloud Computing",
    description: "Streamline your operations with scalable cloud infrastructure and tools. We specialize in cloud migration, storage optimization, and cost reduction strategies."
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description: "Boost your online presence with advanced SEO strategies. Our services include technical SEO audits, keyword research, and comprehensive analytics."
  },
  {
    icon: Palette,
    title: "UX Optimizations",
    description: "Improve user experience and retention with intuitive design. We focus on user research, usability testing, and creating effective wireframes."
  },
  {
    icon: MessageSquare,
    title: "AI Agents for Social Media",
    description: "Automate and personalize your social media marketing campaigns with chatbots, content generation, and intelligent audience targeting."
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description: "Reach your target audience with data-driven marketing strategies including paid ads, email marketing, and influencer collaborations."
  },
  {
    icon: Bot,
    title: "AI Agents Workflows",
    description: "Modernize your business operations with intelligent AI agents that automate tasks, enhance decision-making, and streamline workflows across departments."
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Our Services</h2>
        <p className="text-xl text-center text-gray-600 mb-16">Tailored Solutions for Digital Transformation</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="mb-4">
                  <service.icon className="h-12 w-12 text-black" />
                </div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}