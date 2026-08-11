export const SITE_NAME = "NH Lacrosse";

export const ADMIN_NOTIFICATION_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL ?? "nathanielhunt72@gmail.com";

export const REVIEW_SLA_HOURS = 48;

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
  REVIEWED: "Film Reviewed",
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
