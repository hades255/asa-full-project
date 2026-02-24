/**
 * Utility function to format profile data consistently across all APIs
 * @param {Object} profile - Raw profile object from database
 * @param {Object} options - Optional parameters
 * @param {boolean} options.isInWishlist - Whether profile is in user's wishlist (default: false)
 * @returns {Object} Formatted profile object
 */
export const formatProfile = (profile, options = {}) => {
  if (!profile) {
    return null;
  }

  const { isInWishlist = false } = options;

  // Format services
  const services = (profile.services || []).map((service) => ({
    id: service?.id || "",
    name: service?.name || "",
    description: service?.description || "",
    minSpend: service.minSpend || 0,
    subCategoryId: service?.category?.id || null,
    categoryId: service?.category?.parent?.id || null,
    media: service?.media ? service.media.filePath || "" : null,
  }));

  // Format facilities
  const facilities = (profile.facilities || []).map((facility) => ({
    id: facility.id || "",
    name: facility.name || "",
    description: "",
  }));

  // Format reviews
  const reviews = (profile.reviews || []).map((review) => ({
    id: review.id || "",
    rating: review.rating || 0,
    comment: review.comment || "",
    createdAt: review.createdAt || "",
    user: {
      id: review.user?.id || "",
      firstName: review.user?.first_name || "",
      lastName: review.user?.last_name || "",
      email: review.user?.email || "",
    },
  }));

  // Format media
  const mediaItems = (profile.medias || []).map((mediaItem) => ({
    id: mediaItem.id || "",
    url: mediaItem.filePath || "",
  }));

  // Create formatted profile object
  const formattedProfile = {
    id: profile.id || "",
    name: profile.name || "",
    description: profile.description || "",
    email: profile.email || "",
    location: {
      lat: profile.lat || 0,
      lng: profile.lng || 0,
    },
    address: profile.address || "",
    coverMedia: profile.coverMedia || "",
    source: profile.source || "",
    status: profile.status || "",
    averageRating: profile.averageRating || 0,
    //  eco_score: profile.eco_score || 0,
    totalReviews: profile.totalReviews || 0,
    rating: {
      oneStarCount: profile.oneStarCount || 0,
      twoStarCount: profile.twoStarCount || 0,
      threeStarCount: profile.threeStarCount || 0,
      fourStarCount: profile.fourStarCount || 0,
      fiveStarCount: profile.fiveStarCount || 0,
    },
    facilities: facilities,
    services: services,
    reviews: reviews,
    media: mediaItems,
    isInWishlist: isInWishlist,
  };

  return formattedProfile;
};

/**
 * Utility function to format booking services consistently
 * @param {Array} bookingServices - Array of booking service objects
 * @returns {Array} Formatted booking services array
 */
export const formatBookingServices = (bookingServices) => {
  if (!bookingServices || !Array.isArray(bookingServices)) {
    return [];
  }

  return bookingServices.map((bookingService) => {
    const service = bookingService.service;

    return {
      id: service?.id || "",
      name: service?.name || "",
      description: service?.description || "",
      minSpend: service?.minSpend || 0,
      subCategoryId: service?.category?.id || null,
      categoryId: service?.category?.parent?.id || null,
      media: service?.media ? service.media.filePath || "" : null,
      // Additional booking-specific fields
      bookingServiceId: bookingService.id || "",
      bookingId: bookingService.bookingId || "",
      price: bookingService.price || 0,
      createdAt: bookingService.createdAt || "",
      updatedAt: bookingService.updatedAt || "",
    };
  });
};
