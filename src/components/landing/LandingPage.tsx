import React from 'react';
import { Button } from '@/components/ui/button';
import { Snowflake, BookOpen, Brain, Target, TrendingUp, Feather, BarChart3, Heart, ArrowRight, Quote, Sparkles, Activity, Music, Eye, MessageCircle, Dumbbell, PenLine, Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface LandingPageProps {
  onGetStarted: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <>
      {/* ─── Hero – Warm & Welcoming ─── */}
      <section className="relative z-10 px-6 md:px-12 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm md:text-base text-primary font-medium mb-6">
            Hey, skater 👋 — this one's for you.
          </p>
          <h1 className="text-[2rem] md:text-[3rem] lg:text-[3.75rem] font-bold leading-[1.12] tracking-[-0.025em] text-foreground font-serif mb-8">
            Your skating journey
            <br />
            deserves to be
            <br />
            <span className="text-primary">remembered.</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
            IceNotes is your personal skating journal — a friendly, private space to write 
            about your sessions, notice how you're feeling, and see just how far you've come. 
            No grades, no pressure. Just you and your journey.
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="w-8 border-t border-border" />
            100% free · Always private · Made by skaters, for skaters
          </div>
        </div>
      </section>

      {/* ─── How It Works in 3 Steps ─── */}
      <section className="relative z-10 px-6 md:px-12 py-16 md:py-24 bg-primary/5 border-y border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">Simple as 1-2-3</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif mb-3">
              How it works
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              IceNotes fits right into your skating routine. Here's how a typical day looks:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-14 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-[2px] bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20" />

            {[
              {
                step: '1',
                icon: Dumbbell,
                title: 'Train',
                headline: 'Go to the rink and do your thing.',
                text: 'Practice your jumps, spins, footwork — whatever your coach has planned or whatever feels right. IceNotes waits for you.',
              },
              {
                step: '2',
                icon: PenLine,
                title: 'Reflect',
                headline: 'Take 5 minutes to write about it.',
                text: 'After your session, open IceNotes and jot down what you worked on, how you felt, and one thing you noticed. That\'s it — no essays required.',
              },
              {
                step: '3',
                icon: Sprout,
                title: 'Grow',
                headline: 'Watch yourself improve over time.',
                text: 'Over days and weeks, your entries become a story of growth. You\'ll spot patterns, celebrate wins you forgot, and build real confidence.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="w-14 h-14 rounded-2xl bg-card border-2 border-primary/20 flex items-center justify-center mx-auto mb-5 relative z-10 shadow-sm">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="inline-flex items-center gap-1.5 mb-3">
                  <span className="text-xs font-mono font-bold text-primary bg-primary/10 w-5 h-5 rounded-full flex items-center justify-center">{item.step}</span>
                  <span className="text-lg font-bold text-foreground font-serif">{item.title}</span>
                </div>
                <p className="text-sm font-medium text-foreground mb-2">{item.headline}</p>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── My Story ─── */}
      <section className="relative z-10 px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="border-l-2 border-primary/30 pl-6 md:pl-10 space-y-6">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">My Story</p>
            <h2 className="text-xl md:text-2xl font-bold text-foreground font-serif leading-snug">
              "I spent years chasing jumps.<br className="hidden md:block" />
              Then I learned that real progress starts with reflection."
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
              <p>
                When I was training six days a week, I measured everything in rotations. 
                Did I land the double? Was the spin fast enough? Could I hold that edge longer?
              </p>
              <p>
                But the sessions that changed everything weren't the ones where I nailed my jumps. 
                They were the ones where I finally stopped to ask — <em className="text-foreground/80">How do I actually feel out there? 
                What's working? What keeps holding me back?</em>
              </p>
              <p>
                I started writing things down. Not fancy reports — just honest notes after each session. 
                What I practiced. What felt right. What scared me. Slowly, I began to see patterns I'd 
                been blind to for years.
              </p>
              <p>
                My coach noticed the shift. My confidence grew. I wasn't just training harder — I was 
                training <em className="text-foreground/80">smarter</em>. I was understanding myself as an athlete.
              </p>
              <p className="text-foreground font-medium">
                IceNotes was born from that realization: progress doesn't come from more ice time alone. 
                It comes from paying attention to the whole picture — body, mind, and heart.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Why Reflection Matters ─── */}
      <section className="relative z-10 px-6 md:px-12 py-16 md:py-24 bg-muted/30 border-y border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">Why Reflection Matters</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif mb-4 leading-snug">
              The best skaters don't just train more — they <span className="text-primary">understand</span> themselves better.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              When you take a few minutes to think about your session, something powerful happens. 
              You start to notice what works, what doesn't, and how your feelings affect your skating. 
              That's where real growth begins.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Know how you feel',
                text: 'When you can name your emotions — nervous, excited, frustrated — you stop being stuck in them. You start choosing how to respond.',
                icon: Heart,
              },
              {
                title: 'See your patterns',
                text: 'Writing things down shows you what you can\'t see in the moment: which warm-ups help, what throws you off, when you skate your best.',
                icon: Eye,
              },
              {
                title: 'Bounce back faster',
                text: 'Tough sessions happen to everyone. Writing about them helps you move forward instead of carrying frustration to the next practice.',
                icon: Activity,
              },
              {
                title: 'Know what to focus on',
                text: 'When you ask yourself "What do I want to work on next?" after each session, your training stops being random and starts being intentional.',
                icon: Target,
              },
              {
                title: 'Talk to your coach better',
                text: 'When you can explain how a session felt — not just what you did — your coach can help you in ways that really matter.',
                icon: MessageCircle,
              },
              {
                title: 'Build real confidence',
                text: 'Reading your own entries from weeks ago and seeing how much you\'ve grown? That\'s a kind of confidence no medal can give you.',
                icon: Sparkles,
              },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-xl bg-card/60 border border-border/40 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground font-serif">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How IceNotes Helps You Grow ─── */}
      <section className="relative z-10 px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">How IceNotes Helps You Grow</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif mb-4">
              Three ways IceNotes supports your skating.
            </h2>
            <p className="text-muted-foreground">
              Think of it as your personal toolkit — covering how you feel, how you train, and how you're progressing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                num: '💭',
                icon: Brain,
                title: 'Your Mindset',
                text: 'Check in with yourself after every session. How are you feeling? What\'s on your mind? Build the mental strength that great skating requires.',
                details: ['Rate how you feel each day', 'Track your confidence over time', 'Calm your nerves before sessions', 'Write private reflections'],
              },
              {
                num: '📋',
                icon: BarChart3,
                title: 'Your Training',
                text: 'Write down what you practiced, what went well, and what was tricky. Over time, you\'ll see exactly what works for you.',
                details: ['Log on-ice & off-ice sessions', 'Note what type of session it was', 'Leave notes for your coach', 'See how much you\'re training'],
              },
              {
                num: '🎯',
                icon: Target,
                title: 'Your Progress',
                text: 'Keep track of your jumps, set goals for the week, and watch your landing rate climb. Seeing the numbers go up feels amazing.',
                details: ['Track every jump attempt', 'See which jumps are improving', 'Set goals for each week', 'Watch your progress over time'],
              },
            ].map((pillar) => (
              <div key={pillar.num} className="space-y-5">
                <span className="text-2xl mb-1 block">{pillar.num}</span>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <pillar.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground font-serif">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{pillar.text}</p>
                <ul className="space-y-2 pt-1">
                  {pillar.details.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── What You Can Track ─── */}
      <section className="relative z-10 px-6 md:px-12 py-16 md:py-24 bg-muted/30 border-y border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">What You Can Track</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif mb-4">
              Everything about your skating — all in one place.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              From the jumps you're landing to how you're feeling — IceNotes keeps it all together for you.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { icon: Target, label: 'Jumps', sub: 'Attempts, landings, quality' },
              { icon: Music, label: 'Spins', sub: 'Positions, levels, feel' },
              { icon: Activity, label: 'Steps & Edges', sub: 'Footwork, turns, flow' },
              { icon: Heart, label: 'Emotions', sub: 'How you feel on & off ice' },
              { icon: TrendingUp, label: 'Goals', sub: 'Weekly targets & progress' },
              { icon: Brain, label: 'Confidence', sub: '1–10 daily self-rating' },
              { icon: Eye, label: 'Focus', sub: 'Concentration tracking' },
              { icon: Feather, label: 'Reflections', sub: 'Private journal entries' },
              { icon: MessageCircle, label: 'Coach Notes', sub: 'Share with your team' },
              { icon: BookOpen, label: 'Sessions', sub: 'On-ice & off-ice logs' },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-xl border border-border/50 bg-card/80 text-center hover:shadow-sm transition-all">
                <item.icon className="w-5 h-5 text-primary mx-auto mb-2.5" />
                <p className="text-sm font-semibold text-foreground font-serif">{item.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Sport Psychology Support ─── */}
      <section className="relative z-10 px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">Your Mental Game</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif mb-4">
              Because how you feel matters just as much as how you skate.
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
              IceNotes gently weaves sport psychology into your daily routine — helping you understand 
              your emotions, build confidence, and take care of the person behind the skater.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { title: 'Get focused before you skate', text: 'Simple breathing exercises and a moment to set your intention — so you step on the ice calm and ready.' },
              { title: 'Check in with yourself', text: 'After each session, rate how you felt emotionally, how confident you were, and how focused you stayed. It takes 30 seconds.' },
              { title: 'Find the good in every session', text: '"What did I learn today?" and "What was hard?" — these simple questions help you grow from every session, even the tough ones.' },
              { title: 'See how far you\'ve come', text: 'Look back at your entries from weeks ago. You\'ll be surprised how much has changed — and that feeling builds real, lasting confidence.' },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl border border-border/50 bg-card/60 space-y-2">
                <h3 className="text-sm font-semibold text-foreground font-serif">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Your Voice Matters ─── */}
      <section className="relative z-10 px-6 md:px-12 py-16 md:py-24 bg-muted/30 border-y border-border/50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">Your Voice Matters</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif mb-5">
            IceNotes is brand new — and we're building it for you.
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4 max-w-xl mx-auto">
            This platform was created for real skaters who believe that reflection is part of training. 
            We're just getting started, and your experience means everything to us.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-8 max-w-xl mx-auto">
            If IceNotes helps you reflect, grow or train better, we would love to hear your story.
            Share how journaling supports your skating journey and help inspire other skaters.
          </p>
          <Link to="/share-experience">
            <Button size="lg" className="h-13 px-8 text-base font-semibold rounded-lg gap-2">
              <MessageCircle className="w-4 h-4" />
              Share Your Experience
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-4">
            It only takes a minute — and it helps us build something truly meaningful.
          </p>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="relative z-10 px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
            <Snowflake className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif mb-4 leading-snug">
            Your next chapter on the ice<br />starts with one honest reflection.
          </h2>
          <p className="text-muted-foreground mb-10 leading-relaxed max-w-lg mx-auto">
            IceNotes is free, private, and built with love for this sport. 
            Whether you're preparing for your first competition or your hundredth — 
            you deserve a space to grow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="h-13 px-8 text-base font-semibold rounded-lg gap-2">
                Join IceNotes
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="h-13 px-8 text-base font-medium rounded-lg">
                Log In
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-5">
            Free forever · No credit card · Set up in 2 minutes
          </p>
        </div>
      </section>
    </>
  );
};
