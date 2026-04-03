'use client'

import DebouceInput from '@/components/shared/DebouceInput'
import { TbSearch } from 'react-icons/tb'
import { Ref } from 'react'

type SearchProps = {
    placeholder?: string
    onInputChange: (value: string) => void
    ref?: Ref<HTMLInputElement>
    value?: string
}

const Search = (props: SearchProps) => {
    const { onInputChange, ref, placeholder, value } = props

    return (
        <DebouceInput
            ref={ref}
            placeholder={placeholder || 'Search team member...'}
            suffix={<TbSearch className="text-lg" />}
            onChange={(e) => onInputChange(e.target.value)}
            value={value}
        />
    )
}

export default Search
