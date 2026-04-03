interface UserTableLoadingStateProps {
    rows?: number
}

export default function UserTableLoadingState({ rows = 10 }: UserTableLoadingStateProps) {
    return (
        <>
            {Array.from({ length: rows }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                    <td colSpan={8} className="px-8 py-5">
                        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl w-full"></div>
                    </td>
                </tr>
            ))}
        </>
    )
}
