import AddBoxIcon from '@mui/icons-material/AddBox';
import { IconButton, IconButtonProps } from '@mui/material';

export const logoWidth = 180;

export const AddButton = ({ ...props }: IconButtonProps) => {
    return (
        <IconButton size='large' {...props}>
            <AddBoxIcon fontSize='large' />
        </IconButton>
    );
};
