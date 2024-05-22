import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Popper from '@mui/material/Popper';
import { useRef, useState } from 'react';
import Paper from '@mui/material/Paper';
import Grow from '@mui/material/Grow';

import { BorderedButtonWithIcon } from 'components/atoms/sharedStyledComponents/BorderedButtonWithIcon';

const options = ['extention_1', 'extention_2', 'extention_3'];

function DropdownIcon({ handleOpen }: { handleOpen: () => void }) {

    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);

    const handleClick = (option: string) => {
        console.info(`You clicked ${option}`);
        handleOpen()
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) return;
        setOpen(false);
    };

    return (
        <>
            <div
                ref={anchorRef}
            >
                <BorderedButtonWithIcon
                    size="small"
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                    color="neutral"
                    variant="outlined"
                    startIcon={<AutoAwesomeIcon />}
                    endIcon={<ArrowDropDownIcon />}
                >
                    Extentions
                </BorderedButtonWithIcon>
            </div>
            <Popper
                sx={{
                    zIndex: 1,
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
                                placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu" autoFocusItem>
                                    {options.map((option, index) => (
                                        <MenuItem
                                            key={option}
                                            disabled={index === 2}
                                            onClick={() => handleClick(option)}
                                        >
                                            {option}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
}

export default DropdownIcon;
