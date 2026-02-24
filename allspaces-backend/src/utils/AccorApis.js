import axios from "axios";
import bcrypt from "bcrypt";

export const getHotelsAgainstKeyword = async (keyword, location = null) => {
  try {
    // Check if location is valid (not 0,0)
    if (!location || location.lat === 0 || location.lng === 0) {
      console.log("Invalid location provided, returning empty results");
      return { results: [] };
    }
    // If location is provided, use latLng parameter format (put it first)
    //  if (location && location.lat && location.lng) {
    //   params = {
    //     latLng: `${location.lat},${location.lng}`,
    //     radius: 10,
    //   };
    // } else {
    //   // Default to Canada if no location provided
    //   params = {
    //     q: "Canada",
    //     radius: 30,
    //     enlarge: false,
    //     mediaCategories: keyword || "Hotel",
    //   };
    // }

    const params = {
      latLng: `${location.lat},${location.lng}`,
      radius: 10,
    };

    const response = await axios.get(
      "https://rec-api.accor.com/catalog/v1/hotels",
      {
        params,
        headers: {
          accept: "application/json",
          clientId: "all.accor",
          apikey: process.env.ACCOR_API_KEY,
        },
      }
    );

    console.log("Accor data API => ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching hotels against keyword:", error.message);
    if (error.response) {
      console.error("Response error data:", error.response.data);
    }
    throw error;
  }
};

export const getHotelsAgainstId = async (accor_hotel_id) => {
  try {
    const response = await axios.get(
      `https://rec-api.accor.com/catalog/v1/hotels`,
      {
        params: {
          id: accor_hotel_id,
        },
        headers: {
          accept: "application/json",
          clientId: "all.accor",
          apikey: process.env.ACCOR_API_KEY,
        },
      }
    );

    console.log("Accor data API => ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching hotels against keyword:", error.message);
    if (error.response) {
      console.error("Response error data:", error.response.data);
    }
    throw error;
  }
};

export const getHotelsRates = async (hotelCodes) => {
  try {
    const response = await axios.post(
      "https://rec-api.accor.com/availability/v3/best-offers",
      {
        hotelCode: hotelCodes,
      },
      {
        headers: {
          accept: "application/json",
          clientId: "all.accor",
          apikey: process.env.ACCOR_API_KEY,
        },
      }
    );

    console.log("Accor data API => ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching hotel rates:", error.message);
    if (error.response) {
      console.error("Response error data:", error.response.data);
    }
    throw error;
  }
};

export const mapAccorHotelsData = (accorResult, accorHotelsRates) => {
  // Check if accorResult and results exist
  if (
    !accorResult ||
    !accorResult.results ||
    !Array.isArray(accorResult.results)
  ) {
    console.log("No Accor results found or invalid format:", accorResult);
    return [];
  }

  return accorResult.results
    .map((result) => {
      const { score, hotel } = result;

      // Check if hotel data exists
      if (!hotel) {
        console.log("No hotel data found in result:", result);
        return null;
      }

      const services =
        hotel?.amenity?.paying?.map((service) => {
          const rate = accorResult?.statistics?.hotel?.amenity?.[service] || 0;
          return {
            name: service,
            rate,
            minSpend: rate,
            unitMeasure: "per hour",
            description: hotel.enhancedDescription,
          };
        }) || [];

      // Safely get cover media with null checks
      const coverMedia = hotel?.media?.medias?.[0]?.["1024x768"] || "";

      // Safely get all media with null checks
      const medias =
        hotel?.media?.medias?.map((media) => {
          return { filePath: media?.["1024x768"] || "" };
        }) || [];

      // Safely get facilities with null checks
      const facilities =
        hotel?.amenity?.free?.map((item) => ({ name: item })) || [];

      return {
        id: hotel.id,
        name: hotel.name,
        description: hotel.description,
        email: hotel?.contact?.mail,
        location: `${hotel.localization.address.city}, ${hotel.localization.address.country}`,
        coverMedia: coverMedia,
        status: hotel.status,
        price:
          accorHotelsRates?.availabilities?.find(
            (item) => item.hotelCode === hotel.id
          )?.offers?.[0]?.pricing.average?.afterTax || 0,
        oneStarCount: 0,
        twoStarCount: 0,
        threeStarCount: 0,
        fourStarCount: 0,
        fiveStarCount: 0,
        source: "ACCOR",
        totalReviews: hotel.rating?.star?.score || 0,
        // eco_score: score,
        facilities: facilities,
        services: services,
        medias: medias,
      };
    })
    .filter(Boolean); // Remove any null results
};

