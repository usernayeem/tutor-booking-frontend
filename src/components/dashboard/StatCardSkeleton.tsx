import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatCardSkeleton() {
  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-9 w-16 mb-1" />
        <Skeleton className="h-4 w-32" />
      </CardContent>
    </Card>
  );
}
