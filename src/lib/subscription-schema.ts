import { z } from "zod";

export const subscriptionInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150),
  keywords: z.array(z.string().trim().min(1)).min(1, "Add at least one keyword"),
  matchType: z.enum(["ANY", "ALL"]).default("ANY"),
  places: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  mediaTypes: z
    .array(z.enum(["NEWSPAPER", "MAGAZINE", "TV", "RADIO", "ONLINE_NEWS", "BLOG", "SOCIAL_MEDIA"]))
    .default([]),
  frequency: z.enum(["INSTANT", "DAILY", "WEEKLY"]).default("DAILY"),
  isActive: z.boolean().default(true),
});

export type SubscriptionInput = z.infer<typeof subscriptionInputSchema>;
