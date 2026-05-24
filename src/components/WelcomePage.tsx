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
    title: 'Скокове',
    description: 'Записвай всеки опит — от тулуп до аксел. Виж кое ти върви и кое не.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: TrendingUp,
    title: 'Прогрес',
    description: 'Прости графики за настроение, енергия и тренировки във времето.',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    icon: Brain,
    title: 'Глава',
    description: 'Дишане, визуализация и кратки напомняния за преди и след лед.',
    color: 'text-mental',
    bg: 'bg-mental/10',
  },
  {
    icon: Heart,
    title: 'Всеки ден',
    description: 'Сън, настроение, енергия. Това, което влияе на тренировката.',
    color: 'text-off-ice',
    bg: 'bg-off-ice/10',
  },
];


export const WelcomePage: React.FC<WelcomePageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ice via-background to-background">
      {/* Hero Section */}
      <div className="container max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center space-y-6 mb-16">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm">
            <Sparkles className="w-4 h-4 mr-2 inline" />
            За фигуристи, по фигуристи
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Дневникът на
            <span className="gradient-text block mt-2">твоето каране</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Записвай скокове, тренировки и как си се чувствал(а).
            След месец ще виждаш разликата.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="text-lg px-8 h-14 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              Влез
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Безплатно • Без карта
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
                <div className="text-sm text-muted-foreground">Безплатно</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-success">6</div>
                <div className="text-sm text-muted-foreground">вида скокове</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-mental">12+</div>
                <div className="text-sm text-muted-foreground">упражнения за глава</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-gold">∞</div>
                <div className="text-sm text-muted-foreground">тренировки напред</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final CTA */}
        <Card className="bg-gradient-to-br from-primary to-accent text-white overflow-hidden">
          <CardContent className="p-8 md:p-12 text-center relative">
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
              <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full border border-white/40" />
              <div className="absolute -bottom-16 -right-10 w-72 h-72 rounded-full border border-white/30" />
            </div>
            <div className="relative z-10 space-y-4">
              <Zap className="w-12 h-12 mx-auto opacity-90" />
              <h2 className="text-2xl md:text-3xl font-bold">
                Готов(а) да започнеш?
              </h2>
              <p className="text-white/80 max-w-lg mx-auto">
                Регистрирай се и запиши първата си тренировка. Две минути.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={onGetStarted}
                className="text-lg px-8 h-14 mt-4"
              >
                Влез
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
