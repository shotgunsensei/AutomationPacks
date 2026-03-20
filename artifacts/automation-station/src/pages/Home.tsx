import { motion } from "framer-motion";
import { Terminal, Zap, Shield, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const features = [
    {
      icon: <Terminal className="w-6 h-6 text-primary" />,
      title: "Extensive Library",
      description: "Browse hundreds of curated automation scripts for PowerShell, Batch, Python and more."
    },
    {
      icon: <Zap className="w-6 h-6 text-secondary" />,
      title: "AI Script Generator",
      description: "Describe what you need in plain English and our AI will instantly write a custom script for you."
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Vetted & Secure",
      description: "All default library scripts are vetted for security. Build your automation workflow with confidence."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Tech background" 
            className="w-full h-full object-cover opacity-30 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-primary/20 text-primary/80 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Platform is Live
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-6">
              Automate your PC <br className="hidden md:block" />
              <span className="text-gradient">with zero friction.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Access a premium library of automation scripts or let our AI generate custom workflows tailored exactly to your needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/pricing" 
                className="px-8 py-4 rounded-xl font-semibold bg-primary text-primary-foreground neon-shadow neon-shadow-hover transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto text-lg flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/library" 
                className="px-8 py-4 rounded-xl font-semibold glass glass-hover text-foreground transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto text-lg"
              >
                Browse Library
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Everything you need to automate</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Stop performing repetitive tasks. Leverage our vast collection of scripts to reclaim your time.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="glass p-8 rounded-2xl"
              >
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
