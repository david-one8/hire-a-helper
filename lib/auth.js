import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { compare } from 'bcryptjs'
import { connectToDatabase } from './mongodb'
import User from '@/models/User'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectToDatabase()

        const user = await User.findOne({ email: credentials.email })
        if (!user) {
          throw new Error('No user found with this email')
        }

        const isValid = await compare(credentials.password, user.password)
        if (!isValid) {
          throw new Error('Invalid credentials')
        }

        if (!user.emailVerified) {
          return {
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            emailVerified: false,
          }
        }

        return {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          image: user.profilePicture || null,
          emailVerified: true,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.phoneNumber = user.phoneNumber
        token.image = user.image
        token.emailVerified = user.emailVerified
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.firstName = token.firstName
        session.user.lastName = token.lastName
        session.user.phoneNumber = token.phoneNumber
        session.user.image = token.image
        session.user.emailVerified = token.emailVerified
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
}
