import HorizontalMenuDropdownTrigger from './HorizontalMenuDropdownTrigger'
import HorizontalMenuDropdown from './HorizontalMenuDropdown'
import HorizontalMenuDropdownContent from './HorizontalMenuDropdownContent'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import useMenuActive from '@/utils/hooks/useMenuActive'
import { TbChevronDown } from 'react-icons/tb'
import { Direction } from '@/@types/theme'
import type { NavigationTree } from '@/@types/navigation'

type HorizontalMenuContentProps = {
    routeKey: string
    navigationTree?: NavigationTree[]
    direction?: Direction
    userAuthority: string[]
    userPermissions?: string[]
}

const HorizontalMenuContent = (props: HorizontalMenuContentProps) => {
    const {
        routeKey,
        navigationTree = [],
        userAuthority,
        userPermissions = [],
    } = props

    const t = (key: string, fallback?: string) => {
        return fallback || key
    }
    const { activedRoute } = useMenuActive(navigationTree, routeKey)

    return (
        <div className="gap-1 hidden lg:flex">
            {navigationTree.map((nav) => (
                <AuthorityCheck
                    key={nav.key}
                    userAuthority={userAuthority}
                    authority={nav.authority}
                    userPermissions={userPermissions}
                    permission={nav.permission}
                >
                    {nav.subMenu.length > 0 ? (
                        <HorizontalMenuDropdown
                            dropdownLean={
                                nav.meta?.horizontalMenu?.layout === 'default'
                            }
                            triggerContent={({ ref, props }) => (
                                <HorizontalMenuDropdownTrigger
                                    ref={ref}
                                    {...props}
                                    asElement="button"
                                >
                                    <div className="flex items-center gap-1">
                                        <span>
                                            {t(nav.translateKey, nav.title)}
                                        </span>
                                        <TbChevronDown />
                                    </div>
                                </HorizontalMenuDropdownTrigger>
                            )}
                            menuContent={({ styles, handleDropdownClose }) => (
                                <HorizontalMenuDropdownContent
                                    style={styles}
                                    navigationTree={nav.subMenu}
                                    t={t}
                                    layoutMeta={nav?.meta?.horizontalMenu}
                                    routeKey={routeKey}
                                    routeParentKey={activedRoute?.parentKey}
                                    userAuthority={userAuthority}
                                    userPermissions={userPermissions}
                                    onDropdownClose={handleDropdownClose}
                                />
                            )}
                        ></HorizontalMenuDropdown>
                    ) : (
                        <HorizontalMenuDropdownTrigger
                            {...props}
                            path={nav.path}
                            isExternalLink={nav.isExternalLink}
                            active={activedRoute?.key === nav.key}
                            asElement="a"
                        >
                            <div className="flex items-center gap-1">
                                <span>{t(nav.translateKey, nav.title)}</span>
                            </div>
                        </HorizontalMenuDropdownTrigger>
                    )}
                </AuthorityCheck>
            ))}
        </div>
    )
}

export default HorizontalMenuContent
