import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

// One shared MongoDB client for the Next.js auth handler.
// IMPORTANT: this must point at the same database + secret as the
// Express server (studiospace-server) so a session created here is
// also accepted by the server's requireAuth middleware.
// Accepts either env var name — the server's .env uses MONGO_DB_URI.
// The placeholder keeps `next build` from throwing when env vars are
// absent (module evaluation happens during page-data collection);
// real requests only occur at runtime, where the env must be set.
const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_DB_URI ||
  "mongodb://127.0.0.1:27017/studioSpace";
const client = new MongoClient(MONGO_URI);
const db = client.db("studioSpace");

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,

  // Public URL of this Next.js app (cookies + OAuth redirects).
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    // Assignment rule: passwords must be at least 6 characters.
    minPasswordLength: 6,
  },

  // Users live in the "users" collection, matching the Express server.
  user: {
    modelName: "users",
    additionalFields: {
      photoURL: {
        type: "string",
        required: false,
        defaultValue: "",
        returned: true,
      },
    },
  },

  plugins: [jwt()],

  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },

  socialProviders: {
    // Only registered when credentials exist, so email login keeps working
    // before you add the OAuth apps.
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  },

  advanced: {
    // In production the API lives on another domain, so the session
    // cookie must be SameSite=None to be sent with API requests.
    ...(process.env.COOKIE_SAMESITE
      ? {
          defaultCookieAttributes: {
            sameSite: process.env.COOKIE_SAMESITE as "lax" | "none" | "strict",
            secure: true,
          },
        }
      : {}),
  },
});
