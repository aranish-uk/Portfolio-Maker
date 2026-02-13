"use client";

import { useState } from "react";
import { TestimonialModal } from "@/components/testimonial-modal";

export function DashboardTestimonialButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
                Leave a Review
            </button>

            {isOpen && <TestimonialModal onClose={() => setIsOpen(false)} />}
        </>
    );
}
