const getTeamMember = async (_queryParams: {
    [key: string]: string | string[] | undefined
}) => {
    // This server-side mock action has been retired. Pages now use the
    // client-side Redux thunks to fetch real data from the backend.
    // Return an empty object to preserve any accidental imports.
    return {}
}

export default getTeamMember
