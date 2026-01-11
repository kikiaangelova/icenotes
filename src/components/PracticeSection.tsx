import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Brain, Clock, Star, Snowflake } from 'lucide-react';

const practiceCategories = [
  {
    id: 'on-ice',
    title: 'On-Ice Training',
    description: 'Jumps, spins, footwork, and programs',
    icon: Snowflake,
    colorClass: 'practice-on-ice',
    iconColor: 'text-on-ice',
    activities: [
      { name: 'Edge work & stroking', duration: '15-20 min' },
      { name: 'Spins practice', duration: '20-30 min' },
      { name: 'Jump technique', duration: '30-45 min' },
      { name: 'Program run-through', duration: '15-20 min' },
      { name: 'Choreography', duration: '20-30 min' },
    ],
  },
  {
    id: 'off-ice',
    title: 'Off-Ice Training',
    description: 'Strength, flexibility, and conditioning',
    icon: Dumbbell,
    colorClass: 'practice-off-ice',
    iconColor: 'text-off-ice',
    activities: [
      { name: 'Warm-up & stretching', duration: '10-15 min' },
      { name: 'Core strengthening', duration: '15-20 min' },
      { name: 'Jump simulation', duration: '20-30 min' },
      { name: 'Ballet & dance', duration: '30-45 min' },
      { name: 'Cardio conditioning', duration: '20-30 min' },
    ],
  },
  {
    id: 'mental',
    title: 'Mental Preparation',
    description: 'Visualization, focus, and mindset',
    icon: Brain,
    colorClass: 'practice-mental',
    iconColor: 'text-mental',
    activities: [
      { name: 'Program visualization', duration: '10-15 min' },
      { name: 'Breathing exercises', duration: '5-10 min' },
      { name: 'Goal review', duration: '5-10 min' },
      { name: 'Competition simulation', duration: '15-20 min' },
      { name: 'Positive affirmations', duration: '5 min' },
    ],
  },
];

export const PracticeSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Daily Practice</h2>
          <p className="text-muted-foreground">Track your training across all disciplines</p>
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