export const mapAccorHotelsDataSimple = (accorResult, accorHotelsRates) => {
  // Check if accorResult and results exist
  if (
    !accorResult ||
    !accorResult.results ||
    !Array.isArray(accorResult.results)
  ) {
    console.log("No Accor results found or invalid format:", accorResult);
    return [];
  }

  return accorResult.results.map((result) => {
    const { score, hotel } = result;

    // Get price from accorHotelsRates
    const price =
      accorHotelsRates?.availabilities?.find(
        (item) => item.hotelCode === hotel.id
      )?.offers?.[0]?.pricing.average?.afterTax || 0;

    // Return the result as-is with only source and price added
    return {
      ...result,
      source: "ACCOR",
      price: price,
    };
  });
};

export const getFacilitiesByHotelId = async (id) => {
  try {
    const response = await axios.get(
      `https://rec-api.accor.com/catalog/v1/hotels/${id}/facilities`,
      {
        headers: {
          accept: "application/json",
          clientId: "all.accor",
          apikey: process.env.ACCOR_API_KEY,
        },
      }
    );
    console.log("Accor data API => ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching hotel facilities by id:", error.message);
    if (error.response) {
      console.error("Response error data:", error.response.data);
    }
    throw error;
  }
};

export const getMediasByHotelId = async (id) => {
  try {
    const response = await axios.get(
      `https://rec-api.accor.com/catalog/v1/hotels/${id}/medias`,
      {
        headers: {
          accept: "application/json",
          clientId: "all.accor",
          apikey: process.env.ACCOR_API_KEY,
        },
      }
    );
    console.log("Accor data API => ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching hotel facilities by id:", error.message);
    if (error.response) {
      console.error("Response error data:", error.response.data);
    }
    throw error;
  }
};

export const getHotelDetailById = async (id) => {
  try {
    ///catalog/v1/hotels/{id}
    const response = await axios.get(
      `https://rec-api.accor.com/catalog/v1/hotels/${id}`,
      {
        headers: {
          accept: "application/json",
          clientId: "all.accor",
          apikey: process.env.ACCOR_API_KEY,
        },
      }
    );
    console.log("Accor data API => ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching hotel facilities by id:", error.message);
    if (error.response) {
      console.error("Response error data:", error.response.data);
    }
    throw error;
  }
};
export const getHotelRatesByHotelId = async (id) => {
  try {
    ///catalog/v1/hotels/{id}
    const response = await axios.get(
      `https://rec-api.accor.com/catalog/v1/hotels/${id}/rates`,
      {
        headers: {
          accept: "application/json",
          clientId: "all.accor",
          apikey: process.env.ACCOR_API_KEY,
        },
      }
    );
    console.log("Accor data API => ", response.data.rates);
    return response.data.rates;
  } catch (error) {
    console.error("Error fetching hotel facilities by id:", error.message);
    if (error.response) {
      console.error("Response error data:", error.response.data);
    }
    throw error;
  }
};

// Enhanced mapping function for Accor hotels with additional API calls
export const mapAccorHotelsDataEnhanced = async (
  accorResult,
  accorHotelsRates
) => {
  // Check if accorResult and results exist
  if (
    !accorResult ||
    !accorResult.results ||
    !Array.isArray(accorResult.results)
  ) {
    console.log("No Accor results found or invalid format:", accorResult);
    return [];
  }

  // Process each hotel with additional API calls
  const enhancedProfiles = await Promise.all(
    accorResult.results.map(async (result) => {
      const { score, hotel } = result;

      // Check if hotel data exists
      if (!hotel) {
        console.log("No hotel data found in result:", result);
        return null;
      }

      try {
        // Make parallel API calls for additional data
        const [hotelDetail, hotelRates, hotelMedias, hotelFacilities] =
          await Promise.all([
            getHotelDetailById(hotel.id).catch((err) => {
              console.error(
                `Error fetching hotel detail for ${hotel.id}:`,
                err.message
              );
              return null;
            }),
            getHotelRatesByHotelId(hotel.id).catch((err) => {
              console.error(
                `Error fetching hotel rates for ${hotel.id}:`,
                err.message
              );
              return null;
            }),
            getMediasByHotelId(hotel.id).catch((err) => {
              console.error(
                `Error fetching hotel medias for ${hotel.id}:`,
                err.message
              );
              return null;
            }),
            getFacilitiesByHotelId(hotel.id).catch((err) => {
              console.error(
                `Error fetching hotel facilities for ${hotel.id}:`,
                err.message
              );
              return null;
            }),
          ]);

        // Get price from accorHotelsRates or hotelRates
        const price =
          accorHotelsRates?.availabilities?.find(
            (item) => item.hotelCode === hotel.id
          )?.offers?.[0]?.pricing.average?.afterTax ||
          hotelRates?.offers?.[0]?.pricing.average?.afterTax ||
          0;

        return {
          ...result,
          price: price,
          source: "ACCOR",
          facilities: hotelFacilities,
          medias: hotelMedias,
          hotelDetail: hotelDetail,
          hotelRates: hotelRates,
        };
      } catch (error) {
        console.error(`Error processing hotel ${hotel.id}:`, error);
        return null;
      }
    })
  );

  return enhancedProfiles.filter(Boolean); // Remove any null results
};
