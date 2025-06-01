export default function BubbleOpponent({ message, time }: { message: string; time: string }) {
    return (
        <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm bg-white text-slate-800 rounded-bl-sm border border-slate-200 whitespace-pre-line">
                <p className="text-sm">{message}</p>
                <div className="flex items-center justify-end mt-1 space-x-1 text-slate-500">
                    <span className="text-xs">{time}</span>
                </div>
            </div>
        </div>
    );
}
