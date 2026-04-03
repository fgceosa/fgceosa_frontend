import { useState, useEffect, useCallback } from 'react'
import Input from '@/components/ui/Input'
import useDebounce from '@/utils/hooks/useDebounce'
import type { ChangeEvent, Ref } from 'react'
import type { InputProps } from '@/components/ui/Input'

type DebouceInputProps = InputProps & {
    wait?: number
    ref?: Ref<HTMLInputElement>
}

const DebouceInput = (props: DebouceInputProps) => {
    const { wait = 500, ref, value, ...rest } = props
    const [displayValue, setDisplayValue] = useState(value || '')

    // Keep internal state in sync with external value prop
    useEffect(() => {
        if (value !== undefined) {
            setDisplayValue(value)
        }
    }, [value])

    const handleDebounceFn = useCallback((val: string) => {
        // Create a synthetic-like event or just pass what the parent expects
        // But since most of our components expect ChangeEvent, we have a problem.
        // Let's modify the debounced fn to just take the string value.
        // However, props.onChange expects ChangeEvent.
        // Let's try to pass a faux event if needed, but it's better if we only pass value.
        // Looking at the usage in Search.tsx: onChange={(e) => onInputChange(e.target.value)}
        // We can just call onInputChange directly if we change how Search uses it.
        // But let's stay compatible with ChangeEvent for now.
        const event = {
            target: { value: val },
            currentTarget: { value: val },
        } as ChangeEvent<HTMLInputElement>

        props.onChange?.(event)
    }, [props.onChange])

    const debounceFn = useDebounce(handleDebounceFn, wait)

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setDisplayValue(newValue)
        debounceFn(newValue)
    }

    return <Input ref={ref} {...rest} value={displayValue} onChange={handleInputChange} />
}

export default DebouceInput
