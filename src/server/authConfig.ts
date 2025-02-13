// Import necessary functions and modules
import NextAuth, { type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Extend the Session interface of NextAuth to include custom user properties
declare module "next-auth" {
  interface Session {
    user: {
      /** The user's id. */
      id: string;
      name: string;
      email: string;
    } & DefaultSession["user"];
  }
}

// Initialize NextAuth with authentication handlers, providers, and callbacks
/**
 * This file contains the options for NextAuth configuration.
 * It defines the authentication providers, authorization logic, callbacks, and custom pages.
 * The options object is exported and used in the NextAuth configuration.
 */
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const loginEmail = process.env.LOGIN_EMAIL;
        const loginPassword = process.env.LOGIN_PASSWORD;

        if (
          credentials.email === loginEmail &&
          credentials.password === loginPassword
        ) {
          return {
            id: "1",
            email: loginEmail,
            name: "Padelers Admin",
          };
        }

        return null;
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],

  // Custom pages for sign in and new user registration
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  // Custom callbacks for NextAuth
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  // Secret for NextAuth JWT tokens
  secret: process.env.AUTH_SECRET,
});
