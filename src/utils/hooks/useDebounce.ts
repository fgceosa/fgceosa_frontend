'use client'

import { useMemo, useEffect } from 'react'
import debounce from 'lodash/debounce'
import type { DebounceSettingsLeading } from 'lodash'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useDebounce<T extends (...args: any) => any>(
    func: T,
    wait: number | undefined,
    options?: DebounceSettingsLeading,
) {
    const debouncedFn = useMemo(() => debounce(func, wait, options), [func, wait, options])

    useEffect(() => {
        return () => {
            debouncedFn.cancel()
        }
    }, [debouncedFn])

    return debouncedFn
}

export default useDebounce
