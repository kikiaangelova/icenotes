import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Brain, Clock, Star, Snowflake } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const PracticeSection: React.FC = () => {
  const { t } = useLanguage();

  const practiceCategories = [
    {
      id: 'on-ice',
      title: t('training.onIce.title'),
      description: t('training.onIce.desc'),
      icon: Snowflake,
      colorClass: 'practice-on-ice',
      iconColor: 'text-on-ice',
      activities: [
        { name: t('training.onIce.edges'), duration: '15-20 min' },
        { name: t('training.onIce.spins'), duration: '20-30 min' },
        { name: t('training.onIce.jumps'), duration: '30-45 min' },
        { name: t('training.onIce.program'), duration: '15-20 min' },
        { name: t('training.onIce.choreo'), duration: '20-30 min' },
      ],
    },
    {
      id: 'off-ice',
      title: t('training.offIce.title'),
      description: t('training.offIce.desc'),
      icon: Dumbbell,
      colorClass: 'practice-off-ice',
      iconColor: 'text-off-ice',
      activities: [
        { name: t('training.offIce.warmup'), duration: '10-15 min' },
        { name: t('training.offIce.core'), duration: '15-20 min' },
        { name: t('training.offIce.jumpSim'), duration: '20-30 min' },
        { name: t('training.offIce.ballet'), duration: '30-45 min' },
        { name: t('training.offIce.cardio'), duration: '20-30 min' },
      ],
    },
    {
      id: 'mental',
      title: t('training.mental.title'),
      description: t('training.mental.desc'),
      icon: Brain,
      colorClass: 'practice-mental',
      iconColor: 'text-mental',
      activities: [
        { name: t('training.mental.visualization'), duration: '10-15 min' },
        { name: t('training.mental.breathing'), duration: '5-10 min' },
        { name: t('training.mental.goalReview'), duration: '5-10 min' },
        { name: t('training.mental.competition'), duration: '15-20 min' },
        { name: t('training.mental.affirmations'), duration: '5 min' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('training.heading')}</h2>
          <p className="text-muted-foreground">{t('training.subheading')}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {practiceCategories.map((category) => (
          <Card key={category.id} className={`practice-card ${category.colorClass}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-background/80 flex items-center justify-center`}>
                  <category.icon className={`w-5 h-5 ${category.iconColor}`} />
                </div>
                <div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription className="text-xs">{category.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/60 hover:bg-background/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Star className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-sm font-medium">{activity.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {activity.duration}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
