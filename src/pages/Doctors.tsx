import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Search, Filter, Star, Clock, Heart, Users } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const doctors = [
  {
    id: '1',
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    rating: 4.9,
    experience: "12 years",
    availability: "Mon, Wed, Fri",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200",
    bio: "Chief Cardiologist specializing in non-invasive heart diagnostics."
  },
  {
    id: '2',
    name: "Dr. Michael Chen",
    specialty: "Orthopedics",
    rating: 4.8,
    experience: "10 years",
    availability: "Tue, Thu",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200&h=200",
    bio: "Orthopedic surgeon focused on minimally invasive joint repairs."
  },
  {
    id: '3',
    name: "Dr. Elena Rodriguez",
    specialty: "Pediatrics",
    rating: 5.0,
    experience: "15 years",
    availability: "Daily",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200",
    bio: "Dedicated pediatrician with a focus on early childhood development and nutrition."
  },
  {
    id: '4',
    name: "Dr. James Wilson",
    specialty: "Neurology",
    rating: 4.7,
    experience: "20 years",
    availability: "Mon, Tue, Wed",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200",
    bio: "Renowned neurologist specializing in stroke recovery and Parkinson's disease."
  },
  {
    id: '5',
    name: "Dr. Lisa Wang",
    specialty: "Ophthalmology",
    rating: 4.9,
    experience: "8 years",
    availability: "Wed, Thu, Sat",
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=200&h=200",
    bio: "Ophthalmologist specializing in advanced laser eye correction surgery."
  },
  {
    id: '6',
    name: "Dr. Marcus Thorne",
    specialty: "Cardiology",
    rating: 4.6,
    experience: "14 years",
    availability: "Mon, Fri",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200&h=200",
    bio: "Interventional cardiologist expert in congenital heart conditions."
  }
];

const specialties = ["All", "Cardiology", "Orthopedics", "Pediatrics", "Neurology", "Ophthalmology"];

export default function Doctors() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || 
                           doc.specialty.toLowerCase().includes(search.toLowerCase());
      const matchesSpecialty = selectedSpecialty === "All" || doc.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });
  }, [search, selectedSpecialty]);

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-xl">
            <span className="text-primary font-bold tracking-widest text-[10px] uppercase mb-4 block underline underline-offset-8">Medical Expertise</span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">Our Specialists</h1>
            <p className="text-lg text-slate-500 font-medium">
              Browse our directory of qualified medical professionals and find the right expert for your needs.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group flex-grow sm:flex-grow-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                placeholder="Search specialty, name..." 
                className="bg-white border border-slate-200 h-14 pl-12 pr-6 rounded-2xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 w-full md:w-[350px] shadow-sm font-medium transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Specialty Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-16">
          {specialties.map((s) => (
            <Button
              key={s}
              variant={selectedSpecialty === s ? "default" : "outline"}
              className={`rounded-2xl px-8 h-12 text-[11px] font-bold uppercase tracking-widest shadow-sm transition-all ${selectedSpecialty === s ? 'shadow-lg shadow-primary/20' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              onClick={() => setSelectedSpecialty(s)}
            >
              {s}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredDoctors.map((doc) => (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden group bg-white flex flex-col">
                  <div className="p-8 flex flex-col h-full">
                    <div className="flex items-start gap-8 mb-10">
                      <div className="relative shrink-0">
                        <img 
                          src={doc.image} 
                          alt={doc.name} 
                          className="w-28 h-28 rounded-3xl object-cover shadow-xl grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute -bottom-3 -right-3 bg-white rounded-xl px-2 py-1 shadow-md border border-slate-100 flex items-center gap-1.5 scale-90">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-black">{doc.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex-grow pt-2">
                        <span className="text-primary font-bold text-[10px] uppercase tracking-widest mb-2 block">
                          {doc.specialty}
                        </span>
                        <h3 className="text-2xl font-extrabold text-slate-900 mb-2 leading-tight">
                          {doc.name}
                        </h3>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-400 border border-slate-100">
                          <Heart className="w-3 h-3" />
                          <span>{doc.experience} EXP</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-500 text-sm mb-10 line-clamp-3 leading-relaxed font-medium">
                      {doc.bio}
                    </p>

                    <div className="mt-auto pt-8 border-t border-slate-100 flex flex-col gap-6">
                      <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
                        <Clock className="w-4 h-4 text-slate-300 group-hover:text-primary" />
                        <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 tracking-wider">AVAILABLE: {doc.availability.toUpperCase()}</span>
                      </div>
                      
                      <Link to={`/book?doctorId=${doc.id}`}>
                        <Button className="w-full rounded-2xl h-14 font-extrabold shadow-lg shadow-primary/10 hover:scale-[1.02] transition-transform">
                          Schedule Visit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No doctors found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search or filter settings.</p>
            <Button variant="link" onClick={() => { setSearch(''); setSelectedSpecialty('All'); }} className="mt-4 text-primary">
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
