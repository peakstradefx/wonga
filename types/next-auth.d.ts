import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    firstName?: string;
    lastName?: string;
  }

  interface Session {
    user: User & {
      firstName?: string;
      lastName?: string;
      accessToken: string;
      role: String;
    };
  }
}
