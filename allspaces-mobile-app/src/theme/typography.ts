import { moderateScale, verticalScale } from "./responsive";

const fontFamily = {
  regular: `Poppins-Regular`,
  medium: `Poppins-Medium`,
  semiBold: `Poppins-SemiBold`,
  bold: `Poppins-Bold`,
};

export const appTypography = {
  heading1: {
    fontFamily: fontFamily.bold,
    fontSize: moderateScale(36),
    lineHeight: verticalScale(44),
  },
  heading2: {
    fontFamily: fontFamily.semiBold,
    fontSize: moderateScale(28),
    lineHeight: verticalScale(34),
  },
  heading3: {
    fontFamily: fontFamily.medium,
    fontSize: moderateScale(22),
    lineHeight: verticalScale(28),
  },
  heading4: {
    fontFamily: fontFamily.semiBold,
    fontSize: moderateScale(16),
    lineHeight: verticalScale(28),
  },
  body1: {
    fontFamily: fontFamily.regular,
    fontSize: moderateScale(16),
    lineHeight: verticalScale(24),
  },
  body2: {
    fontFamily: fontFamily.regular,
    fontSize: moderateScale(14),
  },
  body3: {
    fontFamily: fontFamily.medium,
    fontSize: moderateScale(14),
  },
  caption1: {
    fontFamily: fontFamily.regular,
    fontSize: moderateScale(12),
    lineHeight: verticalScale(16),
  },
  caption2: {
    fontFamily: fontFamily.regular,
    fontSize: moderateScale(10),
  },
  button1: {
    fontFamily: fontFamily.medium,
    fontSize: moderateScale(16),
  },
};
