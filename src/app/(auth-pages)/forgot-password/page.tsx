import { Suspense } from 'react'
import ForgotPasswordClient from './_components/ForgotPasswordClient'

const Page = () => {
    return (
        <Suspense fallback={null}>
            <ForgotPasswordClient />
        </Suspense>
    )
}

export default Page
