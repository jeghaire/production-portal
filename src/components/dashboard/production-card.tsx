import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ReactNode } from "react";

interface ProductionCardProps {
  title: string;
  badgeValue: string | number;
  description: string;
  quantity: number;
  percentOfTarget: number;
  progressValue: number;
  unit?: string;
  badgeIcon?: ReactNode;
  footer?: ReactNode;
}

export function ProductionCard({
  title,
  badgeValue,
  description,
  quantity,
  percentOfTarget,
  progressValue,
  unit = "bbl",
  badgeIcon,
  footer,
}: ProductionCardProps) {
  const targetValue = (quantity * (100 / percentOfTarget)).toFixed(2);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Badge
            variant="outline"
            className="text-xs font-mono border-transparent bg-muted text-muted-foreground dark:border-muted dark:bg-muted dark:text-muted-foreground"
          >
            {badgeIcon}
            <span className="tracking-wider">{badgeValue}</span>
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <p className="font-bold text-3xl @7xl:text-4xl">
          {quantity.toLocaleString()}
          <span className="ml-1 text-base font-normal text-foreground">
            {unit}
          </span>
        </p>
        <p className="mt-5 flex items-center justify-between text-muted-foreground text-xs">
          <span className="truncate">{`${percentOfTarget}% of target`}</span>
          <span className="text-nowrap">{targetValue}</span>
        </p>
        <Progress value={progressValue} className="mt-1 h-1.5" />
      </CardContent>

      {footer && (
        <CardFooter className="flex flex-col items-start">{footer}</CardFooter>
      )}
    </Card>
  );
}
