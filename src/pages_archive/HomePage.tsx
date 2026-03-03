import { useEffect } from 'react';
import { Hero } from '../components/Hero';
import { HomeComparison } from '../components/HomeComparison';
import { CreatorShowcase } from '../components/CreatorShowcase';
import { HomeCTA } from '../components/HomeCTA';
import { FAQ } from '../components/FAQ';
import { Contact } from '../components/Contact';
import { SEO } from '../components/SEO';
import { Analytics } from '../utils/analytics';

export function HomePage() {
  useEffect(() => {
    Analytics.track(Analytics.Events.HOME_VIEW);
  }, []);

  return (
    <div className="bg-background text-foreground">
      <SEO
        title="Threads Influencer Marketing Agency"
        description="Korea's #1 Threads Agency. Unlock the power of text-based influence."
      />
      <main id="main">
        <Hero />
        <HomeComparison />
        <CreatorShowcase />
        <HomeCTA />
        <FAQ />
        <Contact />
      </main>
    </div>
  );
}
