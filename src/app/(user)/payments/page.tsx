import Content from "@/components/layout/content-sticky/Content";
import Sticky from "@/components/layout/content-sticky/Sticky";

export default function PaymentPage() {
    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <div className="flex flex-col bg-[#F9FAFB] rounded-xl overflow-hidden border border-[#D1D5DB] hover:shadow-lg transition-shadow duration-200">
                <Content />
            </div>
            <div className="w-72 shrink-0 sticky top-4">
                <Sticky />
            </div>
        </div>
    );
}