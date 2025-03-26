
import React, { useEffect, useRef } from 'react';
import { Shield, Info, AlertTriangle, MessageSquareX, UserX, EyeOff, ShieldAlert, ShieldCheck } from 'lucide-react';
import Layout from '../components/Layout';
import TextAnalyzer from '../components/TextAnalyzer';
import CategoryCard from '../components/CategoryCard';
import AnimatedTransition from '../components/AnimatedTransition';
import { createScrollObserver } from '../utils/animationUtils';
import { HarmCategory } from '../utils/analyzeContent';

const Index = () => {
  const featuresRef = useRef<HTMLElement>(null);
  const categoriesRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const animateOnScroll = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-in');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = createScrollObserver(animateOnScroll);
    
    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach(el => observer.observe(el));
    
    return () => elements.forEach(el => observer.unobserve(el));
  }, []);

  const categories: HarmCategory[] = [
    'hate_speech',
    'misinformation',
    'cyberbullying',
    'explicit_content',
    'prompt_injection',
    'safe'
  ];

  const features = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'Advanced Harm Detection',
      description: 'Detects multiple types of harmful content using state-of-the-art AI models'
    },
    {
      icon: <Info className="h-5 w-5" />,
      title: 'Detailed Analysis',
      description: 'Provides comprehensive reports with severity scores and confidence ratings'
    },
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: 'Prompt Injection Defense',
      description: 'Protects against attempts to manipulate or bypass AI safety measures'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-24">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto px-4">
          <AnimatedTransition show={true} type="fade" className="opacity-0" delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground">
              Intelligent Content <span className="text-primary">Safety</span> System
            </h1>
          </AnimatedTransition>
          
          <AnimatedTransition show={true} type="fade" className="opacity-0" delay={300}>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Detect, classify, and mitigate harmful online content with precision and elegance
            </p>
          </AnimatedTransition>
          
          <AnimatedTransition show={true} type="fade" className="opacity-0" delay={500}>
            <div className="relative w-full max-w-lg h-24">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-16 rounded-full bg-primary/10 filter blur-xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <a href="#analyzer" className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground shadow-elevation hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <span className="text-base font-medium">Try it Now</span>
                  <Shield className="h-5 w-5" />
                </a>
              </div>
            </div>
          </AnimatedTransition>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-16 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12 scroll-animate opacity-0">
            <h2 className="text-3xl font-medium text-foreground mb-4">Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our system utilizes advanced AI technologies to provide comprehensive content safety
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="relative overflow-hidden rounded-xl bg-white/50 backdrop-blur-sm p-6 border border-border/30 shadow-subtle hover:shadow-elevation transition-all duration-300 scroll-animate opacity-0"
                style={{ transitionDelay: `${100 * index}ms` }}
              >
                <div className="absolute -inset-px rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                  style={{ 
                    background: 'radial-gradient(600px circle at var(--x, 0px) var(--y, 0px), rgba(104, 182, 255, 0.1), transparent 40%)' 
                  }} 
                />
                
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Content Analyzer Section */}
      <section id="analyzer" className="py-16 scroll-mt-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12 scroll-animate opacity-0">
            <h2 className="text-3xl font-medium text-foreground mb-4">Content Analyzer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enter text to analyze for potentially harmful content or prompt injections
            </p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl border border-border/30 shadow-glass p-6 md:p-8 scroll-animate opacity-0">
            <TextAnalyzer />
          </div>
        </div>
      </section>
      
      {/* Harm Categories Section */}
      <section id="categories" ref={categoriesRef} className="py-16 scroll-mt-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12 scroll-animate opacity-0">
            <h2 className="text-3xl font-medium text-foreground mb-4">Harm Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our system detects and classifies various types of harmful online content
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div 
                key={category} 
                className="scroll-animate opacity-0"
                style={{ transitionDelay: `${100 * index}ms` }}
              >
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" ref={aboutRef} className="py-16 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12 scroll-animate opacity-0">
            <h2 className="text-3xl font-medium text-foreground mb-4">About the System</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Designed with precision and elegance to provide comprehensive content safety
            </p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl border border-border/30 shadow-glass p-6 md:p-8 scroll-animate opacity-0">
            <div className="prose prose-sm max-w-none text-foreground">
              <p>
                Our content moderation system is designed to detect, classify, and mitigate harmful online content while defending against adversarial attacks. Using advanced AI technologies, the system analyzes text, images, audio, and documents for a variety of harmful content types.
              </p>
              
              <h3>Core Capabilities</h3>
              <p>
                The system provides comprehensive analysis and protection against:
              </p>
              <ul>
                <li>Hate speech and derogatory language targeting groups/individuals</li>
                <li>Misinformation and factually incorrect claims</li>
                <li>Cyberbullying, threats, harassment, or targeted abuse</li>
                <li>Explicit content and inappropriate material</li>
                <li>Prompt injection attacks designed to manipulate AI behavior</li>
              </ul>
              
              <h3>Technology</h3>
              <p>
                The system uses state-of-the-art natural language processing and computer vision models to detect subtle patterns in content that may indicate harmful intent. Each analysis provides a detailed report with severity scores, confidence ratings, and recommended actions.
              </p>
              
              <h3>Ethical Considerations</h3>
              <p>
                The system is designed with privacy and ethical considerations in mind. User data is anonymized, and diverse training datasets are used to minimize bias in detection algorithms. Regular audits ensure compliance with relevant regulations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
