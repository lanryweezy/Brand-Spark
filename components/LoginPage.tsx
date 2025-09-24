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
        <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
             <div className="text-center mb-8">
                <SparklesIcon className="h-12 w-12 text-brand-primary mx-auto" />
                <h1 className="text-4xl font-extrabold text-brand-text tracking-tight mt-2">BrandSpark AI Studio</h1>
                <p className="text-lg text-slate-500 mt-2">Sign in to your agency account.</p>
            </div>
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lifted border border-slate-200/80 p-8 space-y-6">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <Input 
                            label="Email Address" 
                            id="email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            autoComplete="email" 
                            required 
                        />
                        <Input 
                            label="Password" 
                            id="password" 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password" 
                            required 
                        />
                         <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
                           {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-slate-500">Or continue with</span>
                        </div>
                    </div>
                     <div className="space-y-3">
                        <Button variant="secondary" className="w-full" disabled>Sign in with Google</Button>
                        <Button variant="secondary" className="w-full" disabled>Sign in with SSO (SAML)</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
