import { appColors } from "@/theme";
import moment from "moment";
import Snackbar from "react-native-snackbar";
import { envConfig } from "./envConfig";
import { faker } from "@faker-js/faker";

export const showSnackbar = (
  message: string,
  type?: "success" | "error" | "warning"
) => {
  Snackbar.show({
    text: message,
    textColor: appColors.semantic.content.contentInversePrimary,
    backgroundColor:
      type == "error"
        ? appColors.semanticExtensions.content.contentNegative
        : type == "warning"
        ? appColors.semanticExtensions.content.contentWarning
        : appColors.semanticExtensions.content.contentPositive,
    fontFamily: "Poppins-Medium",
    duration: Snackbar.LENGTH_LONG,
  });
};

export const showClerkError = (error: any) => {
  Snackbar.show({
    text: error.clerkError
      ? error.errors[0].message
      : "Something went wrong. Please try again.",
    textColor: appColors.semantic.content.contentInversePrimary,
    backgroundColor: appColors.semanticExtensions.content.contentNegative,
    fontFamily: "Poppins-Medium",
    duration: Snackbar.LENGTH_LONG,
  });
};

export const formatDate = (date: string) => {
  return moment(date).format("DD/MM/YYYY HH:mm");
};

export const formatDateWithoutTime = (date: string) => {
  return moment(date).format("DD/MM/YYYY");
};

export const formatTime = (time: string) => {
  return moment(time).format("HH:mm");
};

export const calculateAverageRating = (
  oneStarCount: number,
  twoStarCount: number,
  threeStarCount: number,
  fourStarCount: number,
  fiveStarCount: number,
  totalReviews: number
): number => {
  if (totalReviews === 0) {
    return 0;
  }

  const totalScore =
    oneStarCount * 1 +
    twoStarCount * 2 +
    threeStarCount * 3 +
    fourStarCount * 4 +
    fiveStarCount * 5;

  return parseFloat((totalScore / totalReviews).toFixed(1));
};

export const getTimeAgo = (createdAt: string): string => {
  const now = new Date();
  const created = new Date(createdAt);

  // Calculate time difference in milliseconds
  const diffMs = now.getTime() - created.getTime();

  // Convert to minutes, hours, days, months, years
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  // Return appropriate string based on time difference
  if (diffMinutes < 1) {
    return "just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`;
  } else {
    return `${diffYears} ${diffYears === 1 ? "year" : "years"} ago`;
  }
};

export const isCompletedProfile = (user: any) => {
  return user && user.unsafeMetadata.profileCompleted == true ? true : false;
};

export const getImageUrl = (imageUrl: string) => {
  if (imageUrl.includes("https")) {
    return imageUrl;
  } else {
    return `${envConfig.EXPO_PUBLIC_STORAGE_BASE_URL}${imageUrl}`;
  }
};

export const fakeHotelName = () => {
  const adjectives = [
    "Grand",
    "Royal",
    "Elite",
    "Urban",
    "Sunny",
    "Ocean",
    "Luxe",
    "Cozy",
    "Golden",
    "Green",
  ];
  const nouns = [
    "Resort",
    "Hotel",
    "Inn",
    "Lodge",
    "Suites",
    "Palace",
    "Retreat",
    "Haven",
  ];

  const adjective = faker.helpers.arrayElement(adjectives);
  const noun = faker.helpers.arrayElement(nouns);
  const city = faker.location.city();

  return `${adjective} ${noun} ${city}`;
};
