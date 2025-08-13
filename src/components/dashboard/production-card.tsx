import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ReactNode } from "react";

interface ProductionCardProps {
  title: string;
  description: string;
  actual: number;
  target: number;
  unit?: string;
  footer?: ReactNode;
  hideProgress?: boolean;
  // badgeIcon?: ReactNode;
  // badgeValue: string | number;
}

export function ProductionCard({
  title,
  description,
  actual = 0,
  target = 0,
  unit = "bbl",
  footer,
  hideProgress = false,
}: ProductionCardProps) {
  const actualToTargetPercentage = (actual / target) * 100;

  return (
    <Card>
      <CardHeader className="gap-0">
        <div className="flex items-end justify-between">
          <CardTitle>{title}</CardTitle>
          {/* <Badge
            variant="outline"
            className="text-xs font-mono border-transparent bg-muted text-muted-foreground dark:border-muted dark:bg-muted dark:text-muted-foreground"
          >
            {badgeIcon}
            <span className="tracking-wider">{badgeValue}</span>
          </Badge> */}
        </div>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <p className="font-semibold text-3xl">
          {Number.isInteger(actual)
            ? actual.toLocaleString()
            : Number(actual.toFixed(2)).toLocaleString()}
          <span className="font-mono ml-1 text-base tracking-tighter font-normal text-muted-foreground">
            {unit}
          </span>
        </p>
        {!hideProgress && (
          <>
            <p className="font-mono mt-5 flex items-center justify-between text-muted-foreground text-xs">
              <span className="truncate">{`${actualToTargetPercentage.toFixed(1)}% of target`}</span>
              <span className="text-nowrap">
                {Number.isInteger(target)
                  ? target.toLocaleString()
                  : Number(target.toFixed(2)).toLocaleString()}
              </span>
            </p>
            <Progress
              value={Math.max(0, Math.min(100, actualToTargetPercentage))}
              className="mt-1 h-1.5"
            />
          </>
        )}
      </CardContent>

      {footer && (
        <CardFooter className="flex flex-col items-start">{footer}</CardFooter>
      )}
    </Card>
  );
}
