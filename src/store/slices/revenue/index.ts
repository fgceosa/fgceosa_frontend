import reducer, { clearRevenueError, RevenueState } from './revenueSlice'
import { fetchRevenueData } from './revenueThunk'
import {
    selectRevenueData,
    selectRevenueLoading,
    selectRevenueError,
    selectRevenueKPI
} from './revenueSelectors'

export type { RevenueState }

export {
    reducer as default,
    clearRevenueError,
    fetchRevenueData,
    selectRevenueData,
    selectRevenueLoading,
    selectRevenueError,
    selectRevenueKPI
}

