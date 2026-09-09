import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mail, Lock, User, ArrowLeft, CheckCircle2, Snowflake, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Seo } from '@/components/Seo';
import { lovable } from '@/integrations/lovable';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.32A9 9 0 0 0 9 18z"/>
    <path fill="#FBBC05" d="M3.97 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.32z"/>
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.32C4.68 5.16 6.66 3.58 9 3.58z"/>
  </svg>
);

type AuthView = 'auth' | 'forgot' | 'reset';

const Auth: React.FC = () => {
  const { signIn, signUp, resetPassword, updatePassword, session } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [view, setView] = useState<AuthView>('auth');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // Forgot password field
  const [forgotEmail, setForgotEmail] = useState('');

  // Reset password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Check if we're in password reset mode
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'reset' && session) {
      setView('reset');
    }
  }, [searchParams, session]);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: window.location.origin + (searchParams.get('next') || '/dashboard'),
      });
      if (result.error) {
        toast({
          title: t('auth.toast.loginFailed'),
          description: result.error.message || t('auth.toast.tryAgain'),
          variant: 'destructive',
        });
        setGoogleLoading(false);
        return;
      }
      if (result.redirected) return;
      navigate(searchParams.get('next') || '/dashboard');
    } catch (err) {
      toast({
        title: t('auth.toast.loginFailed'),
        description: (err as Error).message || t('auth.toast.tryAgain'),
        variant: 'destructive',
      });
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast({
        title: t('auth.toast.missingFields.title'),
        description: t('auth.toast.missingFields.desc'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setIsLoading(false);

    if (error) {
      toast({
        title: t('auth.toast.loginFailed'),
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: t('auth.toast.welcomeBack.title'),
        description: t('auth.toast.welcomeBack.desc'),
      });
      navigate(searchParams.get('next') || '/dashboard');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupName || !signupEmail || !signupPassword) {
      toast({
        title: t('auth.toast.missingFields.title'),
        description: t('auth.toast.missingFieldsAll.desc'),
        variant: 'destructive',
      });
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      toast({
        title: t('auth.toast.passMismatch.title'),
        description: t('auth.toast.passMismatch.desc'),
        variant: 'destructive',
      });
      return;
    }

    if (signupPassword.length < 6) {
      toast({
        title: t('auth.toast.passShort.title'),
        description: t('auth.toast.passShort.desc'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(signupEmail, signupPassword, signupName);
    setIsLoading(false);

    if (error) {
      toast({
        title: t('auth.toast.signupFailed'),
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: t('auth.toast.created.title'),
        description: t('auth.toast.created.desc'),
      });
      navigate(searchParams.get('next') || '/dashboard');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotEmail) {
      toast({
        title: t('auth.toast.emailRequired.title'),
        description: t('auth.toast.emailRequired.desc'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const { error } = await resetPassword(forgotEmail);
    setIsLoading(false);

    if (error) {
      toast({
        title: t('auth.toast.error'),
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setEmailSent(true);
      toast({
        title: t('auth.toast.emailSent.title'),
        description: t('auth.toast.emailSent.desc'),
      });
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword) {
      toast({
        title: t('auth.toast.passRequired.title'),
        description: t('auth.toast.passRequired.desc'),
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast({
        title: t('auth.toast.passMismatch.title'),
        description: t('auth.toast.passMismatch.desc'),
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: t('auth.toast.passShort.title'),
        description: t('auth.toast.passShort.desc'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const { error } = await updatePassword(newPassword);
    setIsLoading(false);

    if (error) {
      toast({
        title: t('auth.toast.error'),
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: t('auth.toast.passUpdated.title'),
        description: t('auth.toast.passUpdated.desc'),
      });
      navigate(searchParams.get('next') || '/dashboard');
    }
  };

  // Reset password view
  if (view === 'reset') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-ice/30 to-background">
        <Seo title="Reset Password – SkateGoals" description="Set a new password for your SkateGoals skater account and get back to training, journaling and tracking your progress." path="/auth?mode=reset" />
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-ice-deep flex items-center justify-center mb-4">
              <Snowflake className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground font-serif">SkateGoals</h1>
            <p className="text-muted-foreground">{t('auth.reset.heading')}</p>
          </div>

          <Card className="border-primary/10 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-center">{t('auth.reset.title')}</CardTitle>
              <CardDescription className="text-center">{t('auth.reset.desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">{t('auth.reset.field.new')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type="password"
                      placeholder={t('auth.placeholder.passwordMin')}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 h-11"
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">{t('auth.reset.field.confirm')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirm-new-password"
                      type="password"
                      placeholder={t('auth.placeholder.confirmPassword')}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="pl-10 h-11"
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('auth.reset.updating')}
                    </>
                  ) : (
                    t('auth.reset.cta')
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Forgot password view
  if (view === 'forgot') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-ice/30 to-background">
        <Seo title="Forgot Password – SkateGoals" description="Recover access to your SkateGoals account. We'll email you a secure link to reset your password." path="/auth?mode=forgot" />
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-ice-deep flex items-center justify-center mb-4">
              <Snowflake className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground font-serif">SkateGoals</h1>
            <p className="text-muted-foreground">{t('auth.forgot.heading')}</p>
          </div>

          <Card className="border-primary/10 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-center">{t('auth.forgot.title')}</CardTitle>
              <CardDescription className="text-center">
                {emailSent ? t('auth.forgot.descSent') : t('auth.forgot.descAsk')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {emailSent ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-success" />
                  </div>
                  <p className="text-muted-foreground">
                    {t('auth.forgot.sentTo')} <strong>{forgotEmail}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">{t('auth.forgot.checkSpam')}</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setEmailSent(false);
                      setForgotEmail('');
                    }}
                  >
                    {t('auth.forgot.tryAgain')}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">{t('auth.field.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder={t('auth.placeholder.email')}
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="pl-10 h-11"
                        disabled={isLoading}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-11" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('auth.forgot.sending')}
                      </>
                    ) : (
                      t('auth.forgot.send')
                    )}
                  </Button>
                </form>
              )}

              <button
                onClick={() => {
                  setView('auth');
                  setEmailSent(false);
                  setForgotEmail('');
                }}
                className="flex items-center gap-2 mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('auth.forgot.back')}
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main auth view
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-ice/30 to-background">
      <Seo title="Sign In or Sign Up – SkateGoals" description="Log in to SkateGoals or create a free account to journal your skating, track jumps and train your mindset with Coach Kiki." path="/auth" />
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-ice-deep flex items-center justify-center mb-4">
            <Snowflake className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground font-serif">SkateGoals</h1>
          <p className="text-muted-foreground">{t('auth.tagline')}</p>
        </div>

        <Card className="border-primary/10 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-center">{t('auth.welcome')}</CardTitle>
            <CardDescription className="text-center">{t('auth.welcomeSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogle}
              disabled={googleLoading || isLoading}
              className="w-full h-12 mb-4 gap-3 bg-background hover:bg-muted/60 font-semibold border-2"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              {googleLoading ? 'Connecting…' : 'Continue with Google'}
            </Button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium">or with email</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <Tabs defaultValue={searchParams.get('mode') === 'signup' ? 'signup' : 'login'} className="w-full">

              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">{t('auth.tab.login')}</TabsTrigger>
                <TabsTrigger value="signup">{t('auth.tab.signup')}</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{t('auth.field.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder={t('auth.placeholder.email')}
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10 h-11"
                        disabled={isLoading}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">{t('auth.field.password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder={t('auth.placeholder.password')}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 h-11"
                        disabled={isLoading}
                        autoComplete="current-password"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setView('forgot')}
                    className="text-sm text-primary hover:underline"
                  >
                    {t('auth.forgot.link')}
                  </button>

                  <Button type="submit" className="w-full h-11" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('auth.cta.loggingIn')}
                      </>
                    ) : (
                      t('auth.cta.login')
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">{t('auth.field.name')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder={t('auth.placeholder.name')}
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="pl-10 h-11"
                        disabled={isLoading}
                        autoComplete="name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t('auth.field.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder={t('auth.placeholder.email')}
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="pl-10 h-11"
                        disabled={isLoading}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t('auth.field.password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder={t('auth.placeholder.passwordMin')}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="pl-10 h-11"
                        disabled={isLoading}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">{t('auth.field.confirmPassword')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder={t('auth.placeholder.confirmPassword')}
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        className="pl-10 h-11"
                        disabled={isLoading}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-11" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('auth.cta.creating')}
                      </>
                    ) : (
                      t('auth.cta.signup')
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('auth.backHome')}
        </button>

        <div className="flex items-center justify-center gap-2 mt-5 text-xs text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Your journal stays private. Always yours.</span>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-3 px-4">
          {t('auth.terms')}
        </p>
      </div>
    </div>
  );
};

export default Auth;
