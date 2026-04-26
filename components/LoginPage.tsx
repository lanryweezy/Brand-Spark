import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from './ui/Button';
import Input from './ui/Input';
import { SparklesIcon } from '../constants';

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('alex@agency.com');
    const [password, setPassword] = useState('password123');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            login();
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-white flex flex-col justify-center items-center p-4 relative overflow-hidden">

             {/* Decorative background elements */}
             <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"></div>
             <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

             <div className="text-center mb-10 relative z-10">
                <div className="bg-white p-4 rounded-2xl inline-block shadow-sm border border-slate-100 mb-6">
                    <SparklesIcon className="h-10 w-10 text-brand-primary" />
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">BrandSpark AI Studio</h1>
                <p className="text-lg text-slate-500 mt-3 font-medium">Sign in to your agency workspace</p>
            </div>

            <div className="w-full max-w-[440px] relative z-10">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-10 space-y-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <Input 
                            label="Email Address" 
                            id="email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            autoComplete="email" 
                            required 
                            placeholder="name@agency.com"
                        />
                        <Input 
                            label="Password" 
                            id="password" 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password" 
                            required 
                            placeholder="••••••••"
                        />
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">Remember me</label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-brand-primary hover:text-indigo-500">Forgot password?</a>
                            </div>
                        </div>

                         <Button type="submit" isLoading={isLoading} className="w-full mt-6" size="lg">
                           {isLoading ? 'Signing In...' : 'Sign In to Workspace'}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white/80 px-4 text-slate-500 font-medium">Or continue with</span>
                        </div>
                    </div>

                     <div className="grid grid-cols-2 gap-4">
                        <Button variant="secondary" className="w-full" disabled>
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                            Google
                        </Button>
                        <Button variant="secondary" className="w-full" disabled>
                            <svg className="w-5 h-5 mr-2 text-slate-700" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                            SSO
                        </Button>
                    </div>
                </div>
                <p className="text-center text-sm text-slate-500 mt-8">
                    By signing in, you agree to our <a href="#" className="font-medium text-slate-700 hover:underline">Terms of Service</a> and <a href="#" className="font-medium text-slate-700 hover:underline">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
