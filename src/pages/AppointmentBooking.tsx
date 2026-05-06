import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Stethoscope, User, Calendar as CalendarIcon, Clock, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

const specialties = ["Cardiology", "Orthopedics", "Pediatrics", "Neurology", "Ophthalmology", "Pathology"];

const doctors = [
  { id: '1', name: "Dr. Sarah Johnson", specialty: "Cardiology" },
  { id: '2', name: "Dr. Michael Chen", specialty: "Orthopedics" },
  { id: '3', name: "Dr. Elena Rodriguez", specialty: "Pediatrics" },
  { id: '4', name: "Dr. James Wilson", specialty: "Neurology" },
  { id: '5', name: "Dr. Lisa Wang", specialty: "Ophthalmology" },
  { id: '6', name: "Dr. Marcus Thorne", specialty: "Cardiology" }
];

const timeSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"];

export default function AppointmentBooking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialDoctorId = searchParams.get('doctorId');

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    specialty: '',
    doctorId: initialDoctorId || '',
    date: undefined as Date | undefined,
    time: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialDoctorId) {
      const doctor = doctors.find(d => d.id === initialDoctorId);
      if (doctor) {
        setFormData(prev => ({ ...prev, doctorId: doctor.id, specialty: doctor.specialty }));
        setStep(3); // Jump to date selection if doctor is pre-selected
      }
    }
  }, [initialDoctorId]);

  const filteredDoctors = doctors.filter(d => d.specialty === formData.specialty);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!auth.currentUser || !formData.date || !formData.doctorId || !formData.time) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'appointments'), {
        doctorId: formData.doctorId,
        patientId: auth.currentUser.uid,
        appointmentDate: format(formData.date, 'yyyy-MM-dd'),
        appointmentTime: formData.time,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setStep(5); // Success step
      toast.success("Appointment requested successfully!");
    } catch (error) {
      console.error("Booking failed", error);
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Step 1</Label>
                <h3 className="text-2xl font-bold">Select Department</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specialties.map(s => (
                  <Button
                    key={s}
                    variant={formData.specialty === s ? "default" : "outline"}
                    className={`h-20 justify-start px-6 rounded-2xl ${formData.specialty === s ? 'shadow-lg border-primary' : 'hover:border-primary/50'}`}
                    onClick={() => {
                      setFormData({ ...formData, specialty: s, doctorId: '' });
                      handleNext();
                    }}
                  >
                    <Stethoscope className="mr-4 h-6 w-6" />
                    <span className="text-lg font-semibold">{s}</span>
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Step 2</Label>
                <h3 className="text-2xl font-bold">Choose your Specialist</h3>
              </div>
              <div className="space-y-3">
                {filteredDoctors.map(doc => (
                  <Button
                    key={doc.id}
                    variant={formData.doctorId === doc.id ? "default" : "outline"}
                    className="w-full h-16 justify-between px-6 rounded-2xl"
                    onClick={() => {
                      setFormData({ ...formData, doctorId: doc.id });
                      handleNext();
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-500" />
                      </div>
                      <span className="font-semibold">{doc.name}</span>
                    </div>
                    {formData.doctorId === doc.id && <CheckCircle2 className="w-5 h-5 text-white" />}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="space-y-6 text-center">
              <div className="space-y-2 text-left">
                <Label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Step 3</Label>
                <h3 className="text-2xl font-bold">Select Date</h3>
              </div>
              <div className="bg-white p-4 rounded-3xl border shadow-sm inline-block mx-auto">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => {
                    setFormData({ ...formData, date });
                    handleNext();
                  }}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="rounded-md"
                />
              </div>
              <p className="text-sm text-slate-400 italic">Note: Appointments are not available on Sundays.</p>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="space-y-8">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Step 4</Label>
                <h3 className="text-2xl font-bold">Select a Time Slot</h3>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {timeSlots.map(time => (
                  <Button
                    key={time}
                    variant={formData.time === time ? "default" : "outline"}
                    className="rounded-xl h-12"
                    onClick={() => setFormData({ ...formData, time })}
                  >
                    {time}
                  </Button>
                ))}
              </div>

              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 mt-8">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Booking Summary
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-1">
                    <p className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Specialist</p>
                    <p className="font-semibold text-slate-700">{doctors.find(d => d.id === formData.doctorId)?.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Department</p>
                    <p className="font-semibold text-slate-700">{formData.specialty}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Date</p>
                    <p className="font-semibold text-slate-700">{formData.date ? format(formData.date, 'MMMM do, yyyy') : ''}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Time</p>
                    <p className="font-semibold text-slate-700">{formData.time || 'Not selected'}</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleSubmit} 
                className="w-full py-8 text-lg rounded-3xl" 
                disabled={!formData.time || isSubmitting}
              >
                {isSubmitting ? 'Confirming...' : 'Request Appointment'}
              </Button>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Request Sent!</h2>
            <p className="text-slate-600 mb-8 max-w-sm mx-auto">
              Your appointment request for {formData.date ? format(formData.date, 'MMMM do') : ''} at {formData.time} is being processed. 
              You can track the status in your dashboard.
            </p>
            <div className="flex flex-col gap-3 justify-center">
              <Button size="lg" onClick={() => navigate('/dashboard')} className="rounded-2xl px-12">Go to Dashboard</Button>
              <Button variant="ghost" onClick={() => navigate('/')}>Return Home</Button>
            </div>
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <div className="py-20 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {step < 5 && (
            <div className="flex items-center gap-4 mb-8">
              {step > 1 && (
                <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full">
                  <ChevronLeft className="w-6 h-6" />
                </Button>
              )}
              <div className="flex-grow">
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(step / 4) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
              <span className="text-xs font-bold text-slate-400 min-w-[3rem] text-right">Step {step}/4</span>
            </div>
          )}

          <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 md:p-12">
              {renderStep()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
