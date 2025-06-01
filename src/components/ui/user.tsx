'use client';

import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Channel, LocalMessage, UserResponse } from 'stream-chat';
import Avatar from './avatar';
import { EllipsisVertical, Trash } from 'lucide-react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

type DataChannel = {
    latestMessage: LocalMessage | undefined;
    record: {
        last_read: Date;
        unread_messages: number;
        user: UserResponse;
        first_unread_message_id?: string;
        last_read_message_id?: string;
    };
};

export default function User({
    channel,
    onClick,
    currentChannelId,
    setChannel,
    deleteChannel,
}: {
    channel: Channel;
    currentChannelId?: string;
    setChannel: (chan: Channel | undefined) => void;
    onClick: (channel: Channel) => void;
    deleteChannel: (channel: Channel) => void;
}) {
    const { name } = useParams();
    const [dataChannel, setDataChannel] = useState<DataChannel>();
    const [opponent, setOpponent] = useState<UserResponse>();

    useEffect(() => {
        channel.watch({ presence: true }).then(() => {
            getDataChannel();
            getUser();
        });

        channel.on('channel.deleted', () => {
            if (currentChannelId == channel.id) setChannel(undefined);
        });
        channel.on('user.updated', getUser);
        channel.on('message.read', getDataChannel);
        channel.on('message.new', getDataChannel);
        channel.on('user.watching.start', getUser);
        channel.on('user.watching.stop', getUser);

        return () => {
            channel.off('channel.deleted', () => {
                if (currentChannelId == channel.id) setChannel(undefined);
            });
            channel.off('user.updated', getUser);
            channel.off('message.read', getDataChannel);
            channel.off('message.new', getDataChannel);
            channel.off('user.watching.start', getUser);
            channel.off('user.watching.stop', getUser);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channel]);

    const getDataChannel = () => {
        const data: DataChannel = {
            latestMessage: channel.lastMessage(),
            record: channel.state.read[name!.toString()],
        };

        setDataChannel(data);
    };
    const getUser = () => {
        const members = Object.values(channel.state.members);
        setOpponent(members.find((m) => m.user_id !== name!.toString())?.user);
    };

    return (
        <div
            className={`flex gap-2 py-4 px-2 border-b border-slate-100 transition-all duration-200 hover:bg-emerald-50 hover:border-l-emerald-500 ${
                currentChannelId == channel.id
                    ? 'bg-emerald-50 border-l-emerald-500'
                    : 'bg-slate-50'
            } border-l-4`}
        >
            <div onClick={() => onClick(channel)} className="flex-1">
                <div className="flex items-center">
                    <div className="flex-1 flex gap-2 items-center">
                        <div className="relative">
                            <Avatar image={opponent?.image} name={opponent?.name ?? ''} />
                            <div
                                className={`absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white ${
                                    !opponent?.online ? 'hidden' : ''
                                }`}
                            ></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h3 className="w-40 font-semibold text-slate-900 truncate">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>{opponent?.name}</TooltipTrigger>
                                            <TooltipContent>{opponent?.name}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </h3>

                                <span className="text-xs text-slate-500">
                                    {dayjs(dataChannel?.latestMessage?.created_at).format('H:mm')}
                                </span>
                            </div>
                            <p className="w-40 text-sm text-slate-600 truncate mt-1">
                                {dataChannel?.latestMessage?.text}
                            </p>
                        </div>
                        {dataChannel?.record.unread_messages ? (
                            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-medium">
                                    {dataChannel?.record.unread_messages}
                                </span>
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </div>
            <Popover>
                <PopoverTrigger>
                    <EllipsisVertical size={13} className="cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent>
                    <div>
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => deleteChannel(channel)}
                        >
                            Delete <Trash className="text-red-500" />
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
