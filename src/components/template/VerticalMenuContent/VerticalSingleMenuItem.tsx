import classNames from '@/utils/classNames'
import Tooltip from '@/components/ui/Tooltip'
import Menu from '@/components/ui/Menu'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import VerticalMenuIcon from './VerticalMenuIcon'
import Link from 'next/link'
import Dropdown from '@/components/ui/Dropdown'
import type { CommonProps } from '@/@types/common'
import type { Direction } from '@/@types/theme'
import type { NavigationTree, TranslationFn } from '@/@types/navigation'

const { MenuItem } = Menu

interface CollapsedItemProps extends CommonProps {
    nav: NavigationTree
    direction?: Direction
    onLinkClick?: (link: { key: string; title: string; path: string }) => void
    t: TranslationFn
    renderAsIcon?: boolean
    userAuthority: string[]
    userPermissions?: string[]
    currentKey?: string
    parentKeys?: string[]
}

interface DefaultItemProps {
    nav: NavigationTree
    onLinkClick?: (link: { key: string; title: string; path: string }) => void
    sideCollapsed?: boolean
    t: TranslationFn
    indent?: boolean
    userAuthority: string[]
    userPermissions?: string[]
    showIcon?: boolean
    showTitle?: boolean
    currentKey?: string
}

interface VerticalMenuItemProps extends CollapsedItemProps, DefaultItemProps { }

const CollapsedItem = ({
    nav,
    children,
    direction,
    renderAsIcon,
    onLinkClick,
    userAuthority,
    userPermissions,
    t,
    currentKey,
}: CollapsedItemProps) => {
    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority} userPermissions={userPermissions} permission={nav.permission}>
            {renderAsIcon ? (
                <Tooltip
                    title={t(nav.translateKey, nav.title)}
                    placement={direction === 'rtl' ? 'left' : 'right'}
                >
                    {children}
                </Tooltip>
            ) : (
                <Dropdown.Item active={currentKey === nav.key}>
                    {nav.path ? (
                        <Link
                            className="h-full w-full flex items-center outline-hidden"
                            href={nav.path}
                            target={nav.isExternalLink ? '_blank' : ''}
                            onClick={() =>
                                onLinkClick?.({
                                    key: nav.key,
                                    title: nav.title,
                                    path: nav.path,
                                })
                            }
                        >
                            <span>{t(nav.translateKey, nav.title)}</span>
                        </Link>
                    ) : (
                        <span>{t(nav.translateKey, nav.title)}</span>
                    )}
                </Dropdown.Item>
            )}
        </AuthorityCheck>
    )
}

const DefaultItem = (props: DefaultItemProps) => {
    const {
        nav,
        onLinkClick,
        showTitle,
        indent,
        showIcon = true,
        userAuthority,
        userPermissions,
        t,
        currentKey,
    } = props

    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority} userPermissions={userPermissions} permission={nav.permission}>
            <MenuItem
                key={nav.key}
                eventKey={nav.key}
                dotIndent={indent}
                className={classNames(
                    'group transition-all duration-200 my-0.5 mx-1.5 relative overflow-hidden flex items-center',
                    currentKey === nav.key
                        ? 'bg-blue-50 dark:bg-primary/10 text-primary font-semibold'
                        : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-blue-50/50 dark:hover:bg-primary/5'
                )}
                style={{
                    borderRadius: '0.75rem',
                }}
            >
                <Link
                    href={nav.path}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5"
                    target={nav.isExternalLink ? '_blank' : ''}
                    onClick={() =>
                        onLinkClick?.({
                            key: nav.key,
                            title: nav.title,
                            path: nav.path,
                        })
                    }
                >
                    {showIcon && (
                        <div className={classNames(
                            "transition-all duration-300 flex items-center justify-center shrink-0",
                            currentKey === nav.key
                                ? "text-primary scale-110"
                                : "text-gray-400 group-hover:text-primary"
                        )}>
                            <VerticalMenuIcon
                                icon={nav.icon}
                                currentKey={currentKey || ''}
                                className="text-[20px]"
                            />
                        </div>
                    )}
                    {showTitle && (
                        <span className="text-[13.5px] font-medium capitalize leading-tight">
                            {t(nav.translateKey, nav.title)}
                        </span>
                    )}

                    {currentKey === nav.key && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_10px_rgba(0,85,186,0.2)]"></div>
                    )}
                </Link>
            </MenuItem>
        </AuthorityCheck>
    )
}

const VerticalSingleMenuItem = ({
    nav,
    onLinkClick,
    sideCollapsed,
    direction,
    indent,
    renderAsIcon,
    userAuthority,
    userPermissions,
    showIcon,
    showTitle,
    t,
    currentKey,
    parentKeys,
}: Omit<VerticalMenuItemProps, 'title' | 'translateKey'>) => {
    return (
        <>
            {sideCollapsed ? (
                <CollapsedItem
                    currentKey={currentKey}
                    parentKeys={parentKeys}
                    nav={nav}
                    direction={direction}
                    renderAsIcon={renderAsIcon}
                    userAuthority={userAuthority}
                    userPermissions={userPermissions}
                    t={t}
                    onLinkClick={onLinkClick}
                >
                    <DefaultItem
                        nav={nav}
                        sideCollapsed={sideCollapsed}
                        userAuthority={userAuthority}
                        userPermissions={userPermissions}
                        showIcon={showIcon}
                        showTitle={showTitle}
                        t={t}
                        onLinkClick={onLinkClick}
                    />
                </CollapsedItem>
            ) : (
                <DefaultItem
                    nav={nav}
                    sideCollapsed={sideCollapsed}
                    userAuthority={userAuthority}
                    userPermissions={userPermissions}
                    showIcon={showIcon}
                    showTitle={showTitle}
                    indent={indent}
                    t={t}
                    currentKey={currentKey}
                    onLinkClick={onLinkClick}
                />
            )}
        </>
    )
}

export default VerticalSingleMenuItem
