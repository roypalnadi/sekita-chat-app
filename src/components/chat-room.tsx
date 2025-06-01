'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoCallOutline, IoVideocamOutline } from 'react-icons/io5';
import { Channel, UserResponse } from 'stream-chat';
import { Channel as ChannelReact, MessageInput, MessageList } from 'stream-chat-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Avatar from './ui/avatar';
dayjs.extend(relativeTime);

export default function ChatRoom({ channel }: { channel?: Channel }) {
    const { name } = useParams();
    const [chanComplete, setChanComplete] = useState(false);
    const [user, setUser] = useState<UserResponse>();

    useEffect(() => {
        channel?.watch({ presence: true }).then(() => {
            setChanComplete(true);
            updateUser();
        });

        const updateUser = () => {
            const members = Object.values(channel?.state.members ?? []);
            const opponent = members.find((m) => m.user_id !== name!.toString());
            setUser(opponent?.user);
        };

        // listen to member updates
        channel?.on('user.watching.start', updateUser);
        channel?.on('user.watching.stop', updateUser);
        channel?.on('user.updated', updateUser);

        return () => {
            channel?.off('user.watching.start', updateUser);
            channel?.off('user.watching.stop', updateUser);
            channel?.off('user.updated', updateUser);
        };
    }, [channel, name]);

    const lastSeen = user?.last_active;
    const lastSeenText = lastSeen ? dayjs(lastSeen).fromNow() : 'Unknown';

    return (
        <>
            {chanComplete ? (
                <ChannelReact channel={channel}>
                    <div className="flex-1 flex flex-col">
                        <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <Avatar image={user?.image} name={user?.name ?? ''} />
                                    <div
                                        className={`absolute -bottom-1 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white ${
                                            !user?.online ? 'hidden' : ''
                                        }`}
                                    ></div>
                                </div>
                                <div>
                                    <h2 className="font-semibold text-slate-900">{user?.name}</h2>
                                    <p className="text-sm text-slate-500">
                                        {user?.online ? 'Online' : lastSeenText}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                                    <IoVideocamOutline size={20} />
                                </button>
                                <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                                    <IoCallOutline size={20} />
                                </button>
                            </div>
                        </div>
                        <MessageList />
                        <div className="bg-white border-t border-slate-200 p-4">
                            <MessageInput />
                        </div>
                    </div>
                </ChannelReact>
            ) : (
                ''
            )}
        </>
    );
}
