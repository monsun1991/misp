import { useAuth } from '@/api/queries/auth';
import { useEffect, useState, useRef } from 'react';
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
    const [userId, setUserId] = useState('');
    const [pin, setPin] = useState<string[]>(['', '', '', '', '', '']);
    const [showPin, setShowPin] = useState(false);
    const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [resetPhoneNumber, setResetPhoneNumber] = useState('');
    const [resetOtp, setResetOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const { login, isLoading, setIsExternal, sendResetOtp, resetPasswordWithOtp } = useAuth();

    // Check for username and password / PIN in URL parameters
    useEffect(() => {
        useUserStore.getState().logout();
        const username = searchParams.get('username');
        const urlPassword = searchParams.get('password') || searchParams.get('pin');
        if (username && urlPassword) {
            const data = {
                identifier: username,
                email: username,
                pin: urlPassword,
                password: urlPassword,
            };
            login.mutate(data, {
                onSuccess: () => {
                    setIsExternal(true);
                    trackEvent('login', { method: 'url_params' });
                    navigate("/dashboard");
                }
            });
        }
    }, [searchParams]);

    const handlePinChange = (val: string, index: number) => {
        const digit = val.replace(/[^0-9]/g, '').slice(-1);
        const newPin = [...pin];
        newPin[index] = digit;
        setPin(newPin);

        if (digit && index < 5) {
            pinRefs.current[index + 1]?.focus();
        }
    };

    const handlePinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            if (!pin[index] && index > 0) {
                const newPin = [...pin];
                newPin[index - 1] = '';
                setPin(newPin);
                pinRefs.current[index - 1]?.focus();
            } else {
                const newPin = [...pin];
                newPin[index] = '';
                setPin(newPin);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            pinRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            pinRefs.current[index + 1]?.focus();
        } else if (e.key === 'Enter') {
            handleLogin();
        }
    };

    const handlePinPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
        if (!pastedData) return;

        const newPin = [...pin];
        for (let i = 0; i < 6; i++) {
            newPin[i] = pastedData[i] || '';
        }
        setPin(newPin);

        const focusIdx = Math.min(pastedData.length, 5);
        pinRefs.current[focusIdx]?.focus();
    };

    const handleLogin = async () => {
        const pinString = pin.join('');
        if (!userId.trim()) {
            toast.error("Please enter your Email, Phone Number, or User ID");
            return;
        }
        if (pinString.length < 4) {
            toast.error("Please enter your complete 6-Digit PIN");
            return;
        }

        setIsExternal(false);
        const data = {
            identifier: userId.trim(),
            email: userId.trim(),
            pin: pinString,
            password: pinString,
        };

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
            toast.error("Please enter both OTP and new PIN/Password");
            return;
        }
        resetPasswordWithOtp.mutate({ 
            phoneNumber: resetPhoneNumber, 
            otp: resetOtp, 
            newPassword 
        }, {
            onSuccess: () => {
                toast.success("PIN reset successfully. You can now login.");
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
    const passwordFromUrl = searchParams.get('password') || searchParams.get('pin');

    if (tokenFromUrl || (usernameFromUrl && passwordFromUrl)) {
        return <FullScreenLoader />;
    }

    return (
        <div 
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative p-4"
            style={{
                backgroundImage: 'url(/LoginPage.webp)',
            }}
        >
            {/* Luminous, clear and light emerald-gradient backdrop overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-black/30 to-black/50 backdrop-blur-[2px]"></div>

            {/* Back to website button */}
            <Link
                to="/"
                className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/60 hover:bg-black/80 text-white/90 hover:text-white border border-white/20 backdrop-blur-md text-xs font-semibold transition-all shadow-lg"
            >
                &larr; Back to Eiffel Lighting
            </Link>

            {/* Main Centered Frosted Glass Login Card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div
                    className="backdrop-blur-xl bg-white/20 p-8 sm:p-9 rounded-3xl shadow-2xl border border-white/30"
                    style={{
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                    }}
                >
                    {/* Header: Eiffel LED Lighting Logo & MIPS System */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="p-2.5 rounded-2xl bg-white/95 border border-white/50 shadow-xl mb-3 flex items-center justify-center">
                            <img
                                src="/assets/eiffel-logo.jpg"
                                alt="Eiffel Lighting"
                                className="h-12 w-auto object-contain rounded-lg"
                            />
                        </div>
                        <h1 className="font-extrabold tracking-widest text-2xl text-white drop-shadow-md">
                            M I P S
                        </h1>
                        <p className="text-[11px] text-emerald-300 font-bold tracking-wider uppercase mt-0.5 text-center drop-shadow-sm">
                            Manufacturing Inventory &amp; Planning System
                        </p>
                        <p className="text-[10px] text-white/80 font-medium tracking-wide">
                            Eiffel LED Lighting Pvt. Ltd.
                        </p>
                        <div className="w-full h-px bg-white/20 mt-4" />
                    </div>

                    {/* Welcome Subtitle */}
                    <div className="mb-5">
                        <h2 className="text-emerald-300 text-2xl font-bold mb-1 drop-shadow-sm">Welcome Back</h2>
                        <p className="text-xs text-white/80 drop-shadow-sm">Sign in to your manufacturing account</p>
                    </div>

                    {/* Email / Phone / User ID input */}
                    <div className="mb-4">
                        <label className="block text-xs font-medium text-white/90 mb-1.5 drop-shadow-sm">
                            Email / Phone / User ID
                        </label>
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="e.g. admin@gmail.com or 9876543210"
                            className="w-full px-4 py-3 bg-white/85 hover:bg-white/95 focus:bg-white border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-gray-900 placeholder:text-gray-500 font-medium text-sm shadow-sm"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    pinRefs.current[0]?.focus();
                                }
                            }}
                        />
                    </div>

                    {/* 6-Digit PIN Section */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-medium text-white/90 drop-shadow-sm">
                                6-Digit PIN
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPin(!showPin)}
                                className="flex items-center gap-1 text-[11px] text-white/80 hover:text-white transition-colors cursor-pointer"
                            >
                                {showPin ? <FiEyeOff size={13} /> : <FiEye size={13} />}
                                <span>{showPin ? "Hide PIN" : "Show PIN"}</span>
                            </button>
                        </div>

                        {/* 6 Individual PIN Input Boxes */}
                        <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                            {pin.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={(el) => {
                                        pinRefs.current[idx] = el;
                                    }}
                                    type={showPin ? "text" : "password"}
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handlePinChange(e.target.value, idx)}
                                    onKeyDown={(e) => handlePinKeyDown(e, idx)}
                                    onPaste={handlePinPaste}
                                    className="w-full h-12 sm:h-13 bg-white/85 hover:bg-white/95 focus:bg-white border border-white/50 rounded-xl text-center font-bold text-xl sm:text-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                                />
                            ))}
                        </div>

                        {/* Forgot PIN Link */}
                        <div className="mt-2 text-right">
                            <button
                                type="button"
                                onClick={() => setIsForgotPasswordOpen(true)}
                                className="text-[11px] text-white/80 hover:text-emerald-300 hover:underline transition-all font-medium cursor-pointer"
                            >
                                Forgot PIN?
                            </button>
                        </div>
                    </div>

                    {/* Login Button */}
                    <Button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-emerald-600/25 transition-all border border-emerald-500/20 cursor-pointer"
                    >
                        {isLoading && (
                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                        )}
                        {isLoading ? 'Authenticating…' : 'Login'}
                    </Button>
                </div>
            </div>

            {/* Forgot PIN / Password Dialog */}
            <Dialog open={isForgotPasswordOpen} onOpenChange={(open) => {
                setIsForgotPasswordOpen(open);
                if (!open) {
                    setOtpSent(false);
                    setResetPhoneNumber('');
                    setResetOtp('');
                    setNewPassword('');
                }
            }}>
                <DialogContent className="sm:max-w-md bg-slate-900/95 border border-white/20 text-white rounded-2xl backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="text-white text-lg">Reset PIN / Password</DialogTitle>
                        <DialogDescription className="text-gray-300 text-xs">
                            {otpSent 
                                ? "Enter the OTP sent to your WhatsApp and set a new 6-digit PIN." 
                                : "Enter your registered phone number to receive a reset OTP via WhatsApp."}
                        </DialogDescription>
                    </DialogHeader>
                    
                    {!otpSent ? (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-200">Registered Phone Number</label>
                                <input
                                    type="text"
                                    value={resetPhoneNumber}
                                    onChange={(e) => setResetPhoneNumber(e.target.value)}
                                    placeholder="e.g. 9876543210"
                                    className="w-full px-4 py-2.5 bg-white/95 text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSendOtp();
                                    }}
                                />
                            </div>
                            <Button 
                                onClick={handleSendOtp}
                                disabled={sendResetOtp.isPending || !resetPhoneNumber}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-2.5 font-semibold text-sm cursor-pointer"
                            >
                                {sendResetOtp.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                Send WhatsApp OTP
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-200">WhatsApp OTP</label>
                                <input
                                    type="text"
                                    value={resetOtp}
                                    onChange={(e) => setResetOtp(e.target.value)}
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full px-4 py-2.5 bg-white/95 text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-200">New 6-Digit PIN</label>
                                <input
                                    type="password"
                                    maxLength={6}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="e.g. 123456"
                                    className="w-full px-4 py-2.5 bg-white/95 text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium font-mono"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleResetPassword();
                                    }}
                                />
                            </div>
                            <Button 
                                onClick={handleResetPassword}
                                disabled={resetPasswordWithOtp.isPending || !resetOtp || !newPassword}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-2.5 font-semibold text-sm cursor-pointer"
                            >
                                {resetPasswordWithOtp.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                Update PIN
                            </Button>
                            <div className="text-center">
                                <button 
                                    type="button" 
                                    onClick={() => setOtpSent(false)}
                                    className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
                                >
                                    Change phone number
                                </button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LoginPage;
