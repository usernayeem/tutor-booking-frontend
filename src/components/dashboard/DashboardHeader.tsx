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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-200 pb-6">
      <div className="flex items-center gap-3">
        {userInitials && (
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {userInitials}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            {icon}
            {title}
          </h1>
          <p className="text-gray-600 mt-1">{subtitle}</p>
        </div>
      </div>
      <Button onClick={onLogout} variant="outline" className="border-gray-300 shrink-0">
        Log out
      </Button>
    </div>
  );
}
