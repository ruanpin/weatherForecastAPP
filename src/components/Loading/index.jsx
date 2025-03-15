import { Loader2 } from 'lucide-react';
export default function Loading() {
    return (
        <div className="flex items-center justify-center h-[40px]">
            <Loader2 className="w-9 h-9 animate-spin text-gray-300" />
            <span className="pl-2 text-[1rem] text-gray-500"></span>
        </div>
    );
}