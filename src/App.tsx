import * as React from 'react';
import { State, BehaviourTree } from "mistreevous";
import { toast, ToastContainer } from 'react-toastify';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import GithubIcon from "mdi-material-ui/Github";
import MenuIcon from "mdi-material-ui/Menu";

import mistreevousIcon from './icons/mistreevous_icon_white.png'; 

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';

import { CanvasElements, MainPanel } from './MainPanel';
import { BoardTab } from './BoardTab';
import { DefinitionTab } from './DefinitionTab';
import { ExamplesMenu } from './ExamplesMenu';
import { Example } from './Examples';

export type FlattenedNode = {
	id: string;
	caption: string;
	parentId: string | null;
	type: string;
	state: State;
	arguments: FlattenedNodeFunctionArgument[];
	decorators: (FlattenedNodeGuard | FlattenedNodeCallback)[];
}

export type FlattenedNodeGuard = {
	isGuard: true;
	condition: { value: string };
	arguments: FlattenedNodeFunctionArgument[];
	type: "while" | "until";
}

export type FlattenedNodeCallback = {
	isGuard: false;
	functionName: { value: string };
	arguments: FlattenedNodeFunctionArgument[];
	type: "entry" | "exit" | "step";
}

export type FlattenedNodeFunctionArgument = {
	value: string;
	type: "string" | "number" | "boolean" | "null";
}

export enum SidebarTab { Definition = 0, Board = 1 };

/**
 * The App component state.
 */
