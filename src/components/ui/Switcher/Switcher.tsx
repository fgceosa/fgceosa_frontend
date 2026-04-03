import { useState, useEffect } from 'react'
import classNames from 'classnames'
import { Spinner } from '../Spinner'
import type { CommonProps } from '../@types/common'
import type { ReactNode, ChangeEvent, Ref } from 'react'

export interface SwitcherProps extends CommonProps {
    checked?: boolean
    checkedContent?: string | ReactNode
    switcherClass?: string
    defaultChecked?: boolean
    disabled?: boolean
    isLoading?: boolean
    labelRef?: Ref<HTMLLabelElement>
    name?: string
    onChange?: (checked: boolean, e: ChangeEvent<HTMLInputElement>) => void
    readOnly?: boolean
    ref?: Ref<HTMLInputElement>
    unCheckedContent?: string | ReactNode
}

const Switcher = (props: SwitcherProps) => {
    const {
        checked,
        checkedContent,
        className,
        switcherClass,
        defaultChecked,
        disabled,
        isLoading = false,
        labelRef,
        name,
        onChange,
        readOnly,
        ref,
        unCheckedContent,
        ...rest
    } = props

    const [switcherChecked, setSwitcherChecked] = useState(
        typeof checked !== 'undefined' ? checked : (defaultChecked || false),
    )

    useEffect(() => {
        if (typeof checked !== 'undefined') {
            setSwitcherChecked(checked)
        }
    }, [checked])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (disabled || readOnly || isLoading) {
            return
        }

        const nextChecked = !switcherChecked

        if (typeof checked === 'undefined') {
            setSwitcherChecked(nextChecked)
            onChange?.(nextChecked, e)
        } else {
            onChange?.(nextChecked, e)
        }
    }

    const switcherColor = switcherClass || 'bg-primary dark:bg-primary'
    const isChecked = typeof checked !== 'undefined' ? checked : switcherChecked

    return (
        <label
            ref={labelRef}
            className={classNames(
                'switcher',
                isChecked && `switcher-checked ${switcherColor}`,
                disabled && 'switcher-disabled',
                className,
            )}
        >
            <input
                ref={ref}
                type="checkbox"
                disabled={disabled}
                readOnly={readOnly}
                name={name}
                checked={isChecked}
                onChange={handleChange}
                {...rest}
            />
            {isLoading ? (
                <Spinner
                    className={classNames(
                        'switcher-toggle-loading',
                        isChecked
                            ? 'switcher-checked-loading'
                            : 'switcher-uncheck-loading',
                    )}
                />
            ) : (
                <div className="switcher-toggle" />
            )}
            <span className="switcher-content">
                {isChecked ? checkedContent : unCheckedContent}
            </span>
        </label>
    )
}

export default Switcher
