import { Button } from "@/components/ui/button";
import synergySphereLogo from "@/assets/synergysphere-logo.png";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <img 
              src={synergySphereLogo} 
              alt="SynergySphere" 
              className="h-8 w-8"
            />
            <span className="text-xl font-bold">SynergySphere</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">
              Demo
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/login'}
            >
              Sign In
            </Button>
            <Button 
              variant="hero" 
              size="sm"
              onClick={() => window.location.href = '/register'}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}