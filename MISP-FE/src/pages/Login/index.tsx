import { useAuth } from '@/api/queries/auth';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import FullScreenLoader from '@/components/common/FullScreenLoader';
import { useUserStore } from '@/store/useAuthStore';
import { trackEvent } from '@/components/Analytics';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [resetPhoneNumber, setResetPhoneNumber] = useState('');
    const [resetOtp, setResetOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const { login, isLoading, setIsExternal, sendResetOtp, resetPasswordWithOtp } = useAuth();

    // Check for username and password in URL parameters
    useEffect(() => {
        useUserStore.getState().logout();
        const username = searchParams.get('username');
        const urlPassword = searchParams.get('password');
        if (username && urlPassword) {
            const data = {
                email: username,
                password: urlPassword,
            }
            login.mutate(data, {
                onSuccess: () => {
                    setIsExternal(true);
                    trackEvent('login', { method: 'url_params' });
                    navigate("/dashboard");
                }
            });
        }
    }, [searchParams]);

    const handleLogin = async () => {
        if (!userId || !password) {
            toast.error("Please enter both User ID and Password")
            return;
        }
        setIsExternal(false);
        const data = {
            email: userId,
            password: password,
        }

        login.mutate(data, {
            onSuccess: () => {
                trackEvent('login', { method: 'credentials' });
                navigate("/dashboard");
            }
        });
    };

    const handleSendOtp = () => {
        if (!resetPhoneNumber) {
            toast.error("Please enter a phone number");
            return;
        }
        sendResetOtp.mutate({ phoneNumber: resetPhoneNumber }, {
            onSuccess: () => {
                toast.success("OTP sent to your WhatsApp successfully");
                setOtpSent(true);
            }
        });
    };

    const handleResetPassword = () => {
        if (!resetOtp || !newPassword) {
            toast.error("Please enter both OTP and new password");
            return;
        }
        resetPasswordWithOtp.mutate({ 
            phoneNumber: resetPhoneNumber, 
            otp: resetOtp, 
            newPassword 
        }, {
            onSuccess: () => {
                toast.success("Password reset successfully. You can now login.");
                setIsForgotPasswordOpen(false);
                setOtpSent(false);
                setResetPhoneNumber('');
                setResetOtp('');
                setNewPassword('');
            }
        });
    };


    const tokenFromUrl = searchParams.get('token');
    const usernameFromUrl = searchParams.get('username');
    const passwordFromUrl = searchParams.get('password');

    if (tokenFromUrl || (usernameFromUrl && passwordFromUrl)) {
        return (
            <>
                <FullScreenLoader />
            </>
        );
    }

    return (
        <>
            <div
                className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
                style={{
                    backgroundImage: 'url(/LoginPage.webp)',
                }}
            >
                {/* Back to website button */}
                <Link
                    to="/"
                    className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/70 hover:bg-black/90 text-white/90 hover:text-white border border-white/20 backdrop-blur-md text-xs font-semibold transition-all shadow-lg"
                >
                    &larr; Back to Eiffel Lighting
                </Link>

                <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]"></div>

                <div className="relative z-10 w-full max-w-md mx-4">
                    <div
                        className="backdrop-blur-2xl bg-black/65 p-8 rounded-3xl shadow-2xl border border-white/15"
                        style={{
                            boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.7)',
                        }}
                    >
                        <div className="flex flex-col items-center mb-6">
                            <div className="backdrop-blur-md bg-black/70 p-2.5 rounded-2xl border border-white/20 mb-3 shadow-xl">
                                <img
                                    src="/assets/eiffel-logo.jpg"
                                    alt="MIPS"
                                    className="w-14 h-14 object-contain rounded-xl"
                                />
                            </div>
                            <h1 className="font-extrabold tracking-widest text-2xl text-white drop-shadow-lg">M I P S</h1>
                            <p className="text-[11px] text-lime-400 font-bold text-center mt-1 drop-shadow tracking-wider uppercase">
                                Manufacturing Inventory &amp; Planning System
                            </p>
                        </div>

                        <hr className="border-white/15 mb-6" />

                        <h2 className="text-white text-xl font-bold mb-1 drop-shadow">Welcome Back</h2>
                        <p className="text-xs mb-6 text-gray-300 drop-shadow">Enter your enterprise credentials to access MIPS portal</p>

                        <div className="mb-5">
                            <label className="block text-xs font-semibold text-gray-200 mb-1.5 drop-shadow">Email Address</label>
                            <input
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full px-4 py-3 bg-white/95 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all text-gray-900 placeholder:text-gray-500 font-medium text-sm"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleLogin();
                                    }
                                }}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-semibold text-gray-200 mb-1.5 drop-shadow">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 bg-white/95 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all text-gray-900 placeholder:text-gray-500 font-medium text-sm"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleLogin();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 focus:outline-none transition-colors"
                                >
                                    {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                                </button>
                            </div>
                            <div className="mt-2 text-right">
                                <button
                                    type="button"
                                    onClick={() => setIsForgotPasswordOpen(true)}
                                    className="text-xs text-lime-400 hover:text-lime-300 hover:underline transition-all font-semibold"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        </div>

                        <Button
                            onClick={handleLogin}
                            disabled={isLoading}
                            className="w-full bg-lime-500 hover:bg-lime-400 text-black py-3.5 rounded-xl font-black text-sm shadow-lg shadow-lime-500/20 hover:shadow-lime-500/30 transition-all border-none"
                        >
                            {isLoading && (
                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" />
                            )}
                            {isLoading ? 'Authenticating…' : 'Sign in to MIPS'}
                        </Button>

                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                            <span className="text-gray-300 text-[11px]">Demo: <strong className="text-lime-400 font-mono">admin@gmail.com</strong></span>
                            <button
                                type="button"
                                onClick={() => {
                                    setUserId('admin@gmail.com');
                                    setPassword('Admin@123');
                                }}
                                className="text-[11px] text-lime-400 hover:text-lime-300 underline font-semibold transition-all"
                            >
                                Auto-Fill Credentials
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Forgot Password Dialog */}
            <Dialog open={isForgotPasswordOpen} onOpenChange={(open) => {
                setIsForgotPasswordOpen(open);
                if (!open) {
                    setOtpSent(false);
                    setResetPhoneNumber('');
                    setResetOtp('');
                    setNewPassword('');
                }
            }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                            {otpSent 
                                ? "Enter the OTP sent to your WhatsApp and your new password." 
                                : "Enter your phone number to receive a reset OTP via WhatsApp."}
                        </DialogDescription>
                    </DialogHeader>
                    
                    {!otpSent ? (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    value={resetPhoneNumber}
                                    onChange={(e) => setResetPhoneNumber(e.target.value)}
                                    placeholder="Enter your phone number"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSendOtp();
                                    }}
                                />
                            </div>
                            <Button 
                                onClick={handleSendOtp}
                                disabled={sendResetOtp.isPending || !resetPhoneNumber}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                            >
                                {sendResetOtp.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                Send OTP
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">OTP</label>
                                <input
                                    type="text"
                                    value={resetOtp}
                                    onChange={(e) => setResetOtp(e.target.value)}
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleResetPassword();
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                                    </button>
                                </div>
                            </div>
                            <Button 
                                onClick={handleResetPassword}
                                disabled={resetPasswordWithOtp.isPending || !resetOtp || !newPassword}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                            >
                                {resetPasswordWithOtp.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                Reset Password
                            </Button>
                            <div className="text-center">
                                <button 
                                    type="button" 
                                    onClick={() => setOtpSent(false)}
                                    className="text-sm text-orange-600 hover:underline"
                                >
                                    Back to phone number
                                </button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default LoginPage;
