export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="animate-pulse space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="h-4 bg-muted rounded w-96"></div>
          </div>
          <div className="h-10 bg-muted rounded w-32"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-48 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
          <div className="space-y-6">
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-48 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
