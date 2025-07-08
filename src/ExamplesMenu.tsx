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
        .map((example, index) => <MenuItem key={index} dense style={{ padding: "0px 16px"}} onClick={() => onExampleClick(example)}>{example.caption}</MenuItem>)

    return (
        <div className="examples-menu">
            <IconButton 
                size="small"
                edge="start"
                color="inherit"
                onClick={handleClick}>
                <MenuIcon fontSize='small'/>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}>
                <MenuList dense style={{ padding: "0px"}}>
                    {getExampleListItemsForCategory("advanced")}
                </MenuList>
                <Divider/>
                <Typography style={{ marginLeft: "5px"}} variant="caption">{"Leaves"}</Typography>
                <MenuList dense style={{ padding: "0px"}}>
                    {getExampleListItemsForCategory("leaf")}
                </MenuList>
                <Divider/>
                <Typography style={{ marginLeft: "5px"}} variant="caption">{"Composites"}</Typography>
                <MenuList dense style={{ padding: "0px"}}>
                    {getExampleListItemsForCategory("composite")}
                </MenuList>
                <Divider/>
                <Typography style={{ marginLeft: "5px"}} variant="caption">{"Decorators"}</Typography>
                <MenuList dense style={{ padding: "0px"}}>
                    {getExampleListItemsForCategory("decorator")}
                </MenuList>
                <Divider/>
                <Typography style={{ marginLeft: "5px"}} variant="caption">{"Misc"}</Typography>
                <MenuList dense style={{ padding: "0px"}}>
                    {getExampleListItemsForCategory("misc")}
                </MenuList>
            </Menu>
        </div>
    );
}