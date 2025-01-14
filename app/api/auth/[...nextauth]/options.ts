import CredentialsProvider from "next-auth/providers/credentials";
import axios, { AxiosError } from "axios";
import { NextAuthOptions, User, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Account, Profile } from "next-auth";

// Extend JWT type to include custom fields
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    accessToken?: string;
  }
}

// Extend Session type to include custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      firstName: string;
      lastName: string;
      email: string;
      accessToken: string;
    };
  }
}

// Define custom user interface
interface CustomUser extends User {
  id: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

// Define interface for API response
interface LoginResponse {
  id: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

        if (!credentials?.email || !credentials?.password) {
          throw new Error(
            "Missing credentials. Please provide both email and password."
          );
        }

        try {
          const res = await axios.post<LoginResponse>(
            `${baseUrl}/api/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          const { token, ...userData } = res.data;

          if (res.status === 200 && userData) {
            return {
              id: userData.id,
              role: userData.role,
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              token: token,
              name: `${userData.firstName} ${userData.lastName}`, // Required by User type
              image: null, // Required by User type
            };
          } else {
            throw new Error(
              "Authorization failed. Invalid status or user data."
            );
          }
        } catch (error) {
          const axiosError = error as AxiosError<{ message: string }>;
          if (axiosError.response) {
            if (axiosError.response.status === 401) {
              throw new Error("Invalid credentials. Please try again.");
            } else if (axiosError.response.status >= 500) {
              throw new Error("Server error. Please try again later.");
            } else {
              throw new Error(
                `Unexpected error: ${
                  axiosError.response.data?.message || "An error occurred."
                }`
              );
            }
          } else if (axiosError.request) {
            throw new Error(
              "No response from the server. Please check your internet connection."
            );
          } else {
            throw new Error(`Unexpected error: ${axiosError.message}`);
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: CustomUser | User;
      account?: Account | null;
      profile?: Profile | undefined;
      trigger?: "signIn" | "signUp" | "update";
    }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.role = (user as CustomUser).role;
        token.firstName = (user as CustomUser).firstName;
        token.lastName = (user as CustomUser).lastName;
        token.email = user.email;
        token.accessToken = (user as CustomUser).token;
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      session.user = {
        id: token.id as string,
        role: token.role as string,
        firstName: token.firstName as string,
        lastName: token.lastName as string,
        email: token.email as string,
        accessToken: token.accessToken as string,
      };
      return session;
    },
  },
};
