import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-silver/60 gap-4 animate-in fade-in duration-500">
      <Loader2 className="h-8 w-8 animate-spin text-white" />
      <p className="text-xs uppercase tracking-widest font-semibold">Loading Module...</p>
    </div>
  );
}
