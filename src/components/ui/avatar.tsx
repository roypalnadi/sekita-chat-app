import Image from 'next/image';
import { useState } from 'react';

export default function Avatar({ name = '', image }: { name: string; image?: string }) {
    const [imgError, setImgError] = useState(false);

    const initials = name
        .split(' ')
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase();

    return (
        <div className="w-12 h-12 rounded-full relative overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-lg">
            {!image || !imgError ? (
                <Image
                    src={image ?? ''}
                    alt={name}
                    layout="fill"
                    objectFit="cover"
                    onError={() => setImgError(true)}
                    loading="lazy"
                    decoding="async"
                />
            ) : (
                initials
            )}
        </div>
    );
}
