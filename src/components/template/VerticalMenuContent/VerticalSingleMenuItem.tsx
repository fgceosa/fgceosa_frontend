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
        sideCollapsed,
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
                    'group transition-all duration-300 my-2 mx-1 relative overflow-hidden flex items-center',
                    sideCollapsed ? 'justify-center mx-1.5' : '',
                    currentKey === nav.key
                        ? 'bg-white/10 text-white shadow-xl'
                        : 'bg-transparent text-white hover:bg-white/5'
                )}
                style={{
                    borderRadius: '1rem',
                }}
            >
                <Link
                    href={nav.path}
                    className={classNames(
                        "flex items-center w-full py-3",
                        sideCollapsed ? "justify-center px-0" : "gap-3.5 px-4"
                    )}
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
                                ? "text-white scale-110"
                                : "text-white/70 group-hover:text-white"
                        )}>
                            <VerticalMenuIcon
                                icon={nav.icon}
                                currentKey={currentKey || ''}
                                className="text-[20px]"
                            />
                        </div>
                    )}
                    {showTitle && (
                        <span className={classNames(
                            "text-[14px] leading-tight tracking-wide",
                            currentKey === nav.key ? "font-black" : "font-bold"
                        )}>
                            {t(nav.translateKey, nav.title)}
                        </span>
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
