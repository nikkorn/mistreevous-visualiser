import * as React from 'react';
import { useState } from 'react';

import './App.css';

import GithubIcon from "mdi-material-ui/Github";
import MenuIcon from "mdi-material-ui/Menu";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';

import { MainPanel } from './MainPanel';
import { BoardTab } from './BoardTab';
import { DefinitionTab } from './DefinitionTab';

export enum SidebarTab { Definition = 0, Board = 1 };

/**
 * The App component.
 */
export const App: React.FunctionComponent = () => {
  const [activeSidebarTab, setActiveSidebarTab] = useState(SidebarTab.Definition);

  return (
    <Box className="app-box">
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {"Title"}
          </Typography>
          <IconButton size="large" edge="end" color="inherit">
            <GithubIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Grid container sx={{ flexGrow: 1 }}>
        <Grid item className="sidebar" xs={4}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs variant="fullWidth" value={activeSidebarTab} onChange={(event, value: SidebarTab) => setActiveSidebarTab(value)}>
              <Tab label="Definition" />
              <Tab label="Board" />
            </Tabs>
          </Box>
          {activeSidebarTab === SidebarTab.Definition && (
            <DefinitionTab/>
          )}
          {activeSidebarTab === SidebarTab.Board && (
            <BoardTab/>
          )}
        </Grid>
        <Grid item xs={8}>
          <MainPanel/>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
