import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />

        <section className="px-6 md:px-12 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">Contact</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-serif mb-5">
                Get in touch.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Have a question, suggestion, or feedback? We'd love to hear from you.
              </p>
            </div>

            <div className="grid md:grid-cols-12 gap-10">
              {/* Contact form */}
              <div className="md:col-span-7">
                <Card className="border-border/60">
                  <CardHeader>
                    <CardTitle className="font-serif">Send us a message</CardTitle>
                    <CardDescription>We typically respond within 24 hours.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {submitted ? (
                      <div className="text-center py-10 space-y-4">
                        <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-7 h-7 text-success" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground font-serif">Thank you!</h3>
                        <p className="text-sm text-muted-foreground">
                          Your message has been sent. We'll get back to you soon.
                        </p>
                        <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-2">
                          Send another message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Your name" required className="h-11" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="you@example.com" required className="h-11" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input id="subject" placeholder="What's this about?" required className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea id="message" placeholder="Tell us more..." required className="min-h-[140px] resize-none" />
                        </div>
                        <Button type="submit" className="w-full h-11 font-semibold gap-2">
                          <Send className="w-4 h-4" />
                          Send Message
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Contact info */}
              <div className="md:col-span-5 space-y-6">
                <div className="p-6 rounded-xl border border-border/60 bg-card space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground font-serif">Email</h3>
                  <p className="text-sm text-muted-foreground">
                    For general inquiries, reach out at:
                  </p>
                  <p className="text-sm font-medium text-foreground">hello@icenotes.app</p>
                </div>

                <div className="p-6 rounded-xl border border-border/60 bg-card space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground font-serif">Feedback & Ideas</h3>
                  <p className="text-sm text-muted-foreground">
                    IceNotes is built for skaters, by people who care about skating. 
                    Your feedback directly shapes the product.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Are you a coach?</span>{' '}
                    We're exploring features for coaches and their athletes. 
                    Let us know what would be most useful for your team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Contact;