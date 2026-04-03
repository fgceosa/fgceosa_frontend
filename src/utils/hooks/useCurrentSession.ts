import { useMemo } from 'react'
import { useAppSelector } from '@/store/hook'

const EMPTY_SESSION = {
    expires: '',
    user: {},
}

const useCurrentSession = () => {
    const { session } = useAppSelector((state) => state.auth.session)

    return useMemo(() => ({
        session: session || EMPTY_SESSION,
    }), [session])
}

export default useCurrentSession
