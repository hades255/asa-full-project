import { appColors } from "@/theme";

export const STATUS_TEXT: { [key: string]: any } = {
  COMPLETED: "Completed",
  CONFIRMED: "Confirmed",
  PENDING: "Pending",
  CANCELLED: "Cancelled",
  IN_PROGRESS: "In Progress",
};

export const STATUS_COLOR: { [key: string]: any } = {
  COMPLETED: appColors.core.positive,
  CONFIRMED: appColors.core.positive,
  PENDING: appColors.core.warning,
  CANCELLED: appColors.core.negative,
  IN_PROGRESS: appColors.core.warning,
};
