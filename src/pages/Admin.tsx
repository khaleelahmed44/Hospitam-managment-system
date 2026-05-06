import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, onSnapshot, orderBy, updateDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { Appointment } from '@/types/hospital';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Search, 
  Filter, 
  ShieldCheck,
  LogOut,
  Hospital,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Hardcoded password as requested
  const ADMIN_PASSWORD = "Doctor@123";

  useEffect(() => {
    // Check session storage for persistence within the session
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !firebaseUser) return;

    const q = query(
      collection(db, 'appointments'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      setAppointments(apps);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      if (error.code === 'permission-denied') {
        toast.error("Permission Denied: Ensure you are logged in with an admin account.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated, firebaseUser]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      toast.success("Welcome back, Admin");
    } else {
      toast.error("Invalid password. Access denied.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    toast.info("Logged out from admin panel");
  };

  const updateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      await updateDoc(doc(db, 'appointments', id), {
        status,
        updatedAt: new Date().toISOString()
      });
      toast.success(`Appointment marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this record?")) return;
    try {
      await deleteDoc(doc(db, 'appointments', id));
      toast.success("Appointment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete appointment");
    }
  };

  const filteredApps = appointments.filter(app => {
    const searchMatch = 
      app.patientName.toLowerCase().includes(search.toLowerCase()) ||
      app.patientEmail.toLowerCase().includes(search.toLowerCase()) ||
      app.reason.toLowerCase().includes(search.toLowerCase());
    
    const statusMatch = statusFilter === 'all' || app.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="rounded-[2.5rem] border-none shadow-2xl p-10 bg-white">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Gateway</h1>
              <p className="text-slate-500 font-medium mt-2">Staff Only - Restricted Area</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              {!firebaseUser && (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-[10px] font-bold text-amber-700 uppercase leading-relaxed">
                    Firebase authentication required for secure data access. Please sign in via the header first.
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Access Password</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="rounded-2xl h-14 px-6 border-slate-200 bg-slate-50 focus:bg-white transition-all text-center text-lg tracking-widest"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full h-14 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                Verify Credentials
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Clinical Control Panel</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              Hospital Admin
              <Hospital className="w-8 h-8 text-primary" />
            </h1>
            <p className="text-slate-500 font-medium">Monitoring {appointments.length} active healthcare records</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="rounded-2xl h-14 px-6 text-slate-400 font-bold hover:text-red-500 hover:bg-red-50 transition-all border border-slate-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Exit Panel
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'System Total', val: stats.total, icon: Activity, color: 'bg-primary' },
            { label: 'Awaiting Action', val: stats.pending, icon: Clock, color: 'bg-amber-500' },
            { label: 'Validated', val: stats.confirmed, icon: CheckCircle, color: 'bg-green-500' },
            { label: 'Rescheduled/Cancelled', val: stats.cancelled, icon: XCircle, color: 'bg-red-500' },
          ].map((stat, i) => (
            <Card key={i} className="rounded-[2rem] border border-slate-200 p-8 shadow-sm group hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <div className="text-4xl font-light text-slate-900">{stat.val}</div>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div className={`${stat.color} h-full`} style={{ width: `${(stat.val/stats.total || 0) * 100}%` }} />
              </div>
            </Card>
          ))}
        </div>

        {/* Control Section */}
        <Card className="rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden bg-white">
          <div className="px-10 py-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <h3 className="text-xl font-bold text-slate-900 shrink-0">Appointment Journal</h3>
            
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              <div className="relative flex-grow md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Patient name, email or reason..." 
                  className="pl-12 h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 shrink-0">
                {['all', 'pending', 'confirmed', 'cancelled'].map((label) => (
                  <button
                    key={label}
                    onClick={() => setStatusFilter(label)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                      statusFilter === label 
                        ? 'bg-white text-primary shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-0">
            {loading ? (
              <div className="py-24 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="py-24 text-center">
                <Users className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                <p className="text-slate-400 font-medium">No records matching clinical filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient Details</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Schedule</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Clinical Reason</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-6">
                          <div>
                            <p className="font-extrabold text-slate-900">{app.patientName}</p>
                            <p className="text-xs text-slate-400">{app.patientEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-primary group-hover:bg-white transition-colors">
                              <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-700">{format(parseISO(app.appointmentDate), 'MMM d, yyyy')}</p>
                              <p className="text-xs text-slate-400">{app.appointmentTime}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <p className="text-sm text-slate-600 line-clamp-1 italic max-w-xs">{app.reason}</p>
                        </td>
                        <td className="px-6 py-6">
                          <span className={`text-[10px] px-3 py-1 border rounded-lg font-bold uppercase tracking-wider ${
                            app.status === 'confirmed' ? 'bg-green-50 border-green-100 text-green-600' :
                            app.status === 'cancelled' ? 'bg-red-50 border-red-100 text-red-600' :
                            'bg-amber-50 border-amber-100 text-amber-600'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {app.status === 'pending' && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-10 w-10 rounded-xl text-green-500 hover:bg-green-50"
                                onClick={() => updateStatus(app.id, 'confirmed')}
                                title="Confirm"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </Button>
                            )}
                            {app.status !== 'cancelled' && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-10 w-10 rounded-xl text-amber-500 hover:bg-amber-50"
                                onClick={() => updateStatus(app.id, 'cancelled')}
                                title="Cancel"
                              >
                                <XCircle className="w-5 h-5" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600"
                              onClick={() => deleteAppointment(app.id)}
                              title="Delete Record"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
