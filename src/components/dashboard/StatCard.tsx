import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

type ColorTheme = "blue" | "green" | "purple" | "indigo" | "default";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  theme?: ColorTheme;
}

const themeStyles: Record<ColorTheme, { card: string; title: string; value: string; desc: string }> = {
  blue: {
    card: "bg-blue-500/10 border-blue-500/20",
    title: "text-blue-600 dark:text-blue-400",
    value: "text-blue-700 dark:text-blue-300",
    desc: "text-blue-600/80 dark:text-blue-400/80",
  },
  green: {
    card: "bg-emerald-500/10 border-emerald-500/20",
    title: "text-emerald-600 dark:text-emerald-400",
    value: "text-emerald-700 dark:text-emerald-300",
    desc: "text-emerald-600/80 dark:text-emerald-400/80",
  },
  purple: {
    card: "bg-purple-500/10 border-purple-500/20",
    title: "text-purple-600 dark:text-purple-400",
    value: "text-purple-700 dark:text-purple-300",
    desc: "text-purple-600/80 dark:text-purple-400/80",
  },
  indigo: {
    card: "bg-indigo-500/10 border-indigo-500/20",
    title: "text-indigo-600 dark:text-indigo-400",
    value: "text-indigo-700 dark:text-indigo-300",
    desc: "text-indigo-600/80 dark:text-indigo-400/80",
  },
  default: {
    card: "bg-card border-border",
    title: "text-muted-foreground",
    value: "text-foreground",
    desc: "text-muted-foreground",
  },
};

export function StatCard({ title, value, description, icon, theme = "default" }: StatCardProps) {
  const styles = themeStyles[theme];

  return (
    <Card className={`${styles.card} shadow-sm`}>
      <CardHeader className="pb-2">
        <CardTitle className={`${styles.title} text-sm font-medium flex items-center justify-between`}>
          {title}
          {icon}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-bold ${styles.value}`}>{value}</p>
        <p className={`text-sm ${styles.desc} mt-1`}>{description}</p>
      </CardContent>
    </Card>
  );
}
