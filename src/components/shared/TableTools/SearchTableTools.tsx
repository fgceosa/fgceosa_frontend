'use client'

import Search from './Search'
//import TeamListTableFilter from './TeamListTableFilter'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useSearchParams } from 'next/navigation'

type SearchTableToolsProps = {
    placeholder?: string
}
const SearchTableTools = (props: SearchTableToolsProps) => {
    const { placeholder } = props
    const { onAppendQueryParams } = useAppendQueryParams()
    const searchParams = useSearchParams()
    const query = searchParams.get('query') || ''

    const handleInputChange = (query: string) => {
        onAppendQueryParams({
            query,
            pageIndex: 1,
        })
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <Search
                onInputChange={handleInputChange}
                placeholder={placeholder}
                value={query}
            />
            {/* <TeamListTableFilter /> */}
        </div>
    )
}

export default SearchTableTools
