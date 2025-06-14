// HomePage.tsx
import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
//import { useAuth } from '../context/AuthContext';
import {
  FaCode,
  FaRocket,
  FaCodeBranch,
  FaArrowRight,
  FaCheck,
  FaStar,
  FaGithub,
  FaUpload,
  FaLightbulb,
  FaShieldAlt,
  FaBrain,
  FaUsers,
  FaPlay,
  FaQuoteLeft,
  FaInfinity,
  FaTimes
} from 'react-icons/fa';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  demoAction: () => void;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

interface FAQ {
  question: string;
  answer: string;
}

interface HomePageProps {
    onNavigateToTool?: (tool: string) => void;
  }
  
  const HomePage: React.FC<HomePageProps> = ({ onNavigateToTool }) => {
  const { darkMode } = useContext(ThemeContext);
  //const { currentUser } = useAuth();
  const [activeFeature, setActiveFeature] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features: Feature[] = [
    {
      icon: <FaUpload className="h-8 w-8" />,
      title: "Code Directory Converter",
      description: "Transform entire codebases into LLM-ready text format instantly",
      benefits: [
        "Upload entire project directories",
        "Smart file filtering and organization", 
        "Privacy-first anonymization",
        "Optimized for all major LLMs"
      ],
      demoAction: () => {
        // Navigate to main file tool
        onNavigateToTool?.('directory-converter');
      }
    },
    {
      icon: <FaRocket className="h-8 w-8" />,
      title: "AI Prompt Upgrader",
      description: "Enhance your prompts with OpenAI-powered intelligent optimization",
      benefits: [
        "Automatic prompt enhancement",
        "Context-aware improvements",
        "Better LLM responses",
        "Save time and get better results"
      ],
      demoAction: () => {
        window.location.hash = '#prompt-upgrader';
      }
    },
    {
      icon: <FaCodeBranch className="h-8 w-8" />,
      title: "Smart File Diff Tool",
      description: "Compare files with GitHub-style visualization and AI insights",
      benefits: [
        "Side-by-side file comparison",
        "Syntax highlighting",
        "Change detection",
        "Export difference reports"
      ],
      demoAction: () => {
        window.location.hash = '#file-diff';
      }
    }
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Sarah Chen",
      role: "Senior Developer",
      company: "TechCorp",
      content: "CodeFusion has revolutionized how I work with LLMs. The directory converter saves me hours of manual work every week.",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "AI Engineer",
      company: "DataFlow Inc",
      content: "The prompt upgrader is a game-changer. My AI interactions are now 10x more effective and precise.",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "DevOps Lead",
      company: "CloudTech",
      content: "The file diff tool with AI insights helps me understand code changes better than any other tool I've used.",
      rating: 5
    }
  ];

  const faqs: FAQ[] = [
    {
      question: "What makes CodeFusion different from other code tools?",
      answer: "CodeFusion is specifically designed for LLM workflows. Unlike general-purpose tools, we optimize every feature for AI interactions, from code formatting to prompt enhancement."
    },
    {
      question: "Is my code data secure?",
      answer: "Absolutely. We use client-side processing whenever possible, optional anonymization features, and enterprise-grade security. Your code never leaves your control unless you explicitly choose to use cloud features."
    },
    {
      question: "Which LLMs does CodeFusion work with?",
      answer: "CodeFusion works with all major LLMs including ChatGPT, Claude, Gemini, and local models. Our output format is optimized for maximum compatibility."
    },
    {
      question: "Do I need an OpenAI API key?",
      answer: "Only for the AI Prompt Upgrader feature. The Directory Converter and File Diff tools work completely offline without any API requirements."
    },
    {
      question: "Can I use CodeFusion for large codebases?",
      answer: "Yes! CodeFusion handles projects of any size with smart filtering, batch processing, and memory-efficient algorithms designed for large-scale code analysis."
    }
  ];

  const handleGetStarted = () => {
    // Navigate to the main file upload tool
    onNavigateToTool?.('directory-converter');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email subscription
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-dark-900' : 'bg-white'}`}>
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Hero Badge */}
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border mb-8 ${
              darkMode 
                ? 'bg-dark-800/50 border-dark-600 text-dark-300' 
                : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              <FaLightbulb className="h-4 w-4" />
              <span className="text-sm font-medium">The Complete LLM Developer Toolkit</span>
            </div>

            {/* Hero Title */}
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 leading-tight ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Supercharge Your
              <span className={`block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                LLM Workflow
              </span>
            </h1>

            {/* Hero Subtitle */}
            <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed ${
              darkMode ? 'text-dark-300' : 'text-gray-600'
            }`}>
              Convert codebases, upgrade prompts, and compare files with AI-powered precision. 
              The only toolkit you need for effective LLM development.
            </p>

            {/* Hero CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <button
                onClick={handleGetStarted}
                className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-lg
                          transition-all duration-200 hover:scale-105 shadow-lg ${
                  darkMode
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                }`}
              >
                <span>Get Started Free</span>
                <FaArrowRight />
              </button>
              
              <button
                onClick={() => setShowVideoModal(true)}
                className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-lg
                          border-2 transition-all duration-200 hover:scale-105 ${
                  darkMode
                    ? 'border-dark-600 text-dark-200 hover:bg-dark-800'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FaPlay />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Social Proof */}
            <div className={`flex items-center justify-center space-x-8 text-sm ${
              darkMode ? 'text-dark-400' : 'text-gray-500'
            }`}>
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <span>5.0 rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaUsers className="h-4 w-4" />
                <span>10,000+ developers</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaGithub className="h-4 w-4" />
                <span>Open source</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 ${darkMode ? 'bg-dark-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Three Powerful Tools,
              <span className="block text-blue-600">One Seamless Experience</span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              darkMode ? 'text-dark-300' : 'text-gray-600'
            }`}>
              Everything you need to work efficiently with Large Language Models, 
              from code preparation to prompt optimization.
            </p>
          </div>

          {/* Interactive Feature Showcase */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Feature Navigation */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    activeFeature === index
                      ? darkMode
                        ? 'border-blue-500 bg-dark-700 shadow-lg'
                        : 'border-blue-500 bg-white shadow-lg'
                      : darkMode
                        ? 'border-dark-600 bg-dark-800 hover:border-dark-500'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${
                      activeFeature === index
                        ? 'bg-blue-600 text-white'
                        : darkMode
                          ? 'bg-dark-600 text-dark-300'
                          : 'bg-gray-100 text-gray-600'
                    }`}>
                      {feature.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {feature.title}
                      </h3>
                      <p className={`mb-4 ${
                        darkMode ? 'text-dark-300' : 'text-gray-600'
                      }`}>
                        {feature.description}
                      </p>
                      
                      {/* Benefits List */}
                      <ul className="space-y-2 mb-4">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center space-x-2">
                            <FaCheck className={`h-4 w-4 ${
                              activeFeature === index ? 'text-blue-600' : 'text-green-500'
                            }`} />
                            <span className={`text-sm ${
                              darkMode ? 'text-dark-400' : 'text-gray-600'
                            }`}>
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Try It Button */}
                      <button
                        onClick={feature.demoAction}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                                  transition-all duration-200 hover:scale-105 ${
                          activeFeature === index
                            ? 'bg-blue-600 text-white'
                            : darkMode
                              ? 'bg-dark-600 text-dark-200 hover:bg-dark-500'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <span>Try it now</span>
                        <FaArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Visualization */}
            <div className={`p-8 rounded-2xl border ${
              darkMode 
                ? 'bg-dark-700 border-dark-600' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {features[activeFeature].icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {features[activeFeature].title}
                  </h3>
                  <p className="text-blue-100 max-w-md">
                    {features[activeFeature].description}
                  </p>
                </div>
              </div>
              
              {/* Feature Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    <FaBrain className="h-6 w-6 mx-auto mb-1" />
                    99%
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                    Faster
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    <FaShieldAlt className="h-6 w-6 mx-auto mb-1" />
                    100%
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                    Secure
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    <FaInfinity className="h-6 w-6 mx-auto mb-1" />
                    ∞
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                    Files
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Why Developers Choose CodeFusion
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaBrain className="h-8 w-8" />,
                title: "AI-First Design",
                description: "Built specifically for LLM workflows, not adapted from generic tools"
              },
              {
                icon: <FaShieldAlt className="h-8 w-8" />,
                title: "Privacy Focused",
                description: "Client-side processing and anonymization keep your code secure"
              },
              {
                icon: <FaBrain className="h-8 w-8" />,
                title: "Lightning Fast",
                description: "Process entire codebases in seconds, not minutes"
              },
              {
                icon: <FaCode className="h-8 w-8" />,
                title: "Developer Friendly",
                description: "Intuitive interface designed by developers, for developers"
              },
              {
                icon: <FaInfinity className="h-8 w-8" />,
                title: "No Limits",
                description: "Handle projects of any size without restrictions"
              },
              {
                icon: <FaGithub className="h-8 w-8" />,
                title: "Open Source",
                description: "Transparent, community-driven development you can trust"
              }
            ].map((benefit, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
                  darkMode
                    ? 'bg-dark-800 border-dark-600 hover:border-dark-500'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`p-3 rounded-lg inline-block mb-4 ${
                  darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                }`}>
                  {benefit.icon}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {benefit.title}
                </h3>
                <p className={darkMode ? 'text-dark-300' : 'text-gray-600'}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-20 ${darkMode ? 'bg-dark-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Loved by Developers Worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
                  darkMode
                    ? 'bg-dark-700 border-dark-600'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="mb-4">
                  <FaQuoteLeft className={`h-8 w-8 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
                
                <p className={`mb-6 text-lg ${
                  darkMode ? 'text-dark-200' : 'text-gray-700'
                }`}>
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                
                <div>
                  <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {testimonial.name}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border ${
                  darkMode
                    ? 'bg-dark-800 border-dark-600'
                    : 'bg-white border-gray-200'
                }`}
              >
                <h3 className={`text-lg font-bold mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {faq.question}
                </h3>
                <p className={darkMode ? 'text-dark-300' : 'text-gray-600'}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${
        darkMode 
          ? 'bg-gradient-to-r from-blue-900 to-purple-900' 
          : 'bg-gradient-to-r from-blue-600 to-purple-600'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your LLM Workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who've already supercharged their AI development process.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleGetStarted}
              className="flex items-center space-x-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg
                        transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Start Free Today</span>
              <FaArrowRight />
            </button>
            
            <div className="flex items-center space-x-2 text-blue-100">
              <FaCheck className="h-5 w-5" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={`py-16 border-t ${
        darkMode ? 'bg-dark-900 border-dark-600' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className={`text-2xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Stay Updated with CodeFusion
          </h3>
          <p className={`mb-8 ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
            Get the latest features, tips, and AI development insights delivered to your inbox.
          </p>
          
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className={`flex-1 px-4 py-3 rounded-l-lg border ${
                darkMode
                  ? 'bg-dark-800 border-dark-600 text-white placeholder-dark-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-r-lg font-medium hover:bg-blue-700 
                        transition-colors duration-200"
            >
              Subscribe
            </button>
          </form>
          
          {isSubscribed && (
            <div className="mt-4 text-green-600 font-medium">
              Thanks for subscribing! Check your email for confirmation.
            </div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <FaTimes className="h-8 w-8" />
            </button>
            
            <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
              <div className="text-center text-white">
                <FaPlay className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl">Demo video coming soon!</p>
                <p className="text-gray-400 mt-2">
                  Experience CodeFusion in action with our interactive demo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;