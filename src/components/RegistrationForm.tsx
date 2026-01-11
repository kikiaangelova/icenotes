import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSkater } from '@/context/SkaterContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, User, Ruler, Weight, Calendar } from 'lucide-react';

const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  age: z.number().min(4, 'Age must be at least 4').max(99, 'Age must be less than 100'),
  weight: z.number().min(15, 'Weight must be at least 15 kg').max(200, 'Weight must be less than 200 kg'),
  height: z.number().min(80, 'Height must be at least 80 cm').max(250, 'Height must be less than 250 cm'),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'competitive']),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  onComplete: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onComplete }) => {
  const { setProfile } = useSkater();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      level: 'beginner',
    },
  });

  const onSubmit = (data: RegistrationFormData) => {
    const profile = {
      id: crypto.randomUUID(),
      name: data.name,
      age: data.age,
      weight: data.weight,
      height: data.height,
      level: data.level,
      createdAt: new Date(),
    };
    setProfile(profile);
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gradient-hero)' }}>
      <Card className="w-full max-w-lg glass-card animate-fade-in">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl gradient-text">Welcome to IcePrep</CardTitle>
          <CardDescription className="text-muted-foreground">
            Let's set up your skating profile to personalize your training
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your name"
                {...register('name')}
                className="h-11"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Years"
                  {...register('age', { valueAsNumber: true })}
                  className="h-11"
                />
                {errors.age && (
                  <p className="text-sm text-destructive">{errors.age.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center gap-2">
                  <Weight className="w-4 h-4 text-muted-foreground" />
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="kg"
                  {...register('weight', { valueAsNumber: true })}
                  className="h-11"
                />
                {errors.weight && (
                  <p className="text-sm text-destructive">{errors.weight.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height" className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-muted-foreground" />
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="cm"
                  {...register('height', { valueAsNumber: true })}
                  className="h-11"
                />
                {errors.height && (
                  <p className="text-sm text-destructive">{errors.height.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Skating Level</Label>
                <Select 
                  defaultValue="beginner" 
                  onValueChange={(value) => setValue('level', value as any)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="competitive">Competitive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-medium mt-6">
              Start Your Journey
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
