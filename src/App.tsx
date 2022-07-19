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

import { CanvasElements, MainPanel } from './MainPanel';
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
	boardExceptionMessage: string;
	behaviourTree: BehaviourTree | null;
	behaviourTreeExceptionMessage: string;
	behaviourTreePlayInterval: NodeJS.Timer | null;
	canvasElements: CanvasElements;
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
			boardExceptionMessage: "",
			behaviourTree: null,
			behaviourTreeExceptionMessage: "",
			behaviourTreePlayInterval: null,
			canvasElements: { nodes: [], edges: [] }
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
							<DefinitionTab 
								value={this.state.definiton} 
								onChange={this._onDefinitionChange} 
								errorMessage={this.state.behaviourTreeExceptionMessage}
								readOnly={!!this.state.behaviourTreePlayInterval}
							/>
						)}
						{this.state.activeSidebarTab === SidebarTab.Board && (
							<BoardTab 
								value={this.state.board} 
								onChange={this._onBoardChange}
								errorMessage={this.state.boardExceptionMessage}
								readOnly={!!this.state.behaviourTreePlayInterval}
							/>
						)}
					</Grid>
					<Grid item xs={8}>
						<MainPanel 
							elements={this.state.canvasElements}
							showPlayButton={!!this.state.behaviourTree && !this.state.behaviourTreePlayInterval}
							showReplayButton={!!this.state.behaviourTreePlayInterval}
							showStopButton={!!this.state.behaviourTreePlayInterval}
							onPlayButtonClick={() => this._onPlayButtonPressed()}
							onReplayButtonClick={() => this._onPlayButtonPressed()}
							onStopButtonClick={() => this._onStopButtonPressed()}
						/>
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
		let behaviourTreeExceptionMessage = "";
		let canvasElements: CanvasElements = { nodes: [], edges: [] };
		
		try {
			// Try to create the behaviour tree.
			const behaviourTreeVal = new BehaviourTree(definition, {} /** We don't need aboard here as we are only validating the definition. */);

			canvasElements = this._parseNodesAndConnectors((behaviourTreeVal as any).getFlattenedNodeDetails());
		} catch (error) {
			behaviourTreeExceptionMessage = `${(error as any).message}`;
		}
		
		const behaviourTree = this._createTreeInstance(definition, this.state.board);

		this.setState({ 
			definiton: definition,
			behaviourTreeExceptionMessage: behaviourTreeExceptionMessage,
			canvasElements: canvasElements,
			behaviourTree: behaviourTree
		 });
	}

	/**
	 * Handles a change of board.
	 * @param board 
	 */
	private _onBoardChange(board: string): void {
		let boardExceptionMessage = "";

		try {
			// Try to create the blackboard.
			(new Function(`return (${board});`))();
		} catch (error) {
			boardExceptionMessage = `${(error as any).message}`;
		}

		const behaviourTree = this._createTreeInstance(this.state.definiton, board);

		this.setState({ 
			board: board,
			boardExceptionMessage: boardExceptionMessage,
			behaviourTree: behaviourTree
		});
	}

	private _createTreeInstance(definition: string, board: string): BehaviourTree | null {
		try {
			// Create the board object.
			const boardObject = (new Function(`return (${board});`))();

			const behaviourTree = new BehaviourTree(definition, boardObject);

			return behaviourTree;
		} catch (error) {
			return null;
		}
	}

	private _parseNodesAndConnectors(flattenedNodeDetails: FlattenedNode[]): CanvasElements {
		let result: CanvasElements = { nodes: [], edges: [] };

		flattenedNodeDetails.forEach((flattenedNode) => {
			result.nodes.push({
				id: flattenedNode.id,
				caption: flattenedNode.caption,
				state: flattenedNode.state,
				variant: "default"
			} as any);

			let variant;

			if (flattenedNode.parentId) {
				let variant;
				
				switch (flattenedNode.state) {
					case State.RUNNING:
						variant = "active";
						break;
	
					case State.SUCCEEDED:
						variant = "succeeded";
						break;
	
					default:
						variant = "default";
				}

				result.edges.push({
					id: `${flattenedNode.parentId}_${flattenedNode.id}`,
					from: flattenedNode.parentId,
					to: flattenedNode.id,
					variant
				});
			}
		});

		return result;
	}

	private _onPlayButtonPressed(): void {
		const { behaviourTree } = this.state;

		// There is nothing to de if we have no behaviour tree instance.
		if (!behaviourTree) {
			return;
		}

		// Reset the tree.
		behaviourTree.reset();

		// Clear any existing interval.
		if (this.state.behaviourTreePlayInterval) {
			clearInterval(this.state.behaviourTreePlayInterval);
		}

		// Create an interval to step the tree until it is finished.
		const playInterval = setInterval(() => {
			// Step the behaviour tree, if anything goes wrong we will stop the tree playback.
			try {
				behaviourTree.step();
			} catch (exception) {
				// Clear the interval.
				clearInterval(playInterval);
				this.setState({ behaviourTreePlayInterval: null });

				// Notify the user of the exception.
				alert(exception);
			}

			// If the tree root is in a finished state then stop the interval.
			if (!behaviourTree.isRunning()) {
				// Clear the interval.
				clearInterval(playInterval);
				this.setState({ behaviourTreePlayInterval: null });
			}

			this.setState({ canvasElements: this._parseNodesAndConnectors((behaviourTree as any).getFlattenedNodeDetails()) });
		}, 100);

		this.setState({ behaviourTreePlayInterval: playInterval });
	}

	private _onStopButtonPressed(): void {
		const { behaviourTree, behaviourTreePlayInterval } = this.state;

		behaviourTree?.reset();

		if (behaviourTreePlayInterval) {
			clearInterval(behaviourTreePlayInterval);
		}

		this.setState({ 
			behaviourTreePlayInterval: null,
			canvasElements: behaviourTree ? this._parseNodesAndConnectors((behaviourTree as any).getFlattenedNodeDetails()) : { nodes: [], edges: [] }
		});
	}
}