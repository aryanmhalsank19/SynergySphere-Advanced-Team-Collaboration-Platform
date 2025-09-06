import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Kanban, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Clock, 
  Shield 
} from "lucide-react";

const features = [
  {
    icon: Kanban,
    title: "Task Management",
    description: "Intuitive Kanban boards with drag-and-drop functionality. Track progress and manage workflows effortlessly."
  },
  {
    icon: MessageSquare,
    title: "Team Communication",
    description: "Project-specific threaded discussions keep conversations organized and accessible to relevant team members."
  },
  {
    icon: BarChart3,
    title: "Smart Insights",
    description: "Proactive workload analysis and deadline warnings help prevent bottlenecks before they impact your project."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Seamless project membership management with role-based permissions and easy team coordination."
  },
  {
    icon: Clock,
    title: "Real-time Updates",
    description: "Stay synchronized with instant notifications and live activity feeds across all your projects."
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with JWT authentication and reliable data protection for your team's work."
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything your team needs to
            <span className="gradient-text"> succeed together</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From task management to team insights, SynergySphere provides all the tools 
            you need to keep your projects on track and your team in sync.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border-0 gradient-border"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}