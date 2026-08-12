export const SITE_NAME = "NH Lacrosse";

export const ADMIN_NOTIFICATION_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL ?? "nathanielhunt72@gmail.com";

export const REVIEW_SLA_HOURS = 48;

export const INSTAGRAM_URL = "https://instagram.com/nh.lacrosse";
export const INSTAGRAM_HANDLE = "@nh.lacrosse";

export const BASE_STRINGING_FEE_CENTS = 3000;
export const RUSH_FEE_CENTS = 1500;
export const STANDARD_STRINGING_DAYS = "3-5 days";
export const RUSH_STRINGING_DAYS = "1-2 days";
export const RESTRING_GUARANTEE_DAYS = 30;
export const TEAM_ORDER_RATE_CENTS = 2000;

// Where athletes should ship the head they purchase. This is a sample
// address for now — swap in your real business shipping address before
// going live.
export const STRINGER_SHIP_TO = {
  name: "Nathaniel Hunt / NH Lacrosse",
  line1: "42 Elm Street",
  line2: "Unit 3",
  city: "Manchester",
  state: "NH",
  postalCode: "03101",
  country: "USA",
};

export const PLAYER_LEVEL_LABELS: Record<string, string> = {
  YOUTH: "Youth",
  MIDDLE_SCHOOL: "Middle School",
  HIGH_SCHOOL: "High School",
  CLUB: "Club",
  COLLEGE: "College",
  POST_COLLEGE: "Post-College",
};

export const STATUS_LABELS: Record<string, string> = {
  SUBMITTED: "Submitted",
  REVIEWED: "Reviewed",
  RECOMMENDATION_SENT: "Recommendation Sent",
  PAID: "Payment Received",
  HEAD_RECEIVED: "Head Received",
  STRINGING: "Stringing In Progress",
  SHIPPED: "Shipped",
  COMPLETE: "Complete",
};

export const STATUS_ORDER = [
  "SUBMITTED",
  "REVIEWED",
  "RECOMMENDATION_SENT",
  "PAID",
  "HEAD_RECEIVED",
  "STRINGING",
  "SHIPPED",
  "COMPLETE",
];

export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function formatShippingAddress(address: {
  shippingAddressLine1: string | null;
  shippingAddressLine2: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingPostalCode: string | null;
  shippingCountry: string | null;
}): string {
  const cityStateZip = [address.shippingCity, address.shippingState, address.shippingPostalCode]
    .filter(Boolean)
    .join(", ");
  return [address.shippingAddressLine1, address.shippingAddressLine2, cityStateZip, address.shippingCountry]
    .filter(Boolean)
    .join(", ");
}
