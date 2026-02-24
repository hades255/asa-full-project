export type SearchIntent = {
  date: string;
  duration: number;
  noOfGuests: number;
  location: {
    address: string;
    lat?: number;
    lng?: number;
  };
  categoryIds?: string[];
  rawQuery?: string;
  confidence?: number;
  inferredDescription?: string;
};

type BuildIntentInput = {
  date: string;
  duration: string;
  guests: string;
  address: string;
  categoryIds: string;
  rawQuery?: string;
};

export function buildIntentPayload(input: BuildIntentInput): SearchIntent {
  if (!input.date) {
    throw new Error("date is required (ISO 8601).");
  }
  if (!input.address) {
    throw new Error("location address is required.");
  }

  const duration = parseInt(input.duration, 10);
  const guests = parseInt(input.guests, 10);

  if (Number.isNaN(duration) || duration <= 0) {
    throw new Error("duration must be a positive integer.");
  }
  if (Number.isNaN(guests) || guests < 0) {
    throw new Error("guests must be 0 or a positive integer.");
  }

  const categoryIds =
    input.categoryIds
      ?.split(",")
      .map((c) => c.trim())
      .filter(Boolean) || undefined;

  const intent: SearchIntent = {
    date: input.date,
    duration,
    noOfGuests: guests,
    location: {
      address: input.address
    },
    ...(categoryIds && { categoryIds }),
    ...(input.rawQuery && { rawQuery: input.rawQuery })
  };

  return intent;
}

