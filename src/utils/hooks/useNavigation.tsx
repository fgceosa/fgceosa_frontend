'use client'

import { useAppSelector } from '@/store/hook'

const useNavigation = () => {
    const navigationTree = useAppSelector((state) => state.navigation.navigationTree)
    return { navigationTree }
}

export default useNavigation
