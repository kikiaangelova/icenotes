import React from 'react';
import { Button } from '@/components/ui/button';
import { Snowflake, BookOpen, Brain, Target, TrendingUp, Feather, BarChart3, Heart, ArrowRight, Quote, Sparkles, Activity, Music, Eye, MessageCircle } from 'lucide-react';
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
      {/* ─── Hero – Emotional Opening ─── */}
      <section className="relative z-10 px-6 md:px-12 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm md:text-base text-primary font-medium mb-6 tracking-wide">
            For every skater who has ever wondered — <em>"Am I getting better?"</em>
          </p>
          <h1 className="text-[2rem] md:text-[3rem] lg:text-[3.75rem] font-bold leading-[1.12] tracking-[-0.025em] text-foreground font-serif mb-8">
            Your skating journey
            <br />
            deserves to be
            <br />
            <span className="text-primary">remembered.</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
            IceNotes is a digital journal built for figure skaters — a quiet, personal space 
            to reflect on your training, understand your emotions, and watch yourself grow 
            in ways no scoreboard ever shows.
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="w-8 border-t border-border" />
            Free · Private · Made by skaters, for skaters
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
              The skaters who grow fastest aren't just the ones who train the most — they're 
              the ones who <span className="text-primary">understand</span> their training.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Sport psychology research shows that athletes who regularly reflect on their performance 
              develop stronger self-awareness, recover faster from setbacks, and build more sustainable confidence.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Emotional awareness',
                text: 'When you name what you feel — fear, frustration, excitement — you stop being controlled by it. You start choosing how to respond.',
                icon: Heart,
              },
              {
                title: 'Pattern recognition',
                text: 'Writing things down reveals what you can\'t see in the moment: the warm-ups that work, the thoughts that derail you, the conditions where you perform best.',
                icon: Eye,
              },
              {
                title: 'Resilience building',
                text: 'Bad sessions happen. Reflection helps you process them constructively instead of letting them shake your confidence for the next week.',
                icon: Activity,
              },
              {
                title: 'Goal clarity',
                text: 'When you regularly ask "What do I want to work on next?", your training becomes intentional — not just a list of elements to survive.',
                icon: Target,
              },
              {
                title: 'Coach communication',
                text: 'A skater who can articulate what they\'re feeling and where they\'re stuck is a skater who gets better coaching.',
                icon: MessageCircle,
              },
              {
                title: 'Confidence that lasts',
                text: 'Reading back through your own entries — seeing how far you\'ve come — builds a kind of confidence no medal can give you.',
                icon: Sparkles,
              },
            ].map((item) => (
              <div key={item.title} className="space-y-3">
                <item.icon className="w-5 h-5 text-primary/70" />
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
              A structured system for the three pillars of skating development.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                num: '01',
                icon: Brain,
                title: 'Mindset',
                text: 'Daily reflections, emotional check-ins, and pre-skate mental routines. Build the inner game that competition demands.',
                details: ['Daily emotional state tracking', 'Confidence & focus ratings', 'Pre-session breathing exercises', 'Personal reflections journal'],
              },
              {
                num: '02',
                icon: BarChart3,
                title: 'Training',
                text: 'Log every session with detail and purpose. Track what you practiced, what clicked, and what needs attention.',
                details: ['On-ice & off-ice session logs', 'Session type categorization', 'Coach notes after each session', 'Training volume overview'],
              },
              {
                num: '03',
                icon: Target,
                title: 'Performance',
                text: 'Track technical progress with data. See your landing rates improve, your consistency grow, your goals being met.',
                details: ['Jump attempt tracking', 'Landing rate analytics', 'Weekly goal setting', 'Progress trend visualization'],
              },
            ].map((pillar) => (
              <div key={pillar.num} className="space-y-5">
                <span className="text-xs font-mono text-muted-foreground/50 tracking-widest">{pillar.num}</span>
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
              Every part of your skating, in one place.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              IceNotes covers the technical, emotional, and strategic layers of your development.
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
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">Sport Psychology Support</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif mb-4">
              Your mental game is part of your training.
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
              IceNotes integrates sport psychology principles directly into your daily routine — 
              not as an afterthought, but as a core part of how you train.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { title: 'Pre-Session Preparation', text: 'Guided breathing exercises and intention-setting to help you arrive at the rink focused and ready.' },
              { title: 'Emotional Check-Ins', text: 'Rate your emotional state, confidence, and focus after every session. See how your inner state affects your performance over time.' },
              { title: 'Growth Mindset Prompts', text: '"What did I learn?" and "What was challenging?" questions that train your brain to find growth in every session — even the hard ones.' },
              { title: 'Reflection History', text: 'Look back at your entries over weeks and months. Seeing your own words of resilience builds deeper, lasting confidence.' },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl border border-border/50 bg-card/60 space-y-2">
                <h3 className="text-sm font-semibold text-foreground font-serif">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="relative z-10 px-6 md:px-12 py-16 md:py-24 bg-muted/30 border-y border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">From Skaters Like You</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif">
              Words from the ice.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "I used to leave practice feeling frustrated without knowing why. Now I write it down, and suddenly it makes sense. I can see what's actually bothering me — and fix it.",
                name: 'Sofia, 16',
                detail: 'Competitive skater · 3 years of journaling',
              },
              {
                quote: "My coach asked me to start journaling. I didn't want to. But after two weeks with IceNotes, I realized I'd been ignoring how anxious I felt before run-throughs. That changed everything.",
                name: 'Emma, 19',
                detail: 'University team · Working on triple combinations',
              },
              {
                quote: "As a coach, I love when my skaters can tell me HOW a session felt — not just what they did. IceNotes gives them the vocabulary and the habit to do that.",
                name: 'Coach David',
                detail: 'PSA-rated coach · 12 years experience',
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="p-6 rounded-xl border border-border/50 bg-card flex flex-col">
                <Quote className="w-5 h-5 text-primary/30 mb-3 shrink-0" />
                <p className="text-sm text-foreground/90 leading-relaxed italic flex-1 mb-5">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.detail}</p>
                </div>
              </div>
            ))}
          </div>
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
