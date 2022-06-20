import * as React from 'react';
import { useState } from 'react';
import { State, BehaviourTree } from "mistreevous";

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

import { MainPanel, ReactFlowElements } from './MainPanel';
import { BoardTab } from './BoardTab';
import { DefinitionTab } from './DefinitionTab';

export type FlattenedNode = {
	id: string;
	caption: string;
	parentId: string | null;
	type: string;
	state: State;
}

export enum SidebarTab { Definition = 0, Board = 1 };

/**
 * The App component state.
 */
export type AppState = {
	activeSidebarTab: SidebarTab;
	definiton: string;
	board: string;
	behaviourTree: BehaviourTree | null;
	reactFlowElements: ReactFlowElements;
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
			board: "{}",
			behaviourTree: null,
			reactFlowElements: { nodes: [], edges: [] }
		};

		this._onDefinitionChange = this._onDefinitionChange.bind(this);
		this._onBoardChange = this._onBoardChange.bind(this);
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
							{"Mistreevous Editor"}
						</Typography>
						<IconButton size="large" edge="end" color="inherit" href="https://github.com/nikkorn/mistreevous">
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
							<DefinitionTab value={this.state.definiton} onChange={this._onDefinitionChange} />
						)}
						{this.state.activeSidebarTab === SidebarTab.Board && (
							<BoardTab value={this.state.board} onChange={this._onBoardChange} />
						)}
					</Grid>
					<Grid item xs={8}>
						<MainPanel elements={this.state.reactFlowElements} />
					</Grid>
				</Grid>
			</Box>
		);
	}

	/**
	 * Handles a change of definition.
	 * @param definition 
	 */
	private _onDefinitionChange(definition: string): void {
		let behaviourTree;
		let reactFlowElements: ReactFlowElements = { nodes: [], edges: [] };
		
		try {
			// Try to create the behaviour tree.
			behaviourTree = new BehaviourTree(definition, {} /** TODO Stick the board here (new Function vs eval) */);

			reactFlowElements = this._parseNodesAndConnectors((behaviourTree as any).getFlattenedNodeDetails());
		} catch (exception) {
			// There was an error creating the behaviour tree!
			behaviourTree = null;

			console.log(exception);
		}
		
		this.setState({ 
			definiton: definition,
			behaviourTree: behaviourTree,
			reactFlowElements: reactFlowElements
		 });
	}

	private _onBoardChange(board: string): void {
		this.setState({ board: board });
	}

	private _parseNodesAndConnectors(flattenedNodeDetails: FlattenedNode[]): ReactFlowElements {
		let result: ReactFlowElements = { nodes: [], edges: [] };

		flattenedNodeDetails.forEach((flattenedNode) => {
			result.nodes.push({
				id: flattenedNode.id,
				data: {
					label: flattenedNode.caption
				},
				position: { x: 0, y: 0 }
			});

			if (flattenedNode.parentId) {
				result.edges.push({
					id: `${flattenedNode.parentId}_${flattenedNode.id}`,
					source: flattenedNode.parentId,
					target: flattenedNode.id
				});
			}
		});

		return result;
	}
}