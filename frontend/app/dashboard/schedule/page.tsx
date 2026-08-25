import { ScheduleManager } from "@/components/work-schedule/schedule-manager"
import { AuthGuard } from "@/components/auth-guard"
import { ErrorBoundary } from "@/components/error-boundary"

export default function SchedulePage() {
  return (
    <AuthGuard>
      <ErrorBoundary>
        <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <ScheduleManager />
          </div>
        </div>
      </ErrorBoundary>
    </AuthGuard>
  )
}
