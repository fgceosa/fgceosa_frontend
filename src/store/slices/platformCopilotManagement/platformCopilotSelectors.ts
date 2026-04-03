import { RootState } from '@/store'

export const selectCopilotList = (state: RootState) => state.platformCopilotManagement?.copilotList
export const selectCopilotLoading = (state: RootState) => state.platformCopilotManagement?.loading
export const selectCopilotTotal = (state: RootState) => state.platformCopilotManagement?.total
export const selectCopilotFilter = (state: RootState) => state.platformCopilotManagement?.filter
