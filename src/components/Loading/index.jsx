import { Loader2 } from 'lucide-react';
export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-12 h-12 animate-spin text-black" />
            <span className="pl-2 text-[1.5rem]">Loading...</span>
        </div>
    );
}