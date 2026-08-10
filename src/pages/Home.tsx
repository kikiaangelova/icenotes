import React, { useState, useEffect } from 'react';
import { Seo } from '@/components/Seo';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { LandingPage } from '@/components/landing/LandingPage';
import { useNavigate } from 'react-router-dom';
import { SkatingAssistant } from '@/components/SkatingAssistant';
import { useLanguage } from '@/context/LanguageContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={isDarkMode ? "dark theme-neon" : "theme-neon"}>
      <div className="min-h-screen bg-background text-foreground">

        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
        <Seo
          title={t('seo.home.title')}
          description={t('seo.home.desc')}
          path="/"
          jsonLd={[
            { "@context": "https://schema.org", "@type": "WebSite", name: "IceNotes", url: "https://skategoals.com/" },
            { "@context": "https://schema.org", "@type": "Organization", name: "IceNotes", url: "https://skategoals.com/", logo: "https://skategoals.com/og-image.png" },
          ]}
        />
        <LandingPage 
          onGetStarted={() => navigate('/auth')} 
          isDarkMode={isDarkMode} 
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
        />
        <Footer />
        <SkatingAssistant />
      </div>
    </div>
  );
};

export default Home;