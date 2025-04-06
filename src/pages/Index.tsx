import React, { useEffect, useRef, useState } from 'react';
import { Shield, Info, AlertTriangle, ShieldAlert, ShieldCheck, ExternalLink } from 'lucide-react';
import Layout from '../components/Layout';
import TextAnalyzer from '../components/TextAnalyzer';
import CategoryCard from '../components/CategoryCard';
import AnimatedTransition from '../components/AnimatedTransition';
import { Button as ShadcnButton } from '@/components/ui/button';
import { Button as MovingBorderButton } from '@/components/ui/moving-border';
import { createScrollObserver, applyPersistentAnimation } from '../utils/animationUtils';
import { HarmCategory } from '../utils/analyzeContent';
import BackgroundBeams from '@/components/BackgroundBeams';
import GlowingButton from '@/components/GlowingButton';
import CardSpotlight from '@/components/CardSpotlight';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Index = () => {
  const featuresRef = useRef<HTMLElement>(null);
  const categoriesRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const extensionRef = useRef<HTMLElement>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const [openExtensionDialog, setOpenExtensionDialog] = useState(false);

  useEffect(() => {
    // Track mouse position for spotlight effects
    const handleMouseMove = (event: MouseEvent) => {
      mousePosRef.current = { x: event.clientX, y: event.clientY };
      
      // Update card spotlight effects
      document.querySelectorAll('.card-spotlight').forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = mousePosRef.current.x - rect.left;
        const y = mousePosRef.current.y - rect.top;
        
        if (card instanceof HTMLElement) {
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        }
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Fixed animation observer that properly handles elements as they come into view
    const animateOnScroll = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          applyPersistentAnimation(entry.target);
        }
      });
    };

    const observer = createScrollObserver(animateOnScroll);
    
    // Select all elements that should animate on scroll
    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach(el => {
      // Initially hide elements (but don't do this for elements that are already in view)
      const rect = el.getBoundingClientRect();
      const isInViewport = rect.top <= window.innerHeight && rect.bottom >= 0;
      
      if (!isInViewport) {
        el.classList.add('opacity-0');
        el.classList.add('transform');
        el.classList.add('translate-y-8');
      }
      
      observer.observe(el);
    });
    
    return () => {
      elements.forEach(el => observer.unobserve(el));
      window.removeEventListener('mousemove', handleMouseMove);
    };
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
      {/* Hero Section with Enhanced Background Beams */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <BackgroundBeams 
          color="#9b87f5"
          beamCount={10}
          beamOpacity={0.7}
          beamSpread={0.3}
          waveSpeed={8}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />

        <div className="flex flex-col items-center text-center space-y-10 max-w-4xl mx-auto px-4 relative z-10">
          <AnimatedTransition show={true} type="fade" className="opacity-0" delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-primary to-purple-400 animate-gradient-shift">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-primary to-purple-400">WebSaathi:</span>{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/70">
                Content Safety Intelligence
              </span>
            </h1>
          </AnimatedTransition>
          
          <AnimatedTransition show={true} type="fade" className="opacity-0" delay={300}>
            <p className="text-xl text-gray-300 max-w-2xl font-light">
              Detect, classify, and mitigate harmful online content with precision and elegance using advanced AI technology
            </p>
          </AnimatedTransition>
          
          <AnimatedTransition show={true} type="fade" className="opacity-0" delay={500}>
            <div className="relative w-full max-w-lg mt-4 flex items-center justify-center space-x-4">
              <a href="#analyzer">
                <GlowingButton 
                  glowColor="rgba(155, 135, 245, 0.9)"
                  hoverScale={true}
                  pulseEffect={true}
                  className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground shadow-lg font-medium text-base transition-all duration-500 hover:shadow-[0_0_25px_rgba(155,135,245,0.7)] group"
                >
                  <span className="relative z-10 flex items-center">
                    Try Analyzer
                    <Shield className="h-5 w-5 ml-2 group-hover:rotate-360 group-hover:scale-110 transition-all duration-500" />
                  </span>
                </GlowingButton>
              </a>
            </div>
          </AnimatedTransition>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-20 scroll-mt-24 bg-gradient-to-b from-gray-900/30 to-gray-900/80 rounded-3xl my-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-primary mb-4">Key Features</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our intelligent system utilizes advanced AI technologies to provide comprehensive content safety
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <CardSpotlight 
                key={index}
                borderGlow
                className="rounded-xl bg-gray-800/30 backdrop-blur-sm p-8 border border-gray-700/30 shadow-xl scroll-animate"
                containerClassName="transition-all duration-300 hover:transform hover:translate-y-[-4px]"
                style={{ transitionDelay: `${100 * index}ms` }}
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </CardSpotlight>
            ))}
          </div>
        </div>
      </section>
      
      {/* WebSaathi Extension Section */}
      <section id="extension" ref={extensionRef} className="py-20 scroll-mt-24 my-8 relative">
        <BackgroundBeams 
          color="#6E59A5"
          beamCount={6}
          beamOpacity={0.3}
          beamSpread={0.5}
          waveSpeed={15}
        />
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 scroll-animate">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-primary mb-6">WebSaathi Browser Extension</h2>
              <p className="text-gray-300 mb-6">
                Take WebSaathi's content safety features with you across the web. Our browser extension provides real-time analysis of content you encounter while browsing.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <ShieldCheck className="h-5 w-5 text-primary mt-1 mr-3" />
                  <span className="text-gray-300">Real-time content analysis while browsing</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-5 w-5 text-primary mt-1 mr-3" />
                  <span className="text-gray-300">Block harmful content before it loads</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-5 w-5 text-primary mt-1 mr-3" />
                  <span className="text-gray-300">Customizable safety levels for different sites</span>
                </li>
              </ul>
              
              <div className="flex flex-wrap gap-4">
                <a href="https://github.com/user/websaathi-extension" target="_blank" rel="noopener noreferrer">
                  <MovingBorderButton
                    className="px-6 py-3 text-sm font-medium flex items-center"
                    borderRadius="0.5rem"
                  >
                    <span>Extension Repository</span>
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </MovingBorderButton>
                </a>
                
                <ShadcnButton 
                  variant="outline" 
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 flex items-center gap-2"
                  onClick={() => setOpenExtensionDialog(true)}
                >
                  <Info className="h-4 w-4" />
                  Learn More
                </ShadcnButton>
              </div>
            </div>
            
            <div className="flex-1 scroll-animate">
              <CardSpotlight 
                borderGlow
                className="rounded-xl overflow-hidden shadow-2xl border border-gray-700/50"
                containerClassName="transition-all duration-500 hover:transform hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/10 mix-blend-overlay"></div>
                <div className="aspect-video bg-gray-800 rounded-xl p-6 flex items-center justify-center">
                  <div className="w-full max-w-sm transform transition-transform duration-500">
                    <div className="h-8 bg-gray-700 rounded-t-lg flex items-center px-3 space-x-1">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <div className="ml-3 h-5 bg-gray-600 rounded w-64"></div>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-b-lg shadow-inner">
                      <div className="flex items-center mb-4">
                        <div className="h-8 w-8 rounded-full bg-primary/30 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <div className="ml-3">
                          <div className="h-4 bg-gray-700 rounded w-32"></div>
                          <div className="h-3 mt-1 bg-gray-700/70 rounded w-20"></div>
                        </div>
                        <div className="ml-auto">
                          <div className="h-6 w-12 bg-primary rounded-full"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-3 bg-gray-700 rounded w-full"></div>
                        <div className="h-3 bg-gray-700/70 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-700/50 rounded w-4/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardSpotlight>
            </div>
          </div>
        </div>
      </section>
      
      {/* Content Analyzer Section with Simplified Design */}
      <section id="analyzer" className="py-20 scroll-mt-24 relative">
        <BackgroundBeams 
          color="#4B3A8A"
          beamCount={8}
          beamOpacity={0.2}
          beamSpread={0.4}
          waveSpeed={10}
        />
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12 scroll-animate">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-primary mb-4">Content Analysis Tool</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Upload or paste text, images, videos, or audio to analyze for potentially harmful content
            </p>
          </div>
          
          <div className="bg-gray-800/40 rounded-2xl border border-gray-700/30 shadow-2xl p-6 md:p-8 scroll-animate backdrop-blur-sm">
            <TextAnalyzer />
          </div>
        </div>
      </section>
      
      {/* Harm Categories Section */}
      <section id="categories" ref={categoriesRef} className="py-20 scroll-mt-24 bg-gradient-to-b from-gray-900/30 to-gray-900/80 rounded-3xl my-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12 scroll-animate">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-primary mb-4">Content Risk Categories</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our system detects and classifies various types of harmful online content
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <CardSpotlight 
                key={category} 
                borderGlow
                containerClassName="scroll-animate transition-all duration-300 hover:transform hover:translate-y-[-4px]"
                className=""
                style={{ transitionDelay: `${100 * index}ms` }}
              >
                <CategoryCard category={category} />
              </CardSpotlight>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" ref={aboutRef} className="py-20 scroll-mt-24 relative">
        <BackgroundBeams 
          color="#8B5CF6"
          beamCount={5}
          beamOpacity={0.3}
          waveSpeed={12}
        />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12 scroll-animate">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-primary mb-4">About WebSaathi</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Designed with precision and elegance to provide comprehensive content safety
            </p>
          </div>
          
          <CardSpotlight
            borderGlow
            className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/30 shadow-2xl p-6 md:p-8 scroll-animate"
          >
            <div className="prose prose-sm max-w-none text-gray-300">
              <p>
                WebSaathi is an advanced content moderation system designed to detect, classify, and mitigate harmful online content while defending against adversarial attacks. Using state-of-the-art AI technologies, our system analyzes text, images, audio, and videos for a variety of harmful content types.
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
                WebSaathi uses the Google Gemini 1.5 Pro AI model to detect subtle patterns in content that may indicate harmful intent. Each analysis provides a detailed report with severity scores, confidence ratings, and recommended actions.
              </p>
              
              <h3>Ethical Considerations</h3>
              <p>
                The system is designed with privacy and ethical considerations in mind. User data is anonymized, and diverse training datasets are used to minimize bias in detection algorithms. Regular audits ensure compliance with relevant regulations.
              </p>
            </div>
          </CardSpotlight>
        </div>
      </section>

      {/* Extension Learn More Dialog */}
      <Dialog open={openExtensionDialog} onOpenChange={setOpenExtensionDialog}>
        <DialogContent className="sm:max-w-md bg-gray-900 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">WebSaathi Content Moderator</DialogTitle>
            <DialogDescription className="text-gray-400">
              Real-time content moderation for safer browsing
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            <div className="p-3 bg-gray-800 rounded-lg">
              <h4 className="font-medium text-primary mb-2">How It Works</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="inline-flex mr-2 mt-1 text-primary">•</span>
                  <span><span className="font-medium text-white">Automatic Scanning:</span> Analyzes web pages as you browse</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex mr-2 mt-1 text-primary">•</span>
                  <span><span className="font-medium text-white">AI Analysis:</span> Uses Gemini API for text and Sightengine for images</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex mr-2 mt-1 text-primary">•</span>
                  <span><span className="font-medium text-white">Content Blocking:</span> Option to hide harmful content with warning message</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex mr-2 mt-1 text-primary">•</span>
                  <span><span className="font-medium text-white">Continuous Monitoring:</span> Scans new content as you scroll</span>
                </li>
              </ul>
            </div>

            <div className="p-3 bg-gray-800 rounded-lg">
              <h4 className="font-medium text-primary mb-2">Key Features</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="inline-flex mr-2 mt-1 text-primary">•</span>
                  <span><span className="font-medium text-white">Safety Levels:</span> Low/Medium/High protection settings</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex mr-2 mt-1 text-primary">•</span>
                  <span><span className="font-medium text-white">Content Filtering:</span> Choose which harmful content types to detect</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex mr-2 mt-1 text-primary">•</span>
                  <span><span className="font-medium text-white">Visual Indicator:</span> Shield badge shows protection status</span>
                </li>
              </ul>
            </div>
            
            <div className="flex justify-end mt-2">
              <a 
                href="https://github.com/user/websaathi-extension" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ShadcnButton 
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  View on GitHub
                  <ExternalLink className="h-4 w-4 ml-1.5" />
                </ShadcnButton>
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Index;
