/**
 * Landing Page Component.
 * Marketing page with hero section and feature highlights.
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import {
  CheckSquare,
  ArrowRight,
  CheckCircle2,
  Clock,
  Tag,
  Calendar,
  Zap,
  Shield,
  Smartphone,
  Sun,
  Moon,
} from 'lucide-react';

const features = [
  {
    icon: CheckCircle2,
    title: 'Stay Organized',
    description: 'Track all your tasks in one place with intuitive status management.',
  },
  {
    icon: Clock,
    title: 'Meet Deadlines',
    description: 'Set due dates and get reminders to never miss an important task.',
  },
  {
    icon: Tag,
    title: 'Categorize',
    description: 'Organize tasks by categories and tags for easy filtering.',
  },
  {
    icon: Calendar,
    title: 'Plan Ahead',
    description: 'View your upcoming tasks and plan your week effectively.',
  },
  {
    icon: Zap,
    title: 'Priority Focus',
    description: 'Set priorities to focus on what matters most.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and never shared with third parties.',
  },
];

export default function Index() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <CheckSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">TaskFlow</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-6 animate-fade-in">
            <Smartphone className="h-4 w-4" />
            Now available on all devices
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-slide-up">
            Organize your life,{' '}
            <span className="text-gradient">one task at a time</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up">
            TaskFlow is the simple, beautiful way to manage your tasks. 
            Stay focused, meet deadlines, and achieve your goals with our 
            intuitive task management system.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Button size="lg" asChild className="text-base px-8">
              <Link to="/register">
                Start for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base px-8">
              <Link to="/dashboard">
                Try Demo
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t max-w-xl mx-auto">
            <div className="animate-fade-in">
              <p className="text-3xl font-bold">10k+</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <div className="animate-fade-in">
              <p className="text-3xl font-bold">500k+</p>
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
            </div>
            <div className="animate-fade-in">
              <p className="text-3xl font-bold">99.9%</p>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to stay productive
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you manage tasks efficiently 
              and achieve more every day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-200 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of users who are already managing their tasks 
            more effectively with TaskFlow.
          </p>
          <Button size="lg" asChild className="text-base px-8">
            <Link to="/register">
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <CheckSquare className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">TaskFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TaskFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
