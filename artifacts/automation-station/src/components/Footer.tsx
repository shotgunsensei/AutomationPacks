import { Terminal } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Terminal className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-xl tracking-tight">
                Automation<span className="text-primary">Station</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              Your central hub for professional PC automation scripts. Boost your productivity with high-quality scripts tailored for modern workflows.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="/library" className="text-muted-foreground hover:text-primary transition-colors">Script Library</Link></li>
              <li><Link href="/generate" className="text-muted-foreground hover:text-primary transition-colors">AI Generator</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Account</h4>
            <ul className="space-y-3">
              <li><Link href="/account" className="text-muted-foreground hover:text-primary transition-colors">Manage Subscription</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border/50 text-center md:text-left text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Automation Station. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
