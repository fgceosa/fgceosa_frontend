import Avatar from '@/components/ui/Avatar'
import {
    HiOutlineCash,
    HiOutlineBell,
    HiOutlineExclamation,
    HiOutlineSparkles,
} from 'react-icons/hi'

const NotificationAvatar = ({ type }: { type: string }) => {
    switch (type) {
        case 'credit_received':
            return (
                <Avatar
                    shape="circle"
                    className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                    icon={<HiOutlineSparkles />}
                />
            )
        case 'topup_success':
        case 'adjustment':
            return (
                <Avatar
                    shape="circle"
                    className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                    icon={<HiOutlineCash />}
                />
            )
        case 'low_balance':
            return (
                <Avatar
                    shape="circle"
                    className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                    icon={<HiOutlineExclamation />}
                />
            )
        default:
            return (
                <Avatar
                    shape="circle"
                    className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    icon={<HiOutlineBell />}
                />
            )
    }
}

export default NotificationAvatar
