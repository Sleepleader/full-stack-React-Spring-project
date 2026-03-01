import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const EnvironmentalResponsibility: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('env-visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll('.env-animate');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="env-page">
      {/* Minimal Nav */}
      <nav className="env-nav">
        <Link to="/mall" className="env-nav-back">← Back to Mall</Link>
      </nav>

      {/* Hero Section */}
      <section className="env-hero" ref={heroRef}>
        <div className="env-hero-content">
          <h1 className="env-mega-title env-animate">AMAZON 2030</h1>
          <h2 className="env-headline env-animate">
            Our carbon emissions have dropped by more than 60%.
          </h2>
        </div>
        <div className="env-hero-fade" />
      </section>

      {/* Details Section */}
      <section className="env-details" ref={detailsRef}>
        <article className="env-details-content">
          <p className="env-paragraph env-animate">
            This milestone marks our unprecedented proximity to the Amazon 2030 goal: 
            we are committed to achieving a net-zero carbon footprint worldwide by adopting 
            more recycled materials, utilizing renewable electricity, and implementing 
            lower-carbon logistics methods.
          </p>
          <p className="env-paragraph env-animate">
            Based on a 2015 baseline, we are dedicated to reducing our own carbon emissions 
            by 75%. For the remaining 25%, we will address it through high-quality carbon 
            removal projects that protect and restore natural ecosystems.
          </p>
        </article>
      </section>

      {/* Stats Section */}
      <section className="env-stats">
        <div className="env-stats-grid">
          <div className="env-stat-card env-animate">
            <span className="env-stat-number">75%</span>
            <span className="env-stat-label">Direct emission reduction target</span>
          </div>
          <div className="env-stat-card env-animate">
            <span className="env-stat-number">100%</span>
            <span className="env-stat-label">Renewable electricity commitment</span>
          </div>
          <div className="env-stat-card env-animate">
            <span className="env-stat-number">2030</span>
            <span className="env-stat-label">Net-zero carbon goal year</span>
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="env-closing">
        <div className="env-closing-content env-animate">
          <p className="env-closing-text">
            Every step forward brings us closer to a sustainable future.
          </p>
          <Link to="/mall" className="env-cta">Explore Our Store →</Link>
        </div>
      </section>
    </main>
  );
};

export default EnvironmentalResponsibility;
