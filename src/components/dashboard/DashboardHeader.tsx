import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  onLogout: () => void;
  icon?: React.ReactNode;
  userInitials?: string;
}

export function DashboardHeader({ title, subtitle, onLogout, icon, userInitials }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-border pb-6">
      <div className="flex items-center gap-3">
        {userInitials && (
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            {userInitials}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            {icon}
            {title}
          </h1>
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        </div>
      </div>
      <Button onClick={onLogout} variant="outline" className="shrink-0 border-destructive text-destructive hover:bg-destructive/10">
        Log out
      </Button>
    </div>
  );
}
