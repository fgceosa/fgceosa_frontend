/**
 * TableHeader - Header section for the security events table
 */
export default function TableHeader() {
    return (
        <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                    Security Events Log
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 font-medium">
                    Recent security incidents and policy violations
                </p>
            </div>
        </div>
    )
}
