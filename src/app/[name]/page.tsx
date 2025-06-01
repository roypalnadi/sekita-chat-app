'use client';

import ChatRoom from '@/components/chat-room';
import { Button } from '@/components/ui/button';
import User from '@/components/ui/user';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { toast } from 'sonner';
import { Channel, StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import { RiChatNewLine, RiLogoutBoxLine } from 'react-icons/ri';
import DialogAddChannel from '@/components/dialog-add-channel';
import { useAuth } from '@/lib/authContext';
import { User as FirebaseUser, getAuth, signOut } from 'firebase/auth';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EllipsisVertical } from 'lucide-react';

const chatClient = StreamChat.getInstance(process.env.NEXT_PUBLIC_GETSTREAM_KEY!);

export default function Home() {
    const { name } = useParams();
    const [chat, setChat] = useState<StreamChat>();
    const [channels, setChannels] = useState<Channel[]>([]);
    const inputRef = useRef('');
    const [chann, setChann] = useState<Channel>();
    const [open, setOpen] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const handleToken = useCallback(async (user: FirebaseUser) => {
        const res = await fetch('/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: name,
            }),
        });
        const { token } = await res.json();
        await chatClient.connectUser(
            {
                id: name!.toString() ?? '',
                name: user.displayName ?? name!.toString(),
                image: user.photoURL ?? undefined,
            },
            token
        );

        chatClient.on('notification.added_to_channel', handleChannels);
        chatClient.on('channel.deleted', handleChannels);
        chatClient.on('message.new', handleChannels);

        setChat(chatClient);
        handleChannels();
        return () => {
            chatClient.off('notification.added_to_channel', handleChannels);
            chatClient.off('message.new', handleChannels);
            chatClient.off('channel.deleted', handleChannels);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const buttonUser = (channel: Channel) => {
        setChann(channel);
    };

    const handleChannels = async () => {
        let channels = await chatClient.queryChannels(
            {
                type: 'messaging',
                members: { $in: [name!.toString()] },
            },
            { last_message_at: -1 }, // urutkan berdasarkan pesan terakhir
            { watch: true, state: true }
        );

        if (inputRef.current != '') {
            channels = channels.filter((channel) => {
                const opponent = Object.values(channel.state.members).find(
                    (m) => m.user?.id !== name!.toString()
                )?.user;

                if (!opponent) return false;

                return opponent.name?.toLowerCase().includes(inputRef.current.toLowerCase());
            });
        }

        setChannels([...channels]);
    };

    const createChannel = async (opponent: string) => {
        try {
            const id = name!.toString();
            const chn = chat?.channel('messaging', id + opponent, {
                members: [id, opponent],
            });

            await chn?.create();

            setChann(chn);
            setOpen(false);
            toast('New Chat Has Been Added');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast('Make Sure User Code Is Valid');
        }
    };

    const deleteChannel = (channel: Channel) => {
        setChann(undefined);
        channel?.delete();
        toast('Chat has been deleted successfully.');
    };

    const logout = async () => {
        try {
            await signOut(getAuth());
            toast('Logout success');
            router.replace('/login');
        } catch (e) {
            console.log(e);
            toast('Something wrong');
        }
    };

    useEffect(() => {
        if (!user) return;
        handleToken(user);
    }, [handleToken, user]);

    if (!chat) return '';

    return (
        <Chat client={chat}>
            <DialogAddChannel createChannel={createChannel} open={open} setOpen={setOpen} />
            <div className="h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex">
                <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
                    <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-emerald-600 to-teal-600">
                        <div className="flex justify-between items-center mb-3">
                            <div>
                                <h1 className="text-xl font-semibold text-white">Sekita App</h1>
                                <p className="text-xs font-semibold text-white">UID: {name}</p>
                            </div>
                            <Popover>
                                <PopoverTrigger>
                                    <EllipsisVertical
                                        size={18}
                                        className="cursor-pointer text-white"
                                    />
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            size={'sm'}
                                            onClick={() => setOpen(true)}
                                        >
                                            <RiChatNewLine />
                                            New Chat
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="w-full"
                                            size={'sm'}
                                            onClick={logout}
                                        >
                                            <RiLogoutBoxLine />
                                            Logout
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 flex items-center pl-3 text-gray-400">
                                <FaMagnifyingGlass />
                            </div>
                            <input
                                onChange={(e) => {
                                    inputRef.current = e.target.value;
                                    handleChannels();
                                }}
                                type="text"
                                placeholder="Search contact..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        {channels.map((e, i) => {
                            return (
                                <User
                                    key={i}
                                    channel={e}
                                    setChannel={setChann}
                                    onClick={buttonUser}
                                    deleteChannel={deleteChannel}
                                    currentChannelId={chann?.id}
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="flex-1 flex flex-col bg-slate-50">
                    {chann && chann.initialized ? (
                        <ChatRoom channel={chann} />
                    ) : (
                        <div className="flex-1 flex flex-col h-100 justify-center items-center">
                            <h2 className="text-xl font-semibold text-slate-700 mb-2">
                                Welcome to Sekita Chat
                            </h2>
                            <p className="text-slate-500">Select a contact to start</p>
                        </div>
                    )}
                </div>
            </div>
        </Chat>
    );
}
