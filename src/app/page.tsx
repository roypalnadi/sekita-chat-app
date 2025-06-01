'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, Shield, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Landing = () => {
    const navigate = useRouter();

    const handleGetStarted = () => {
        navigate.push('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="flex items-center justify-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
                        Sekita Chat App
                        <span className="block text-emerald-600">Easy & Safe</span>
                    </h1>

                    <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                        Stay connected with friends, family, and colleagues on a chat platform built
                        for simplicity and safety. Start chatting today!
                    </p>

                    <Button
                        onClick={handleGetStarted}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
                    >
                        Chat Now !
                    </Button>
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
                    Why Choose Our Chat App?
                </h2>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Easy to Use</h3>
                        <p className="text-slate-600">
                            An intuitive and user-friendly interface makes chatting more enjoyable
                        </p>
                    </div>

                    <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            Secure & Private
                        </h3>
                        <p className="text-slate-600">
                            Your data security and chat privacy are our top priorities
                        </p>
                    </div>

                    <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Zap className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            Fast & Responsive
                        </h3>
                        <p className="text-slate-600">
                            Real-time message delivery and responsive performance across all devices
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
                    <p className="text-xl text-emerald-100 mb-8">
                        Join thousands of users who already trust our chat app
                    </p>
                    <Button
                        onClick={handleGetStarted}
                        className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
                    >
                        Sign Up for Free Now !
                    </Button>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mr-2">
                            <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-semibold">Sekita Chat App</span>
                    </div>
                    <p className="text-slate-400">© 2025 Sekita Chat App. Semua hak dilindungi.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
