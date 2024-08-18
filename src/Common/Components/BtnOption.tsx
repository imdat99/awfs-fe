import { ArrowDropDown } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
    Button,
    ButtonGroup,
    ClickAwayListener,
    Grow,
    MenuItem,
    MenuList,
    Paper,
    Popper
} from '@mui/material'
import React from 'react'

export interface BtnOptionProps {
    loading: boolean;
    disabled: boolean
    options: { label: string,
        value: string, }[]
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> ,index: number, value: string) => void
}
const BtnOption: React.FC<BtnOptionProps> = ({loading, options, onClick, disabled}) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const [open, setOpen] = React.useState(false)
    const anchorRef = React.useRef<HTMLDivElement>(null)
    const handleToggle = () => {
        console.log('handleToggle')
        setOpen((prevOpen) => !prevOpen)
    }
    const handleClose = (event: Event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return
        }

        setOpen(false)
    }
    const handleMenuItemClick = (
        _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index)
        setOpen(false)
    }
    return (
        <React.Fragment>
            <ButtonGroup
                disabled={disabled}
                variant="contained"
                ref={anchorRef}
                aria-label="Button group with a nested menu"
            >
                <LoadingButton
                    loading={loading}
                    onClick={(e) => {
                        if (onClick) {
                            onClick(e, selectedIndex, options[selectedIndex].value)
                        }
                    }}>{options[selectedIndex].label}</LoadingButton>
                <Button
                    size="small"
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                >
                    <ArrowDropDown />
                </Button>
            </ButtonGroup>
            {options.length > 1 && (
                <Popper
                    sx={{
                        zIndex: 1000,
                    }}
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin:
                                placement === 'bottom'
                                    ? 'center top'
                                    : 'center bottom',
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList id="split-button-menu" autoFocusItem>
                                        {options.map((option, index) => (
                                            <MenuItem
                                                key={option.value}
                                                selected={index === selectedIndex}
                                                onClick={(event) =>
                                                    handleMenuItemClick(
                                                        event,
                                                        index,
                                                    )
                                                }
                                            >
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            )}
        </React.Fragment>
    )
}

export default BtnOption