export type AppState = {
	layoutId: string | null;
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
			layoutId: null,
			activeSidebarTab: SidebarTab.Definition,
			definiton: "",
			board: "class Board {}",
			boardExceptionMessage: "",
			behaviourTree: null,
			behaviourTreeExceptionMessage: "",
			behaviourTreePlayInterval: null,
			canvasElements: { nodes: [], edges: [] }
		};

		this._onDefinitionChange = this._onDefinitionChange.bind(this);
		this._onBoardChange = this._onBoardChange.bind(this);
		this._onExampleSelected = this._onExampleSelected.bind(this);
	}

	/**
	 * Renders the component.
	 */
	public render(): React.ReactNode {
		const isSidebarReadOnly = !!this.state.behaviourTreePlayInterval;

		return (
			<Box className="app-box">
				<AppBar position="static">
					<Toolbar variant="dense">
						<img className="mistreevous-icon" src={mistreevousIcon} />
						<ExamplesMenu onExampleSelected={this._onExampleSelected} />
						<Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
						<IconButton size="large" edge="end" color="inherit" href="https://github.com/nikkorn/mistreevous">
							<GithubIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
				<Grid container sx={{ flexGrow: 1 }}>
					<Grid container item className={`sidebar ${isSidebarReadOnly ? "read-only" : ""}`} xs={4} direction="column">
						<DefinitionTab 
							value={this.state.definiton} 
							onChange={this._onDefinitionChange} 
							errorMessage={this.state.behaviourTreeExceptionMessage}
							readOnly={!!this.state.behaviourTreePlayInterval}
						/>
						<BoardTab 
							value={this.state.board} 
							onChange={this._onBoardChange}
							errorMessage={this.state.boardExceptionMessage}
							readOnly={!!this.state.behaviourTreePlayInterval}
						/>
					</Grid>
					<Grid item xs={8}>
						<MainPanel
							layoutId={this.state.layoutId}
							elements={this.state.canvasElements}
							showPlayButton={!!this.state.behaviourTree && !this.state.behaviourTreePlayInterval}
							showReplayButton={!!this.state.behaviourTreePlayInterval}
							showStopButton={!!this.state.behaviourTreePlayInterval}
							onPlayButtonClick={() => this._onPlayButtonPressed()}
							onReplayButtonClick={() => this._onPlayButtonPressed()}
							onStopButtonClick={() => this._onStopButtonPressed()}
						/>
						<ToastContainer />
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
	 * Handles a change of board class definition.
	 * @param board 
	 */
	private _onBoardChange(boardClassDefinition: string): void {
		let boardExceptionMessage = "";

		try {
			// Attempt to create a board instance, we just want to know if we can.
			this._createBoardInstance(boardClassDefinition);
		} catch (error) {
			boardExceptionMessage = `${(error as any).message}`;
		}

		const behaviourTree = this._createTreeInstance(this.state.definiton, boardClassDefinition);

		this.setState({ 
			board: boardClassDefinition,
			boardExceptionMessage: boardExceptionMessage,
			behaviourTree: behaviourTree
		});
	}

	/**
	 * Handles an example being selected.
	 * @param example The selected example.
	 */
	private _onExampleSelected(example: Example): void {
		const behaviourTree = this._createTreeInstance(example.definition, example.board);
		const canvasElements = this._parseNodesAndConnectors((behaviourTree as any).getFlattenedNodeDetails());

		this.setState({
			layoutId: example.caption,
			definiton: example.definition,
			board: example.board,
			behaviourTree,
			canvasElements
		});
	}

	/**
	 * Creates the behaviour tree instance.
	 * @param definition 
	 * @param board 
	 * @returns The behaviour tree instance.
	 */
	private _createTreeInstance(definition: string, boardClassDefinition: string): BehaviourTree | null {
		try {
			// Create the board object.
			const board = this._createBoardInstance(boardClassDefinition);

			const behaviourTree = new BehaviourTree(definition, board);

			return behaviourTree;
		} catch (error) {
			return null;
		}
	}

	/**
	 * Creates an instance of a board based on the class definition provided.
	 * @param boardClassDefinition The board class definition.
	 * @returns An instance of a board based on the class definition provided.
	 */
	private _createBoardInstance(boardClassDefinition: string): any {
		const boardClassCreator = new Function("State", "getStringValue", "getNumberValue", "getBooleanValue", "showErrorToast", "showInfoToast", `return ${boardClassDefinition};`);

		const getStringValue = (message: string) => window.prompt(message);
		const getNumberValue = (message: string) => parseFloat(window.prompt(message) as string);
		const getBooleanValue = (message: string) => window.confirm(`${message}. (Ok=true Cancel=false)`);
		const showErrorToast = (message: string) => toast.error(message);
		const showInfoToast = (message: string) => toast.info(message);

		const boardClass = boardClassCreator(State ,getStringValue, getNumberValue, getBooleanValue, showErrorToast, showInfoToast);

		const boardInstance = new boardClass();

		return boardInstance;
	}

	/**
	 * Parse the nodes and connectors.
	 * @param flattenedNodeDetails 
	 * @returns The parsed nodes and connectors.
	 */
	private _parseNodesAndConnectors(flattenedNodeDetails: FlattenedNode[]): CanvasElements {
		let result: CanvasElements = { nodes: [], edges: [] };

		flattenedNodeDetails.forEach((flattenedNode) => {
			result.nodes.push({
				id: flattenedNode.id,
				caption: flattenedNode.caption,
				state: flattenedNode.state,
				type: flattenedNode.type,
				args: flattenedNode.arguments,
				callbacks: (flattenedNode.decorators || []).filter((decorator) => !decorator.isGuard).map((decorator) => {
					return {
						type: decorator.type,
						functionName: (decorator as FlattenedNodeCallback).functionName.value,
						args: decorator.arguments
					}
				}),
				guards: (flattenedNode.decorators || []).filter((decorator) => decorator.isGuard).map((decorator) => {
					return {
						type: decorator.type,
						functionName: (decorator as FlattenedNodeGuard).condition.value,
						args: decorator.arguments
					}
				}),
				variant: "default"
			} as any);

			if (flattenedNode.parentId) {
				let variant;
				
				switch (flattenedNode.state) {
					case State.RUNNING:
						variant = "active";
						break;
	
					case State.SUCCEEDED:
						variant = "succeeded";
						break;
					
					case State.FAILED:
						variant = "failed";
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
		const { behaviourTree, behaviourTreePlayInterval } = this.state;

		// There is nothing to de if we have no behaviour tree instance.
		if (!behaviourTree) {
			return;
		}

		// Reset the tree.
		behaviourTree.reset();

		// Clear any existing interval.
		if (behaviourTreePlayInterval) {
			clearInterval(behaviourTreePlayInterval);
		}

		// Create an interval to step the tree until it is finished.
		const playInterval = setInterval(() => {
			// Step the behaviour tree, if anything goes wrong we will stop the tree playback.
			try {
				behaviourTree.step();
			} catch (exception: any) {
				// Clear the interval.
				clearInterval(playInterval);
				this.setState({ behaviourTreePlayInterval: null });

				// Reset the tree.
				behaviourTree.reset();

				// Notify the user of the exception via a toast.
				toast.error(exception.toString());
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