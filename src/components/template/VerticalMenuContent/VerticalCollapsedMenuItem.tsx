import Menu from '@/components/ui/Menu'
import Dropdown from '@/components/ui/Dropdown'
import VerticalMenuIcon from './VerticalMenuIcon'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import type { CommonProps } from '@/@types/common'
import type { Direction } from '@/@types/theme'
import type { NavigationTree, TranslationFn } from '@/@types/navigation'

interface DefaultItemProps extends CommonProps {
    nav: NavigationTree
    onLinkClick?: (link: { key: string; title: string; path: string }) => void
    t: TranslationFn
    indent?: boolean
    dotIndent?: boolean
    userAuthority: string[]
    userPermissions?: string[]
    currentKey?: string
}

interface CollapsedItemProps extends DefaultItemProps {
    direction: Direction
    renderAsIcon?: boolean
    currentKey?: string
    parentKeys?: string[]
}

interface VerticalCollapsedMenuItemProps extends CollapsedItemProps {
    sideCollapsed?: boolean
}

const { MenuItem, MenuCollapse } = Menu

const DefaultItem = ({
    nav,
    indent,
    dotIndent,
    children,
    userAuthority,
    userPermissions,
    t,
    currentKey,
}: DefaultItemProps) => {
    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority} userPermissions={userPermissions} permission={nav.permission}>
            <MenuCollapse
                key={nav.key}
                label={
                    <>
                        <VerticalMenuIcon
                            currentKey={nav.key}
                            icon={nav.icon}
                            className={`transition-colors text-[18px] ${currentKey === nav.key
                                ? 'text-primary'
                                : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                                }`}
                        />
                        <span className="text-[13.5px] font-medium capitalize">{t(nav.translateKey, nav.title)}</span>
                    </>
                }
                eventKey={nav.key}
                expanded={false}
                dotIndent={dotIndent}
                indent={indent}
                className={`
        group
        rounded-lg
        transition-all
        duration-200
        overflow-hidden
        my-1
        mx-1.5
        px-3
        py-2.5
        ${currentKey === nav.key
                        ? 'bg-blue-50 dark:bg-primary/10 text-primary font-semibold'
                        : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-blue-50/50 dark:hover:bg-primary/5'
                    }
    `}
            >
                {children}
            </MenuCollapse>
        </AuthorityCheck>
    )
}

const CollapsedItem = ({
    nav,
    direction,
    children,
    t,
    renderAsIcon,
    userAuthority,
    userPermissions,
    parentKeys,
    currentKey,
}: CollapsedItemProps) => {
    const menuItem = (
        <MenuItem
            key={nav.key}
            isActive={parentKeys?.includes(nav.key)}
            eventKey={nav.key}
            className={`
        group
        rounded-lg
        transition-all
        duration-200
        overflow-hidden
        my-1
        mx-1.5
        p-2
        ${currentKey === nav.key || parentKeys?.includes(nav.key)
                    ? 'bg-blue-50 dark:bg-primary/10 text-primary font-semibold'
                    : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-blue-50/50 dark:hover:bg-primary/5'
                }
    `}
        >
            <VerticalMenuIcon
                currentKey={nav.key}
                icon={nav.icon}
                className={`transition-colors text-[18px] ${currentKey === nav.key || parentKeys?.includes(nav.key)
                    ? 'text-primary'
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                    }`}
            />
        </MenuItem>
    )

    const dropdownItem = (
        <div key={nav.key} className="text-[13.5px] font-medium capitalize">{t(nav.translateKey, nav.title)}</div>
    )

    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority} userPermissions={userPermissions} permission={nav.permission}>
            <Dropdown
                trigger="hover"
                renderTitle={renderAsIcon ? menuItem : dropdownItem}
                placement={direction === 'rtl' ? 'left-start' : 'right-start'}
            >
                {children}
            </Dropdown>
        </AuthorityCheck>
    )
}

const VerticalCollapsedMenuItem = ({
    sideCollapsed,
    ...rest
}: VerticalCollapsedMenuItemProps) => {
    return sideCollapsed ? (
        <CollapsedItem {...rest} />
    ) : (
        <DefaultItem {...rest} />
    )
}

export default VerticalCollapsedMenuItem
