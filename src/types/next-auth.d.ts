import { DefaultSession } from 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            authority: string[]
        } & DefaultSession['user']
        accessToken?: string
    }

    interface User {
        id: string
        authority: string[]
        image?: string | null
        accessToken?: string
        expiresIn?: number
        tokenType?: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        authority?: string[]
        accessToken?: string
    }
}
