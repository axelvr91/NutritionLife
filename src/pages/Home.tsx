import { motion } from 'motion/react';
import { ArrowRight, Check, Star, Users, Calendar, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

const plans = [
  {
    name: 'Basic',
    price: '$49',
    description: 'Perfect for starting your journey.',
    features: [
      'Initial Consultation',
      'Basic Meal Plan',
      'Email Support',
      'Access to Recipe Library'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Standard',
    price: '$99',
    description: 'Our most popular choice for results.',
    features: [
      'Everything in Basic',
      'Personalized Supplement Plan',
      'Bi-weekly Check-ins',
      'WhatsApp Priority Support',
      'Custom Grocery List'
    ],
    cta: 'Choose Standard',
    popular: true
  },
  {
    name: 'Premium',
    price: '$199',
    description: 'Full clinical support and monitoring.',
    features: [
      'Everything in Standard',
      'Weekly 1-on-1 Sessions',
      'Blood Work Analysis',
      '24/7 Direct Access',
      'Custom Workout Integration'
    ],
    cta: 'Go Premium',
    popular: false
  }
];

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-bg-dark overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
                Expert Clinical Nutrition
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6">
                Nourish Your Body, <br />
                <span className="text-primary">Transform Your Life</span>
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-lg">
                Personalized nutrition plans designed by professionals to help you achieve your health goals through science-backed functional food.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/appointment"
                  className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center group"
                >
                  Book Your Consultation
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/recipes"
                  className="px-8 py-4 bg-white border-2 border-primary/20 text-primary rounded-xl font-bold text-lg hover:bg-primary/5 transition-all text-center"
                >
                  Explore Recipes
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800"
                  alt="Healthy Food"
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl z-20 flex items-center space-x-4">
                <div className="bg-secondary/20 p-3 rounded-xl">
                  <Users className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">500+</p>
                  <p className="text-sm text-gray-500">Happy Patients</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How We Help You</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our comprehensive approach ensures you have all the tools needed for a sustainable healthy lifestyle.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Utensils, title: 'Functional Recipes', desc: 'Delicious meals designed to heal and energize your body.' },
              { icon: Calendar, title: 'Easy Booking', desc: 'Schedule your sessions with our real-time appointment system.' },
              { icon: Star, title: 'Clinical Precision', desc: 'Evidence-based nutrition plans tailored to your unique biology.' }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-bg-light border border-primary/5 hover:border-primary/20 transition-all group">
                <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=800"
                alt="Nutritionist Professional"
                className="rounded-3xl shadow-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Meet Your Nutritionist</h2>
              <p className="text-lg text-gray-700 mb-6 font-medium">
                "I believe that food is the most powerful medicine we have. My mission is to help you rediscover your relationship with eating."
              </p>
              <p className="text-gray-600 mb-8">
                With over 10 years of clinical experience, Dr. Elena Rodriguez specializes in functional nutrition and metabolic health. She has helped hundreds of individuals overcome chronic fatigue, digestive issues, and weight management challenges through a holistic, science-backed approach.
              </p>
              <div className="space-y-4">
                {['Certified Clinical Nutritionist', 'Master in Functional Medicine', '10+ Years Experience'].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="bg-primary rounded-full p-1">
                      <Check size={14} className="text-white" />
                    </div>
                    <span className="font-semibold text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Investment in Your Health</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Choose the plan that best fits your current needs and goals.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={cn(
                  "relative p-8 rounded-3xl border transition-all",
                  plan.popular 
                    ? "border-primary shadow-2xl scale-105 z-10 bg-white" 
                    : "border-gray-100 bg-bg-light hover:border-primary/30"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-2">/session</span>
                </div>
                <p className="text-gray-600 mb-8 text-sm">{plan.description}</p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-3 text-sm">
                      <Check size={18} className="text-primary mt-0.5 shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/appointment"
                  className={cn(
                    "w-full py-3 rounded-xl font-bold transition-all text-center block",
                    plan.popular
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-white border-2 border-primary/20 text-primary hover:bg-primary/5"
                  )}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Ready to start your transformation?</h2>
          <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto">
            Book your initial consultation today and take the first step towards a healthier, more vibrant you.
          </p>
          <Link
            to="/appointment"
            className="inline-flex items-center px-10 py-5 bg-secondary text-primary font-bold text-xl rounded-2xl hover:bg-secondary/90 transition-all shadow-xl"
          >
            Schedule Now
            <Calendar className="ml-3" />
          </Link>
        </div>
      </section>
    </div>
  );
}
