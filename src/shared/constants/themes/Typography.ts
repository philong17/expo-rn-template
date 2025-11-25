import { Fonts } from '@/shared/constants/themes/Fonts';

export const Typography = {
  // Headings - SemiBold (600)
  heading5XL: {
    fontSize: 48,
    lineHeight: 60,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
  },
  heading4XL: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
  },
  heading3XL: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
  },
  heading2XL: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
  },
  headingXL: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
  },

  headingBold5XL: {
    fontSize: 48,
    lineHeight: 60,
    fontWeight: '600',
    fontFamily: Fonts.bold,
  },
  headingBold4XL: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '600',
    fontFamily: Fonts.bold,
  },
  headingBold3XL: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '600',
    fontFamily: Fonts.bold,
  },
  headingBold2XL: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    fontFamily: Fonts.bold,
  },
  headingBoldXL: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    fontFamily: Fonts.bold,
  },

  // Body - SemiBold (600)
  bodySemiBoldLG: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
  },
  bodySemiBoldMD: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
  },
  bodySemiBoldSM: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
  },
  bodySemiBoldXS: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
  },

  // Body - Regular (400)
  bodyRegularLG: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400',
    fontFamily: Fonts.regular,
  },
  bodyRegularMD: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    fontFamily: Fonts.regular,
  },
  bodyRegularSM: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    fontFamily: Fonts.regular,
  },
  bodyRegularXS: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    fontFamily: Fonts.regular,
  },

  // Body - Bold (700)
  bodyBoldLG: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: Fonts.bold,
  },
  bodyBoldMD: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    fontFamily: Fonts.bold,
  },
  bodyBoldSM: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    fontFamily: Fonts.bold,
  },
  bodyBoldXS: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    fontFamily: Fonts.bold,
  },

  typefaceTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    fontFamily: Fonts.bold,
  },

  // Caption styles
  captionRegular: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    fontFamily: Fonts.regular,
  },
  captionBold: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    fontFamily: Fonts.bold,
  },
} as const;

// Sử dụng:
// import { Typography } from '@shared/constants/Typography';
// style={Typography.headingXL}
