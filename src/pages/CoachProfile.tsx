import React from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Award, Users, Calendar, Sparkles, MessageCircle } from 'lucide-react';

const SPECIALTIES = ['Скокове', 'Технически елементи', 'Програми'];

const COACH_NOTES = [
  {
    date: '24 април 2026',
    student: 'Анна П.',
    note: 'Чудесен напредък в двойния салхов днес. Фокусирай се върху позицията на ръцете при приземяване — това ще ти даде повече стабилност.',
  },
  {
    date: '22 април 2026',
    student: 'Михаил К.',
    note: 'Програмата ти изглежда все по-уверена. Работи върху дишането между елементите — ще ти помогне да запазиш енергия за финала.',
  },
  {
    date: '20 април 2026',
    student: 'София Д.',
    note: 'Браво за смелостта да опиташ троен тулуп днес! Не бързай — техниката идва с повторение. Гордея се с теб.',
  },
];

const CoachProfile: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    document.title = 'Треньор Мария Иванова | IceNotes';
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-5 md:px-10 py-10 space-y-8">
        {/* Profile header */}
        <Card className="border-primary/10 bg-gradient-to-br from-primary/5 via-accent/5 to-background overflow-hidden">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
              <Avatar className="w-28 h-28 border-4 border-primary/20 shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-3xl font-bold font-serif">
                  МИ
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-3">
                <div>
                  <h1 className="text-3xl font-bold font-serif text-foreground">
                    Треньор Мария Иванова
                  </h1>
                  <p className="text-muted-foreground mt-1">Треньор по фигурно пързаляне</p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {SPECIALTIES.map((s) => (
                    <Badge key={s} variant="secondary" className="rounded-full px-3 py-1">
                      {s}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">12 години опит</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">24 активни спортисти</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-primary" />
              За мен
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90 leading-relaxed">
              Квалифициран треньор по фигурно пързаляне с богат опит в работата с деца и юноши.
              Специализирам в технически елементи и артистично изпълнение. Помагам на спортистите
              да развият не само техническите си умения, но и психологическата устойчивост и
              увереност на леда.
            </p>
          </CardContent>
        </Card>

        {/* Coach notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="w-5 h-5 text-primary" />
              Последни бележки от треньора
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {COACH_NOTES.map((n, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border border-border/60 bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">{n.student}</span>
                  <span className="text-xs text-muted-foreground">{n.date}</span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed italic">"{n.note}"</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6 pb-6">
              <Award className="w-6 h-6 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold font-serif">12</div>
              <div className="text-xs text-muted-foreground">години опит</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6 pb-6">
              <Users className="w-6 h-6 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold font-serif">24</div>
              <div className="text-xs text-muted-foreground">спортисти</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6 pb-6">
              <Sparkles className="w-6 h-6 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold font-serif">3</div>
              <div className="text-xs text-muted-foreground">специалности</div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CoachProfile;
