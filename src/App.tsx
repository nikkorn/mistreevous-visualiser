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
 * The App component state.
 */
export type AppState = {
	activeSidebarTab: SidebarTab;
	definiton: string;
	board: string;
}


/**
 * The App component.
 */
export class App extends React.Component<{}, AppState> {
	/**
	 * Creates the App element.
	 * @param props The control properties.
	 */
	public constructor(props: any) {
		super(props);

		// Set the initial state for the component.
		this.state = {
			activeSidebarTab: SidebarTab.Definition,
			definiton: "",
			board: "{}"
		};
	}

	/**
	 * Renders the component.
	 */
	public render(): React.ReactNode {
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
							<Tabs variant="fullWidth" value={this.state.activeSidebarTab} onChange={(event, value: SidebarTab) => this.setState({ activeSidebarTab: value })}>
								<Tab label="Definition" />
								<Tab label="Board" />
							</Tabs>
						</Box>
						{this.state.activeSidebarTab === SidebarTab.Definition && (
							<DefinitionTab />
						)}
						{this.state.activeSidebarTab === SidebarTab.Board && (
							<BoardTab value={this.state.board} onChange={(value) => this.setState({ board: value })} />
						)}
					</Grid>
					<Grid item xs={8}>
						<MainPanel />
					</Grid>
				</Grid>
			</Box>
		);
	}
}