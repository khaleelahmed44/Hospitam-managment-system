import React, { useState } from 'react';
import { motion } from 'motion/react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Phone, Mail, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { toast } from 'sonner';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! Your message has been sent.");
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const MapSplash = () => (
    <div className="bg-slate-100 rounded-3xl h-[400px] flex items-center justify-center p-8 text-center border-2 border-dashed border-slate-300">
      <div className="max-w-sm">
        <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">Google Maps Key Required</h3>
        <p className="text-slate-500 text-sm mb-4">
          Enable maps by adding <code>GOOGLE_MAPS_PLATFORM_KEY</code> to your AI Studio secrets.
        </p>
        <div className="text-left text-xs bg-white p-4 rounded-xl border space-y-2">
          <p>1. Get a key from Google Cloud Console</p>
          <p>2. Open Settings (⚙️) → Secrets</p>
          <p>3. Add key and app will rebuild</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-20 min-h-screen bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Connect With Our Team</h1>
          <p className="text-lg text-slate-600">
            Have questions about our services or need to reach a specific department? We're here to help you 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Info & Map */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Phone</h4>
                  <p className="text-sm text-slate-500">+1 (800) 555-0199</p>
                  <p className="text-xs text-rose-500 font-medium">Emergency: 24/7</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Email</h4>
                  <p className="text-sm text-slate-500">support@medicare.com</p>
                  <p className="text-sm text-slate-500">info@medicare.com</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Location</h4>
                  <p className="text-sm text-slate-500">123 Healthcare Blvd</p>
                  <p className="text-sm text-slate-500">Medical City, NY 10001</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Clinic Hours</h4>
                  <p className="text-sm text-slate-500">Mon - Sat: 9 AM - 6 PM</p>
                  <p className="text-sm text-slate-500">Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl h-[400px]">
              {hasValidKey ? (
                <APIProvider apiKey={API_KEY} version="weekly textSearch:all">
                  <Map
                    defaultCenter={{ lat: 40.7128, lng: -74.0060 }}
                    defaultZoom={13}
                    mapId="DEMO_MAP_ID"
                    style={{ width: '100%', height: '100%' }}
                    internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  >
                    <AdvancedMarker position={{ lat: 40.7128, lng: -74.0060 }}>
                      <Pin background="#3b82f6" glyphColor="#fff" borderColor="#1d4ed8" />
                    </AdvancedMarker>
                  </Map>
                </APIProvider>
              ) : (
                <MapSplash />
              )}
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-100"
          >
            <div className="flex items-center gap-2 text-primary mb-2">
              <MessageSquare className="w-5 h-5 fill-primary/10" />
              <span className="font-bold text-xs uppercase tracking-widest">Inquiry Form</span>
            </div>
            <h2 className="text-3xl font-bold mb-8">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    required 
                    className="rounded-2xl h-12 bg-white"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    required 
                    className="rounded-2xl h-12 bg-white"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  placeholder="How can we help?" 
                  required 
                  className="rounded-2xl h-12 bg-white"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us more about your inquiry..." 
                  className="min-h-[150px] rounded-3xl bg-white p-6" 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
              <Button type="submit" size="lg" className="w-full rounded-2xl h-14 text-lg">
                Send Message
                <Send className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
