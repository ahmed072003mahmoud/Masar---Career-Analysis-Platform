
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Button from '../components/ui/Button';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_token_reg";
      dispatch({ type: 'LOGIN', user: { email, token: mockToken } });
      dispatch({ type: 'UPDATE_PROFILE', profile: { fullName: name, email } });
      dispatch({ type: 'ADD_TOAST', message: 'تم إنشاء الحساب بنجاح' });
      setIsLoading(false);
      navigate('/assessment');
    }, 1000);
  };

  return (
    <div className="container-custom py-24 flex items-center justify-center">
      <div className="bg-[#112240] p-10 rounded-[3rem] border border-[#233554] shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="bg-[#64FFDA]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-[#64FFDA]" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">إنشاء حساب جديد</h1>
          <p className="text-slate-400 text-sm mt-2">انضم إلينا وابدأ رحلتك المهنية الذكية</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block text-right">الاسم الكامل</label>
            <div className="relative group">
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0A192F] border-2 border-[#233554] rounded-2xl p-4 pr-12 text-sm text-white focus:border-[#64FFDA] outline-none text-right transition-all"
                placeholder="أحمد محمد"
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#64FFDA]" size={20} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block text-right">البريد الإلكتروني</label>
            <div className="relative group">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0A192F] border-2 border-[#233554] rounded-2xl p-4 pr-12 text-sm text-white focus:border-[#64FFDA] outline-none text-right transition-all"
                placeholder="name@example.com"
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#64FFDA]" size={20} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block text-right">كلمة المرور</label>
            <div className="relative group">
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0A192F] border-2 border-[#233554] rounded-2xl p-4 pr-12 text-sm text-white focus:border-[#64FFDA] outline-none text-right transition-all"
                placeholder="••••••••"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#64FFDA]" size={20} />
            </div>
          </div>

          <Button 
            type="submit" 
            isLoading={isLoading} 
            className="w-full bg-[#64FFDA] text-[#0A192F] rounded-2xl py-4 font-bold text-lg"
          >
            تسجيل
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            لديك حساب بالفعل؟ <Link to="/login" className="text-[#64FFDA] font-bold hover:underline">سجل دخولك</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
