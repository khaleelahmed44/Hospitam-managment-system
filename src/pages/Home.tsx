import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, ShieldCheck, Clock, PhoneCall, Stethoscope, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/doctors?search=${encodeURIComponent(search)}`);
  };

  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: "Certified Experts",
      desc: "Our doctors are world-renowned in their respective fields."
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "24/7 Availability",
      desc: "Emergency services available around the clock for your peace of mind."
    },
    {
      icon: <PhoneCall className="w-6 h-6 text-primary" />,
      title: "Tele-Consultation",
      desc: "Speak with experts from the comfort of your home."
    },
  ];

  const emergencyServices = [
    { name: "Cardiac Care", icon: "❤️" },
    { name: "Emergency Surgery", icon: "🚑" },
    { name: "Maternal Health", icon: "🍼" },
    { name: "Trauma Center", icon: "🏥" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="container mx-auto px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-primary font-semibold tracking-wider text-xs uppercase mb-4 block">Premier Healthcare Services</span>
              <h1 className="text-6xl md:text-8xl font-extrabold text-slate-900 leading-[1] mb-6">
                Advanced medical <br />
                care for <span className="text-primary">everyone.</span>
              </h1>
              <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium">
                Connect with world-class specialists and manage your health records in one secure, unified platform.
              </p>

              <form onSubmit={handleSearch} className="flex bg-white border border-slate-200 p-2 rounded-2xl max-w-xl mx-auto shadow-sm">
                <div className="flex-grow flex items-center px-4 gap-3">
                  <Search className="text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    className="bg-transparent border-none outline-none text-slate-600 w-full text-sm font-medium placeholder:text-slate-400"
                    placeholder="Search specialty, doctor name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button type="submit" className="bg-primary text-white px-8 h-12 rounded-xl font-bold text-sm shadow-md hover:bg-primary/90 transition-all">
                  Find Specialist
                </Button>
              </form>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 bg-slate-50 rounded-xl shadow-sm flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-slate-100/50 rounded-full blur-3xl" />
      </section>

      {/* Specialty Units Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <span className="text-primary font-bold tracking-widest text-[10px] uppercase mb-3 block">Specialty Care</span>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900">Hospital Departments</h2>
            </div>
            <Link to="/services">
              <Button variant="ghost" className="group rounded-xl font-bold text-primary hover:bg-primary/5">
                View all units
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyServices.map((s, i) => (
              <motion.div
                key={i}
                className="group cursor-pointer p-10 bg-slate-50 rounded-[2.5rem] text-center border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-[0_20px_50px_rgba(37,99,235,0.05)] transition-all flex flex-col items-center justify-center"
                whileHover={{ y: -8 }}
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{s.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800">{s.name}</h3>
                <p className="text-xs text-slate-400 mt-2 font-medium">Explore Details</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[{v: "15k+", l: "Patients"}, {v: "250+", l: "Specialists"}, {v: "45+", l: "Units"}, {v: "99%", l: "Rating"}].map((stat, i) => (
              <div key={i}>
                <div className="text-5xl font-light mb-3">{stat.v}</div>
                <div className="text-slate-400 text-[10px] font-bold tracking-[0.2em] uppercase">{stat.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-8">
          <div className="bg-slate-50 rounded-[4rem] p-16 md:p-24 text-center border border-slate-100 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-8 leading-tight">Your health journey <br/> starts <span className="text-primary italic">here.</span></h2>
              <p className="text-xl text-slate-500 mb-12 max-w-xl mx-auto font-medium">
                Schedule your consultation today and experience world-class care designed around you.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/book">
                  <Button size="lg" className="rounded-2xl px-12 h-16 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                    Start Consultation
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="rounded-2xl px-12 h-16 text-lg font-bold border-slate-200">
                    Get Support
                  </Button>
                </Link>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-100 rounded-full blur-[80px]" />
          </div>
        </div>
      </section>
    </div>
  );
}
