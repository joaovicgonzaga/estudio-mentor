
import { Bell } from "lucide-react";

interface ReviewAlertProps {
  subject: string;
  daysUntilReview: number;
}

export const ReviewAlert = ({ subject, daysUntilReview }: ReviewAlertProps) => {
  const isUrgent = daysUntilReview <= 2;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border p-4",
        isUrgent
          ? "border-warning bg-warning/10"
          : "border-muted bg-muted/10"
      )}
    >
      <div className="flex items-center gap-3">
        <Bell
          className={cn(
            "h-5 w-5",
            isUrgent ? "text-warning" : "text-muted-foreground"
          )}
        />
        <div>
          <h4 className="font-medium text-gray-900">{subject}</h4>
          <p className="text-sm text-muted-foreground">
            {daysUntilReview === 0
              ? "Revisão pendente hoje"
              : daysUntilReview === 1
              ? "Revisão amanhã"
              : `Revisão em ${daysUntilReview} dias`}
          </p>
        </div>
      </div>
    </div>
  );
};
