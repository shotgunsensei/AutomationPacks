import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Terminal, Code2, Loader2, ArrowRight } from "lucide-react";
import { useGetSubscriptionStatus } from "@workspace/api-client-react";

export default function GenerateAI() {
  const [prompt, setPrompt] = useState("");
  const [format, setFormat] = useState("powershell");
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: subStatus } = useGetSubscriptionStatus();

  const isPro = subStatus?.tier === 'pro';

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPro) return;
    setIsGenerating(true);
    // Future API call would go here
    setTimeout(() => {
      setIsGenerating(false);
      alert("AI Generation endpoint not fully wired in backend yet, but UI is ready!");
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 relative">
      {!isPro && (
        <div className="absolute inset-0 z-20 backdrop-blur-sm bg-background/50 flex items-center justify-center pt-20 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-3xl max-w-lg text-center border-secondary/30 relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary to-secondary"></div>
            <Sparkles className="w-12 h-12 text-secondary mx-auto mb-6" />
            <h2 className="text-3xl font-bold font-display mb-4">Pro Feature</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Unlock the power of AI script generation. Describe any automation task and get a ready-to-use script instantly.
            </p>
            <a href="/pricing" className="inline-flex px-8 py-4 rounded-xl bg-secondary text-white font-semibold hover:bg-secondary/90 transition-colors w-full justify-center shadow-lg shadow-secondary/25">
              Upgrade to Pro for $10/mo
            </a>
          </motion.div>
        </div>
      )}

      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${!isPro ? 'pointer-events-none opacity-50 filter blur-[2px]' : ''}`}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-secondary/10 text-secondary mb-6 border border-secondary/20 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">AI Script Generator</h1>
          <p className="text-xl text-muted-foreground">Describe your workflow. We'll write the code.</p>
        </div>

        <motion.div className="glass rounded-3xl p-8 relative overflow-hidden">
          <form onSubmit={handleGenerate}>
            <div className="mb-8">
              <label className="block text-sm font-medium text-foreground mb-3">Target Format</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'powershell', label: 'PowerShell', icon: <Terminal className="w-4 h-4" /> },
                  { id: 'python', label: 'Python', icon: <Code2 className="w-4 h-4" /> },
                  { id: 'batch', label: 'Batch', icon: <Terminal className="w-4 h-4" /> },
                  { id: 'bash', label: 'Bash', icon: <Terminal className="w-4 h-4" /> },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFormat(f.id)}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${
                      format === f.id 
                        ? 'border-secondary bg-secondary/10 text-secondary' 
                        : 'border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground'
                    }`}
                  >
                    {f.icon}
                    <span className="font-medium text-sm">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-foreground mb-3">Description</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., Write a script that checks my downloads folder and moves all images to a 'Pictures' folder and PDFs to a 'Documents' folder..."
                className="w-full h-40 px-4 py-3 bg-background border border-white/10 rounded-xl focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary resize-none"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isGenerating || !prompt}
                className="px-8 py-4 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-bold transition-all shadow-lg shadow-secondary/25 hover:shadow-secondary/40 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Generating Magic...</>
                ) : (
                  <>Generate Script <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
