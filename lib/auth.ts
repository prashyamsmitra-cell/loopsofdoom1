import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Expose provider account ID to check if this user is the "owner"
        // We use token.sub because it generally holds the provider's user ID for the user
        (session.user as any).github_id = token.sub; 
      }
      return session
    },
  },
  pages: {
    signIn: '/login', // Provide custom login page route
  }
})
