import React from 'react';
import { Link } from 'react-router-dom';
import { Snowflake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="px-6 md:px-12 py-10 border-t border-border bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <Snowflake className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground font-serif">IceNotes</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A digital journaling platform for ambitious figure skaters.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">Navigate</p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'How It Works', href: '/how-it-works' },
                { label: 'Features', href: '/features' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <Link key={link.href} to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">Product</p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Journal', href: '/auth' },
                { label: 'Goals', href: '/auth' },
                { label: 'Progress', href: '/auth' },
              ].map((link) => (
                <Link key={link.label} to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Account */}
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">Account</p>
            <div className="flex flex-col gap-2">
              <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sign Up
              </Link>
              <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Log In
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} IceNotes. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for skaters who take their craft seriously.
          </p>
        </div>
      </div>
    </footer>
  );
};