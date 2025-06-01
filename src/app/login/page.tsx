'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import GithubIcon from '@/components/icons/github-icon';
import GoogleIcon from '@/components/icons/google-icon';
import {
    AuthProvider,
    createUserWithEmailAndPassword,
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
} from 'firebase/auth';
import { auth } from '@/utils/firebase';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

const loginSchema = z.object({
    type: z.literal(true),
    email: z.string().email('email must valid input').nonempty('Email is required'),
    password: z.string().nonempty('Password is required'),
});

const signupSchema = z.object({
    type: z.literal(false),
    email: z.string().email('email must valid input').nonempty('Email is required'),
    password: z.string().nonempty('Password is required'),
    nickname: z.string().nonempty('Nickname is required'),
});

const formSchema = z.discriminatedUnion('type', [loginSchema, signupSchema]);

type LoginData = z.infer<typeof formSchema>;

type provider = 'google' | 'github' | 'email';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoadingEmail, setIsLoadingEmail] = useState(false);
    const [isLoadingGithub, setIsLoadingGithub] = useState(false);
    const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (user) router.push('/' + user.uid);
    }, [user, router]);

    const handleLoading = (provider: provider, value: boolean) => {
        switch (provider) {
            case 'github':
                setIsLoadingGithub(value);
                break;

            case 'google':
                setIsLoadingGoogle(value);
                break;

            default:
                setIsLoadingEmail(value);
                break;
        }
    };

    const handleProviderLogin = async (provider: provider) => {
        handleLoading(provider, true);
        let authProvider: AuthProvider;
        switch (provider) {
            case 'github':
                authProvider = new GithubAuthProvider();
                break;

            default:
                authProvider = new GoogleAuthProvider();
                break;
        }

        try {
            const result = await signInWithPopup(auth, authProvider);
            const user = result.user;
            toast('Login Success', { description: `Welcome ${user.displayName ?? user.email}` });
            // redirect atau simpan user info
            router.push('/' + user.uid);
        } catch (error) {
            toast('Login Failed', { description: 'Something is not correct' });
            console.log(error);
        } finally {
            handleLoading(provider, false);
        }
    };

    const form = useForm<LoginData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: isLogin,
            email: '',
            password: '',
            nickname: '',
        },
    });

    const onSubmit = (values: LoginData) => {
        if (isLogin) {
            login(values);
        } else {
            signup(values);
        }
    };

    const login = async (values: LoginData) => {
        handleLoading('email', true);
        try {
            const result = await signInWithEmailAndPassword(auth, values.email, values.password);
            const user = result.user;
            toast('Login Success', { description: `Welcome ${user.displayName}` });
            // redirect atau simpan user info
            router.push('/' + user.uid);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast('Login Failed', { description: 'Something is not correct' });
        } finally {
            handleLoading('email', false);
        }
    };

    const signup = async (values: LoginData) => {
        const signup = values as z.infer<typeof signupSchema>;
        handleLoading('email', true);
        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                signup.email,
                signup.password
            );
            const user = result.user;
            updateProfile(user, { displayName: signup.nickname });
            toast('Login Success', { description: `Welcome ${user.displayName}` });
            // redirect atau simpan user info
            router.push('/' + user.uid);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast('Login Failed', { description: 'Something is not correct' });
        } finally {
            handleLoading('email', false);
        }
    };

    useEffect(() => {
        form.setValue('type', isLogin);
    }, [form, isLogin]);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        {/* <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div> */}
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">
                        {isLogin ? 'Sign in' : 'Sign up'}
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                        {isLogin
                            ? 'Please log in to your account to continue using the chat'
                            : 'Sign up for continue using the chat'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <Button
                                disabled={isLoadingGoogle}
                                variant={'outline'}
                                onClick={() => handleProviderLogin('google')}
                                // className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                            >
                                <GoogleIcon />
                                Google
                            </Button>
                            <Button
                                disabled={isLoadingGithub}
                                variant={'outline'}
                                onClick={() => handleProviderLogin('github')}
                                // className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                            >
                                <GithubIcon />
                                Github
                            </Button>
                        </div>
                        <div className="flex justify-center items-center">
                            <div className="border-t-[1px] border-gray-200 flex-1"></div>
                            <span className="text-xs font-semibold text-gray-400 px-2">or</span>
                            <div className="border-t-[1px] border-gray-200 flex-1"></div>
                        </div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {!isLogin ? (
                                    <FormField
                                        control={form.control}
                                        name="nickname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nickname</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Input nickname"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ) : (
                                    ''
                                )}

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="email@email.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="Input password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    disabled={isLoadingEmail}
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                                >
                                    {isLogin ? 'Sign in' : 'Sign up'}
                                </Button>
                            </form>
                        </Form>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            {isLogin ? 'Don’t have an account yet?' : 'Already have an account?'}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                                {isLogin ? 'Sign up now' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
