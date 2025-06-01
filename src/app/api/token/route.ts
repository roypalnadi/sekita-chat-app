import { NextRequest } from 'next/server';
import { StreamChat } from 'stream-chat';

export async function POST(request: NextRequest) {
    const { id } = await request.json();
    const serverClient = StreamChat.getInstance(
        process.env.NEXT_PUBLIC_GETSTREAM_KEY!,
        process.env.GETSTREAM_SECRET!
    );

    const token = serverClient.createToken(id);
    return Response.json({ token });
}
