export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row gap-8 animate-pulse">
        {/* Sidebar Skeleton */}
        <aside className="w-full md:w-64 h-[600px] rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            {/* User Profile Header Skeleton */}
            <div className="space-y-3 pb-4 border-b border-white/5">
              <div className="w-12 h-12 rounded-full bg-white/5" />
              <div className="h-4 w-32 bg-white/5 rounded" />
              <div className="h-3 w-40 bg-white/5 rounded" />
            </div>

            {/* Nav Links Skeleton */}
            <div className="space-y-2">
              <div className="h-10 rounded-xl bg-white/5" />
              <div className="h-10 rounded-xl bg-white/5" />
              <div className="h-10 rounded-xl bg-white/5" />
              <div className="h-10 rounded-xl bg-white/5" />
            </div>
          </div>

          {/* Logout Skeleton */}
          <div className="pt-4 border-t border-white/5">
            <div className="h-10 rounded-xl bg-white/5" />
          </div>
        </aside>

        {/* Main Content Area Skeleton */}
        <main className="flex-1 space-y-6">
          {/* Header Skeleton Card */}
          <div className="h-32 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl p-6 flex flex-col justify-center space-y-3">
            <div className="h-6 w-48 bg-white/5 rounded" />
            <div className="h-4 w-72 bg-white/5 rounded" />
          </div>

          {/* Grid of Skeleton Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-32 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl p-6 flex flex-col justify-between">
              <div className="h-3 w-24 bg-white/5 rounded" />
              <div className="h-8 w-20 bg-white/5 rounded" />
            </div>
            <div className="h-32 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl p-6 flex flex-col justify-between">
              <div className="h-3 w-24 bg-white/5 rounded" />
              <div className="h-8 w-32 bg-white/5 rounded" />
            </div>
          </div>

          {/* Large Section Skeleton */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl p-6 md:p-8 space-y-4 min-h-[300px]">
            <div className="h-5 w-36 bg-white/5 rounded mb-6" />
            <div className="h-16 rounded-xl bg-white/5" />
            <div className="h-16 rounded-xl bg-white/5" />
            <div className="h-16 rounded-xl bg-white/5" />
          </div>
        </main>
      </div>
    </div>
  );
}
