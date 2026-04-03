import { Suspense } from 'react'
import SignInClient from './_components/SignInClient'

const Page = () => {
    return (
        <Suspense fallback={null}>
            <SignInClient />
        </Suspense>
    )
}

export default Page
