import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Stethoscope, 
  Calendar as CalendarIcon, 
  CreditCard, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Clock,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

type Step = 'personal' | 'clinical' | 'schedule' | 'payment' | 'success';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  age: string;
  weight: string;
  height: string;
  goals: string;
  conditions: string;
  date: string;
  time: string;
  paymentMethod: 'card' | 'cash';
}

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', 
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

export default function Appointment() {
  const [step, setStep] = useState<Step>('personal');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    weight: '',
    height: '',
    goals: '',
    conditions: '',
    date: '',
    time: '',
    paymentMethod: 'card',
  });

  const nextStep = async () => {
    if (step === 'personal') setStep('clinical');
    else if (step === 'clinical') setStep('schedule');
    else if (step === 'schedule') setStep('payment');
    else if (step === 'payment') {
      try {
        const response = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          setStep('success');
        } else {
          console.error('Failed to save appointment');
          alert('There was an error saving your appointment. Please try again.');
        }
      } catch (error) {
        console.error('Error saving appointment:', error);
        alert('Network error. Please check your connection.');
      }
    }
  };

  const prevStep = () => {
    if (step === 'clinical') setStep('personal');
    else if (step === 'schedule') setStep('clinical');
    else if (step === 'payment') setStep('schedule');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const steps = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'clinical', label: 'Clinical', icon: Stethoscope },
    { id: 'schedule', label: 'Schedule', icon: CalendarIcon },
    { id: 'payment', label: 'Payment', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-bg-light py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Stepper */}
        {step !== 'success' && (
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const isActive = step === s.id;
                const isCompleted = steps.findIndex(x => x.id === step) > idx;
                
                return (
                  <div key={s.id} className="relative z-10 flex flex-col items-center">
                    <div 
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                        isActive ? "bg-primary text-white scale-110 shadow-lg" : 
                        isCompleted ? "bg-secondary text-white" : "bg-white text-gray-400 border-2 border-gray-200"
                      )}
                    >
                      {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                    </div>
                    <span className={cn(
                      "mt-2 text-xs font-bold uppercase tracking-wider hidden sm:block",
                      isActive ? "text-primary" : "text-gray-400"
                    )}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-primary/5 overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 'personal' && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 md:p-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h2>
                <p className="text-gray-500 mb-8">Let's start with your basic details to create your clinical record.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Full Name</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Age</label>
                    <input 
                      type="number" 
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="25"
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>
                
                <div className="mt-12 flex justify-end">
                  <button 
                    onClick={nextStep}
                    disabled={!formData.fullName || !formData.email}
                    className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                    <ChevronRight className="ml-2" size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'clinical' && (
              <motion.div
                key="clinical"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 md:p-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Clinical Record</h2>
                <p className="text-gray-500 mb-8">Help us understand your physical state and health objectives.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Current Weight (kg)</label>
                    <input 
                      type="number" 
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="70"
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Height (cm)</label>
                    <input 
                      type="number" 
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      placeholder="175"
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Health Goals</label>
                    <textarea 
                      name="goals"
                      value={formData.goals}
                      onChange={handleInputChange}
                      placeholder="e.g., Weight loss, muscle gain, improved energy..."
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-32 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Existing Medical Conditions / Allergies</label>
                    <textarea 
                      name="conditions"
                      value={formData.conditions}
                      onChange={handleInputChange}
                      placeholder="Please list any relevant medical history..."
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-32 resize-none"
                    />
                  </div>
                </div>
                
                <div className="mt-12 flex justify-between">
                  <button 
                    onClick={prevStep}
                    className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center"
                  >
                    <ChevronLeft className="mr-2" size={20} />
                    Back
                  </button>
                  <button 
                    onClick={nextStep}
                    className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all flex items-center"
                  >
                    Next Step
                    <ChevronRight className="ml-2" size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'schedule' && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 md:p-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Select a Date & Time</h2>
                <p className="text-gray-500 mb-8">Choose a slot that fits your schedule. All times are in your local timezone.</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 block">Select Date</label>
                    <input 
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <div className="p-4 bg-bg-dark rounded-2xl border border-primary/10">
                      <div className="flex items-center text-primary mb-2">
                        <AlertCircle size={16} className="mr-2" />
                        <span className="text-xs font-bold uppercase tracking-wider">Note</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Appointments must be scheduled at least 24 hours in advance. Cancellations require 12-hour notice.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 block">Available Slots</label>
                    <div className="grid grid-cols-2 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setFormData(prev => ({ ...prev, time }))}
                          className={cn(
                            "py-3 rounded-xl text-sm font-bold border transition-all flex items-center justify-center space-x-2",
                            formData.time === time 
                              ? "bg-primary text-white border-primary shadow-md" 
                              : "bg-white text-gray-600 border-gray-100 hover:border-primary/30"
                          )}
                        >
                          <Clock size={14} />
                          <span>{time}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-12 flex justify-between">
                  <button 
                    onClick={prevStep}
                    className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center"
                  >
                    <ChevronLeft className="mr-2" size={20} />
                    Back
                  </button>
                  <button 
                    onClick={nextStep}
                    disabled={!formData.date || !formData.time}
                    className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                    <ChevronRight className="ml-2" size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 md:p-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h2>
                <p className="text-gray-500 mb-8">Secure your appointment by choosing a payment method.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
                    className={cn(
                      "p-6 rounded-3xl border-2 transition-all text-left group",
                      formData.paymentMethod === 'card' 
                        ? "border-primary bg-primary/5" 
                        : "border-gray-100 hover:border-primary/20"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all",
                      formData.paymentMethod === 'card' ? "bg-primary text-white" : "bg-gray-100 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      <CreditCard size={24} />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Credit / Debit Card</h3>
                    <p className="text-sm text-gray-500">Secure payment via Stripe/Tilopay</p>
                  </button>

                  <button
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cash' }))}
                    className={cn(
                      "p-6 rounded-3xl border-2 transition-all text-left group",
                      formData.paymentMethod === 'cash' 
                        ? "border-primary bg-primary/5" 
                        : "border-gray-100 hover:border-primary/20"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all",
                      formData.paymentMethod === 'cash' ? "bg-primary text-white" : "bg-gray-100 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      <User size={24} />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Pay in Cash</h3>
                    <p className="text-sm text-gray-500">Pay at the clinic on your visit</p>
                  </button>
                </div>

                {formData.paymentMethod === 'card' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 p-6 bg-bg-light rounded-3xl border border-primary/10 mb-8"
                  >
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Card Number</label>
                      <input 
                        type="text" 
                        placeholder="0000 0000 0000 0000"
                        className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Expiry Date</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">CVC</label>
                        <input 
                          type="text" 
                          placeholder="123"
                          className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="bg-bg-dark p-6 rounded-3xl border border-primary/5 mb-12">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Consultation Fee</span>
                    <span className="font-bold text-gray-900">$99.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-primary/10">
                    <span className="font-bold text-gray-900">Total to Pay</span>
                    <span className="text-2xl font-bold text-primary">$99.00</span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button 
                    onClick={prevStep}
                    className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center"
                  >
                    <ChevronLeft className="mr-2" size={20} />
                    Back
                  </button>
                  <button 
                    onClick={nextStep}
                    className="px-12 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                  >
                    Confirm Appointment
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 md:p-20 text-center"
              >
                <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 size={48} className="text-primary" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Appointment Confirmed!</h2>
                <p className="text-gray-600 text-lg mb-12 max-w-md mx-auto">
                  Thank you, <span className="font-bold text-primary">{formData.fullName}</span>. Your clinical record has been created and your session is scheduled for:
                </p>
                
                <div className="bg-bg-light p-8 rounded-[2rem] border border-primary/10 inline-block mb-12 text-left">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm">
                      <CalendarIcon className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date</p>
                      <p className="text-lg font-bold text-gray-900">{formData.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm">
                      <Clock className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Time</p>
                      <p className="text-lg font-bold text-gray-900">{formData.time}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="px-10 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all"
                  >
                    Return to Home
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
