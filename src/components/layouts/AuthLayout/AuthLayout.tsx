import Simple from './Simple'
import type { CommonProps } from '@/@types/common'

const AuthLayout = ({ children }: CommonProps) => {
    return <Simple>{children}</Simple>
}

export default AuthLayout
