export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-muted animate-pulse rounded" />
            <div>
              <div className="h-5 w-24 bg-muted animate-pulse rounded mb-1" />
              <div className="h-3 w-48 bg-muted animate-pulse rounded" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-28 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Profile Settings Loading */}
        <div className="bg-card p-6 rounded-lg border">
          <div className="h-6 w-40 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-10 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings Loading */}
        <div className="bg-card p-6 rounded-lg border">
          <div className="h-6 w-48 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-56 bg-muted animate-pulse rounded mb-4" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 bg-muted animate-pulse rounded" />
                  <div>
                    <div className="h-4 w-32 bg-muted animate-pulse rounded mb-1" />
                    <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                  </div>
                </div>
                <div className="h-8 w-20 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Other sections loading */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card p-6 rounded-lg border">
            <div className="h-6 w-36 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-52 bg-muted animate-pulse rounded mb-4" />
            <div className="space-y-3">
              {[...Array(2)].map((_, j) => (
                <div key={j} className="h-12 bg-muted/30 animate-pulse rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
