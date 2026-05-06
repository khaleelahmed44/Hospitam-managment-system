import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';
import { Appointment } from '@/types/hospital';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, XCircle, Activity, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { format, isAfter, parseISO } from 'date-fns';

const doctorsMock = [
  { id: '1', name: "Dr. Sarah Johnson", specialty: "Cardiology" },
  { id: '2', name: "Dr. Michael Chen", specialty: "Orthopedics" },
  { id: '3', name: "Dr. Elena Rodriguez", specialty: "Pediatrics" },
  { id: '4', name: "Dr. James Wilson", specialty: "Neurology" },
  { id: '5', name: "Dr. Lisa Wang", specialty: "Ophthalmology" },
  { id: '6', name: "Dr. Marcus Thorne", specialty: "Cardiology" }
];

export default function Dashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'appointments'),
      where('patientId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      setAppointments(apps);
      setLoading(false);
    }, (error) => {
      console.error("Dashboard Snapshot Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const handleCancel = async (id: string) => {
    try {
      await updateDoc(doc(db, 'appointments', id), {
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      });
      toast.success("Appointment cancelled");
    } catch (error) {
      console.error("Cancel failed", error);
      toast.error("Failed to cancel appointment");
    }
  };

  const upcoming = appointments.filter(a => a.status !== 'cancelled' && isAfter(parseISO(a.appointmentDate), new Date()));
  const past = appointments.filter(a => a.status === 'cancelled' || !isAfter(parseISO(a.appointmentDate), new Date()));

  const getDoctorName = (id: string) => doctorsMock.find(d => d.id === id)?.name || 'Unknown Doctor';

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'confirmed': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Confirmed</Badge>;
      case 'cancelled': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Cancelled</Badge>;
      default: return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Pending</Badge>;
    }
  };

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-4">
          <div>
            <span className="text-primary font-bold tracking-widest text-[10px] uppercase mb-3 block">Patient Center</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Health Records</h1>
            <p className="text-slate-500 font-medium">Overview for {auth.currentUser?.displayName || 'Patient'}</p>
          </div>
          <Link to="/book">
            <Button className="rounded-2xl h-14 px-8 shadow-xl shadow-primary/20 font-bold hover:scale-105 transition-transform">
              New Appointment
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-[2.5rem] border border-slate-200 shadow-sm p-8 bg-white group hover:border-primary/20 transition-all">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-slate-800">Total Visits</h3>
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-primary/5 transition-colors">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="text-6xl font-light text-slate-900 mb-2">{appointments.length}</div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Medical History</p>
              </Card>

              <Card className="rounded-[2.5rem] border border-slate-200 shadow-sm p-8 bg-slate-900 text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em] mb-4">My Health Score</h3>
                  <div className="text-6xl font-extralight mb-6">94<span className="text-2xl">%</span></div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
                    <div className="bg-primary w-[94%] h-full rounded-full" />
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold">SYMBOLS: <span className="text-primary tracking-widest ml-1">OPTIMAL</span></p>
                </div>
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/20 rounded-full blur-[60px]" />
              </Card>
            </div>

            <Card className="rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden bg-white">
              <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="text-xl font-bold text-slate-900">Medical Journal</h3>
                <Tabs defaultValue="upcoming" className="w-[300px]">
                  <TabsList className="bg-slate-50 border border-slate-200 rounded-xl p-1 h-10 w-full">
                    <TabsTrigger value="upcoming" className="rounded-lg text-[10px] font-bold uppercase tracking-widest px-4">Active</TabsTrigger>
                    <TabsTrigger value="history" className="rounded-lg text-[10px] font-bold uppercase tracking-widest px-4">Past</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="p-0">
                {appointments.length === 0 ? (
                  <div className="py-24 text-center">
                    <Activity className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                    <p className="text-slate-400 font-medium">No medical encounters found.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {appointments.map((apt) => (
                      <div key={apt.id} className="px-10 py-8 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-8">
                          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-[1.25rem] flex items-center justify-center text-primary text-xl shadow-sm">
                            <Activity className="w-8 h-8 opacity-40" />
                          </div>
                          <div>
                            <div className="flex items-center gap-4 mb-1">
                              <h4 className="font-extrabold text-slate-900 text-lg">{getDoctorName(apt.doctorId)}</h4>
                              <span className="text-[10px] px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 font-bold rounded uppercase tracking-wider">{apt.status}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                              <span>{format(parseISO(apt.appointmentDate), 'PPP')}</span>
                              <span className="w-1 h-1 bg-slate-200 rounded-full" />
                              <span>{apt.appointmentTime}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button variant="ghost" size="sm" className="rounded-xl px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary">Details</Button>
                          {apt.status === 'pending' && (
                            <Button variant="ghost" size="sm" className="rounded-xl px-4 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleCancel(apt.id)}>Cancel</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="rounded-[2.5rem] border border-slate-200 shadow-sm p-10 bg-white sticky top-24">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-3xl bg-slate-50 border-2 border-white shadow-xl flex items-center justify-center overflow-hidden">
                    {auth.currentUser?.photoURL ? (
                      <img src={auth.currentUser.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-slate-200" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">{auth.currentUser?.displayName || 'User'}</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">ID: #{auth.currentUser?.uid.substring(0, 8)}</p>
              </div>

              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start h-16 px-6 rounded-2xl border-slate-200 font-bold text-slate-700 hover:bg-slate-50 group">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mr-4 border border-slate-100 group-hover:bg-white transition-colors">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  Insurance Docs
                </Button>
                <Button variant="outline" className="w-full justify-start h-16 px-6 rounded-2xl border-slate-200 font-bold text-slate-700 hover:bg-slate-50 group">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mr-4 border border-slate-100 group-hover:bg-white transition-colors">
                    <XCircle className="w-5 h-5 text-primary" />
                  </div>
                  Lab Reports
                </Button>
              </div>

              <div className="mt-12 bg-primary rounded-3xl p-8 text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[10px] uppercase font-bold opacity-80 mb-2 tracking-[0.2em]">Contact Direct</p>
                  <p className="text-2xl font-extrabold">+1 (800) MED-HMS</p>
                  <p className="text-[10px] mt-4 opacity-100 font-medium italic underline underline-offset-4 cursor-pointer">Emergency Support 24/7</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
