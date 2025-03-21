import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowDown } from "lucide-react";
import { WordRotate } from "@/components/ui/word-rotate";
import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function Hero() {
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ "namespace": "30min" });
      cal("ui", { "theme": "dark", "hideEventTypeDetails": false, "layout": "month_view" });
    })();
  }, []);

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20"></div>
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Modernizing Businesses with {" "}
            <span className="inline-flex">
              <WordRotate
                words={["AI Agents", "Cloud", "Digital Expertise"]}
                className="inline-flex"
              />
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-300">
            Transform your business with cutting-edge AI workflows, cloud solutions, SEO strategies, and UX optimizations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center"> 
            <Button size="lg" className="group" data-cal-namespace="30min"
              data-cal-link="kaba-digital-inc/30min"
              data-cal-config='{"layout":"month_view","theme":"dark"}'
            >
              Book a Consultation
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>


      
            <Button variant="outline" size="lg" onClick={scrollToServices} className="group text-black bg-white hover:bg-white/90">
              Explore Our Services
              <ArrowDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}