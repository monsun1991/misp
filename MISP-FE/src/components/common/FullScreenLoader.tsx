import { LoaderCircle } from "lucide-react";
import { createPortal } from "react-dom";

export default function FullScreenLoader() {
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <LoaderCircle
                className="animate-spin text-[#085963]"
                size={60}
                strokeWidth={2}
            />
        </div>,
        document.body
    );
}
