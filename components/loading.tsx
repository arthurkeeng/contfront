export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto p-6 animate-pulse space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-6 w-48 bg-muted rounded-md"></div>
          <div className="h-4 w-80 bg-muted rounded-md"></div>
        </div>
        <div className="h-10 w-28 bg-muted rounded-md"></div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured image */}
          <div className="h-72 bg-muted rounded-xl"></div>

          {/* Card-like skeletons */}
          <div className="space-y-4">
            <div className="h-20 bg-muted rounded-lg"></div>
            <div className="h-20 bg-muted rounded-lg"></div>
            <div className="h-20 bg-muted rounded-lg"></div>
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-6">
          <div className="h-48 bg-muted rounded-lg"></div>
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-32 bg-muted rounded-lg"></div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex space-x-4 pt-6">
        <div className="h-10 w-24 bg-muted rounded-md"></div>
        <div className="h-10 w-24 bg-muted rounded-md"></div>
      </div>
    </div>
  )
}
