import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Stethoscope, Heart, Baby, Brain, Activity, Beaker, Bone, Eye } from 'lucide-react';

const departments = [
  {
    icon: <Heart className="w-10 h-10 text-rose-500" />,
    title: "Cardiology",
    description: "Advanced heart care, diagnostics, and surgical solutions for all cardiovascular conditions.",
    color: "bg-rose-50"
  },
  {
    icon: <Bone className="w-10 h-10 text-amber-600" />,
    title: "Orthopedics",
    description: "Specialized treatment for bone and joint disorders, from sports injuries to joint replacements.",
    color: "bg-amber-50"
  },
  {
    icon: <Baby className="w-10 h-10 text-sky-500" />,
    title: "Pediatrics",
    description: "Comprehensive healthcare for infants, children, and adolescents in a kid-friendly environment.",
    color: "bg-sky-50"
  },
  {
    icon: <Brain className="w-10 h-10 text-purple-500" />,
    title: "Neurology",
    description: "Expert diagnosis and treatment for complex neurological conditions and brain disorders.",
    color: "bg-purple-50"
  },
  {
    icon: <Eye className="w-10 h-10 text-emerald-500" />,
    title: "Ophthalmology",
    description: "State-of-the-art eye care services, from routine exams to advanced laser surgeries.",
    color: "bg-emerald-50"
  },
  {
    icon: <Beaker className="w-10 h-10 text-indigo-500" />,
    title: "Pathology",
    description: "Precise laboratory diagnostics and research to understand and treat diseases effectively.",
    color: "bg-indigo-50"
  },
  {
    icon: <Activity className="w-10 h-10 text-orange-500" />,
    title: "Physical Therapy",
    description: "Personalized rehabilitation programs to restore mobility and improve quality of life.",
    color: "bg-orange-50"
  },
  {
    icon: <Stethoscope className="w-10 h-10 text-blue-500" />,
    title: "General Medicine",
    description: "Primary care and preventive medicine for daily wellness and common health concerns.",
    color: "bg-blue-50"
  },
];

export default function Services() {
  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-8">
        <div className="max-w-2xl mb-20 text-left">
          <span className="text-primary font-bold tracking-widest text-[10px] uppercase mb-4 block underline underline-offset-8">Our Medical expertise</span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">Clinical Excellence</h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            MediCore offers advanced specialized diagnostics and treatments delivered by expert physicians in state-of-the-art facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border border-slate-200 shadow-sm hover:shadow-xl transition-all rounded-[2rem] overflow-hidden group bg-white">
                <div className={`p-8 ${dept.color} flex justify-center items-center group-hover:bg-white transition-colors duration-500`}>
                  {dept.icon}
                </div>
                <CardHeader className="px-8 pt-6">
                  <CardTitle className="text-xl font-bold text-slate-800">{dept.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <CardDescription className="text-slate-500 text-sm leading-relaxed font-medium">
                    {dept.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 p-16 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="max-w-xl relative z-10">
            <h2 className="text-4xl font-light mb-4">Can't find a specialty?</h2>
            <p className="text-slate-400 font-medium">
              We operate over 50 specialized clinics. Our patient support team is available 24/7 to help you find the right care.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative z-10">
            <Button size="lg" className="rounded-2xl px-12 h-16 bg-white text-slate-900 hover:bg-slate-100 font-bold">General Inquiry</Button>
          </motion.div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
        </div>
      </div>
    </div>
  );
}
