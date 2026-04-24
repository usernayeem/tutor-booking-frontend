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
    card: "bg-blue-50 border-blue-100",
    title: "text-blue-900",
    value: "text-blue-600",
    desc: "text-blue-600",
  },
  green: {
    card: "bg-green-50 border-green-100",
    title: "text-green-900",
    value: "text-green-600",
    desc: "text-green-600",
  },
  purple: {
    card: "bg-purple-50 border-purple-100",
    title: "text-purple-900",
    value: "text-purple-600",
    desc: "text-purple-600",
  },
  indigo: {
    card: "bg-indigo-50 border-indigo-100",
    title: "text-indigo-900",
    value: "text-indigo-600",
    desc: "text-indigo-600",
  },
  default: {
    card: "bg-white border-gray-200",
    title: "text-gray-600",
    value: "text-gray-900",
    desc: "text-gray-500",
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
