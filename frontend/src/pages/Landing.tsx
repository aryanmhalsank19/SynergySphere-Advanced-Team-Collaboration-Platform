import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BarChart3, 
  MessageSquare, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Target
} from 'lucide-react';
import { DEMO_CREDENTIALS } from '@/data/mockData';
import logo from '@/assets/logo.png';
import dashboardMockup from '@/assets/dashboard-mockup.jpg';

export default function Landing() {
  const features = [
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Seamlessly work together with real-time updates, comments, and notifications that keep everyone in sync.'
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Get deep insights into team performance, project progress, and workload distribution with beautiful charts.'
    },
    {
      icon: MessageSquare,
      title: 'Instant Communication',
      description: 'Built-in commenting system and activity feeds ensure important updates never get missed.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Modern interface with instant updates and smooth interactions that make work feel effortless.'
    }
  ];

  const benefits = [
    'Increase team productivity by 40%',
    'Reduce project delays by 60%',
    'Improve communication clarity',
    'Get real-time project insights'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-subtle to-success-subtle">
      {/* Header */}
      <header className="relative z-10">
        <nav className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SynergySphere" className="h-10 w-10" />
            <span className="text-xl font-bold text-foreground">SynergySphere</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/login" className="text-foreground/70 hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Button asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-6 text-center">
          <div className="mx-auto max-w-4xl">
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              <Sparkles className="mr-2 h-4 w-4" />
              Now in Beta - Join the Revolution
            </Badge>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground lg:text-6xl">
              Where Teams 
              <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent"> Synergize</span>
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground lg:text-xl">
              Transform your team collaboration with intelligent project management, 
              real-time insights, and seamless communication in one unified platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" asChild className="px-8 py-3 text-lg">
                <Link to="/register">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="px-8 py-3 text-lg">
                <Link to="/login">View Demo</Link>
              </Button>
            </div>

            {/* Demo Credentials */}
            <Card className="mx-auto max-w-md border-primary/20 bg-primary-subtle/50">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-primary mb-2">Demo Credentials:</p>
                <p className="text-sm text-muted-foreground">
                  <strong>Email:</strong> {DEMO_CREDENTIALS.email}<br />
                  <strong>Password:</strong> {DEMO_CREDENTIALS.password}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {DEMO_CREDENTIALS.note}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-background/50">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-6xl">
            <div className="relative">
              <img 
                src={dashboardMockup} 
                alt="SynergySphere Dashboard" 
                className="w-full rounded-2xl shadow-2xl border border-border/50"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground lg:text-4xl mb-4">
                Everything your team needs to succeed
              </h2>
              <p className="text-lg text-muted-foreground">
                Powerful features designed to streamline your workflow
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card key={index} className="border-border/50 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-surface-elevated">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground lg:text-4xl mb-6">
                  Proven results that speak for themselves
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join thousands of teams who have transformed their productivity with SynergySphere.
                </p>
                
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-success flex-shrink-0" />
                      <span className="text-foreground font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-success/5">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <Target className="w-16 h-16 text-primary mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        Ready to get started?
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Join the platform that's changing how teams work together.
                      </p>
                      <Button size="lg" asChild className="w-full">
                        <Link to="/register">Start Your Free Trial</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src={logo} alt="SynergySphere" className="h-8 w-8" />
                <span className="text-lg font-bold text-foreground">SynergySphere</span>
              </div>
              <p className="text-muted-foreground">
                The next generation team collaboration platform that brings synergy to your workflow.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2024 SynergySphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}