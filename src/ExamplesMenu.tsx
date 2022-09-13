import * as React from 'react';

import MenuIcon from "mdi-material-ui/Menu";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton/IconButton';
import MenuList from '@mui/material/MenuList/MenuList';
import Divider from '@mui/material/Divider/Divider';
import Typography from '@mui/material/Typography/Typography';

import { Example, ExampleCategory, Examples } from './Examples';

export type ExamplesMenuProps = {
    onExampleSelected(example: Example): void;
};

export const ExamplesMenu: React.FunctionComponent<ExamplesMenuProps> = ({ onExampleSelected }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);;
    const handleClose = () => setAnchorEl(null);

    const onExampleClick = (example: Example) => {
        setAnchorEl(null);
        onExampleSelected(example);
    };

    const getExampleListItemsForCategory = (category: ExampleCategory) => Examples
        .filter((example) => example.category === category)
        .map((example) => <MenuItem dense onClick={() => onExampleClick(example)}>{example.caption}</MenuItem>)

    return (
        <div>
            <IconButton 
                size="large"
                edge="start"
                color="inherit"
                onClick={handleClick}>
                <MenuIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}>
                <MenuList dense>
                    {getExampleListItemsForCategory("misc")}
                </MenuList>
                <Divider/>
                <Typography style={{ marginLeft: "5px"}} variant="caption">{"Leaves"}</Typography>
                <MenuList dense>
                    {getExampleListItemsForCategory("leaf")}
                </MenuList>
                <Divider/>
                <Typography style={{ marginLeft: "5px"}} variant="caption">{"Composites"}</Typography>
                <MenuList dense>
                    {getExampleListItemsForCategory("composite")}
                </MenuList>
                <Divider/>
                <Typography style={{ marginLeft: "5px"}} variant="caption">{"Decorators"}</Typography>
                <MenuList dense>
                    {getExampleListItemsForCategory("decorator")}
                </MenuList>
                <Divider/>
                <Typography style={{ marginLeft: "5px"}} variant="caption">{"Guards and Callbacks"}</Typography>
                <MenuList dense>
                    {getExampleListItemsForCategory("guard-callback")}
                </MenuList>
            </Menu>
        </div>
    );
}