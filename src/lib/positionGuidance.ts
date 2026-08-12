// Nathaniel's actual pocket philosophy per position, in his own words
// (lightly tightened for display). Only covers positions he currently
// strings for — FOGO/LSM intentionally have no entry here rather than
// guessing at guidance he hasn't given.
export const POSITION_GUIDANCE: Record<
  string,
  { summary: string; pocketNotes: string }
> = {
  Attack: {
    summary: "Low pocket, quick release",
    pocketNotes:
      "Mid-to-low pocket for one-handed vertical cradling, with low whip for a quick release on both shots and feeds.",
  },
  Midfield: {
    summary: "Mid-to-high pocket, most versatile",
    pocketNotes:
      "Mid-to-high pocket for two-handed vertical cradling. Ball sits just under the lowest shooting string for optimal torque and whip on the shot — the most versatile setup on the field.",
  },
  Defense: {
    summary: "High pocket, fast ground balls",
    pocketNotes:
      "High pocket with the ball sitting near the scoop for minimal travel time on ground balls. Naturally more whip, though that gets dialed in based on whether you're carrying/shooting or clearing the ball out quickly.",
  },
};
