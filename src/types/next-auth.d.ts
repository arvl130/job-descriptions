import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user?: {
      // This property is defined because we are using a DB adapter.
      id: string
    } & DefaultSession["user"]
  }
}
