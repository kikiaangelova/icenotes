import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, type ButtonProps } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartStartCTAProps extends Omit<ButtonProps, 'onClick'> {
  /** What the CTA should do next once the user is in the app. */
  action?: 'log-today' | 'start-tour' | 'open-coach' | 'game-day';
  label?: string;
  showArrow?: boolean;
}

/**
 * Gen Z–friendly entry CTA that opens the *right next step* instead of
 * dropping users on a static page.
 *
 * Routing logic:
 *  - logged out → /auth?mode=signup&next=/dashboard?action={action}
 *  - logged in  → /dashboard?action={action}   (handled by SimpleDashboard)
 *  - while auth is loading, the button shows a spinner so we don't flicker.
 */
export const SmartStartCTA: React.FC<SmartStartCTAProps> = ({
  action = 'log-today',
  label = 'Start Training Smart',
  showArrow = true,
  className,
  children,
  ...rest
}) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const handleClick = () => {
    const target = `/dashboard?action=${action}`;
    if (loading) return;
    if (user) {
      navigate(target);
    } else {
      navigate(`/auth?mode=signup&next=${encodeURIComponent(target)}`);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading || rest.disabled}
      className={cn(className)}
      {...rest}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {children ?? label}
          {showArrow && <ArrowRight className="w-4 h-4 ml-2" />}
        </>
      )}
    </Button>
  );
};
