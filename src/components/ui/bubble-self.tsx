export default function BubbleSelf({ message, time }: { message: string; time: string }) {
    return (
        <div className="flex justify-end">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-sm whitespace-pre-line">
                <p className="text-sm">{message}</p>
                <div className="flex items-center justify-end mt-1 space-x-1 text-emerald-100">
                    <span className="text-xs">{time}</span>
                </div>
            </div>
        </div>
    );
}
