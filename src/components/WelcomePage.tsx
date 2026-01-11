import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Target, 
  Brain, 
  TrendingUp, 
  Heart,
  ChevronRight,
  Star,
  Zap
} from 'lucide-react';

interface WelcomePageProps {
  onGetStarted: () => void;
}

const FEATURES = [
  {
    icon: Target,
    title: 'Jump Tracking',
    description: 'Log every attempt - from toe loops to triple axels. Track your success rates and watch your progress soar.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Beautiful charts show your mood, energy, and skating improvements over time.',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    icon: Brain,
    title: 'Mental Training',
    description: 'Guided visualization, breathing exercises, and affirmations to strengthen your mental game.',
    color: 'text-mental',
    bg: 'bg-mental/10',
  },
  {
    icon: Heart,
    title: 'Daily Wellness',
    description: 'Track sleep, mood, and energy to optimize your training and recovery.',
    color: 'text-off-ice',
    bg: 'bg-off-ice/10',
  },
];

const TESTIMONIALS = [
  { quote: "Finally an app that understands what skaters need!", name: "Competition Skater" },
  { quote: "The mental training section transformed my performance.", name: "Advanced Skater" },
  { quote: "I love seeing my jump progress visualized!", name: "Intermediate Skater" },
];

export const WelcomePage: React.FC<WelcomePageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ice via-background to-background">
      {/* Hero Section */}
      <div className="container max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center space-y-6 mb-16">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm">
            <Sparkles className="w-4 h-4 mr-2 inline" />
            Your Figure Skating Companion
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Elevate Your
            <span className="gradient-text block mt-2">Skating Journey</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your jumps, strengthen your mind, and achieve your skating goals with 
            the most comprehensive training companion for figure skaters worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="text-lg px-8 h-14 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              Get Started Free
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Join skaters from around the world • No credit card required
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {FEATURES.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30"
            >
              <CardContent className="p-6 space-y-4">
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Banner */}
        <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-mental/10 border-none mb-16">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Free to Use</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-success">6</div>
                <div className="text-sm text-muted-foreground">Jump Types</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-mental">12+</div>
                <div className="text-sm text-muted-foreground">Mental Exercises</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-gold">∞</div>
                <div className="text-sm text-muted-foreground">Potential</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-8">Loved by Skaters</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <Card key={index} className="glass-card">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
                  <p className="text-sm font-medium">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <Card className="bg-gradient-to-br from-primary to-accent text-white overflow-hidden">
          <CardContent className="p-8 md:p-12 text-center relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-8 text-6xl">⛸️</div>
              <div className="absolute bottom-4 right-8 text-6xl">🏆</div>
            </div>
            <div className="relative z-10 space-y-4">
              <Zap className="w-12 h-12 mx-auto opacity-90" />
              <h2 className="text-2xl md:text-3xl font-bold">
                Ready to Transform Your Skating?
              </h2>
              <p className="text-white/80 max-w-lg mx-auto">
                Join the community of dedicated figure skaters who are taking their training to the next level.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={onGetStarted}
                className="text-lg px-8 h-14 mt-4"
              >
                Start Your Journey
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
