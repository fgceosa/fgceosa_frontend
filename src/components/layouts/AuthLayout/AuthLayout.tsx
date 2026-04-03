import Split from './Split'
import type { CommonProps } from '@/@types/common'

const AuthLayout = ({ children }: CommonProps) => {
    return <Split>{children}</Split>
}

export default AuthLayout
