import * as React from 'react';
import { State, BehaviourTree, convertMDSLToJSON, validateDefinition, BehaviourTreeOptions, NodeDetails } from "mistreevous";
import { toast, ToastContainer } from 'react-toastify';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import GithubIcon from "mdi-material-ui/Github";
import mistreevousIcon from './icons/mistreevous-logo.png';  

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

import { CanvasElements, MainPanel } from './MainPanel';
import { AgentTab } from './AgentTab';
import { DefinitionTab } from './DefinitionTab';
import { Example, Examples } from './Examples';

export enum SidebarTab { Definition = 0, Board = 1 };

export enum DefinitionType { None = 0, MDSL = 1, JSON = 2 };

/**
 * The App component state.
 */
export type AppState = {
	layoutId: string | null;
	activeSidebarTab: SidebarTab;
	definition: string;
	definitionType: DefinitionType;
	agent: string;
	agentExceptionMessage: string;
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
			definition: "",
			definitionType: DefinitionType.None,
			agent: "class Agent {}",
			agentExceptionMessage: "",
			behaviourTree: null,
			behaviourTreeExceptionMessage: "",
			behaviourTreePlayInterval: null,
			canvasElements: { nodes: [], edges: [] }
		};

		this._onDefinitionChange = this._onDefinitionChange.bind(this);
		this._onAgentChange = this._onAgentChange.bind(this);
		this._onExampleSelected = this._onExampleSelected.bind(this);
		this._convertDefinitonToJson = this._convertDefinitonToJson.bind(this);
	}

	/**
	 * Renders the component.
	 */
	public render(): React.ReactNode {
		const isSidebarReadOnly = !!this.state.behaviourTreePlayInterval;

		return (
			<Box className="app-box">
				<Grid container sx={{ flexGrow: 1 }}>
					<Grid container item className={`sidebar ${isSidebarReadOnly ? "read-only" : ""}`} xs={12} sm={4} xl={3} direction="column">
						<Grid item container className="sidebar-header" alignContent={"flex-end"}>
							<img className="mistreevous-icon" src={mistreevousIcon} />
							<IconButton className="github-icon" size="large" edge="end" color="inherit" href="https://github.com/nikkorn/mistreevous">
								<GithubIcon />
							</IconButton>
						</Grid>
						<Card style={{ margin: "6px", flexGrow: 1 }} elevation={3}>
							<DefinitionTab 
								definition={this.state.definition} 
								definitionType={this.state.definitionType}
								onChange={this._onDefinitionChange} 
								errorMessage={this.state.behaviourTreeExceptionMessage}
								readOnly={!!this.state.behaviourTreePlayInterval}
								onExampleSelected={this._onExampleSelected}
								onConvertButtonPress={this._convertDefinitonToJson}
							/>
						</Card>
						<Card style={{ margin: "6px", flexGrow: 1 }} elevation={3}>
							<AgentTab 
								value={this.state.agent} 
								onChange={this._onAgentChange}
								errorMessage={this.state.agentExceptionMessage}
								readOnly={!!this.state.behaviourTreePlayInterval}
							/>
						</Card>
					</Grid>
					<Grid item xs={12} sm={8} xl={9} >
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
	 * Runs after the first render() lifecycle.
	 */
	public componentDidMount() {
		const currentUrl = new URL(window.location.href);
		const exampleParamValue = currentUrl.searchParams.get("example");

		if (exampleParamValue) {
			const example = Examples.find((item) => item.name === exampleParamValue);
			if (example) {
				setTimeout(() => this._onExampleSelected(example), 10);
			}
		}
	}

	/**
	 * Handles a change of definition.
	 * @param definition The changed definition.
	 */
	private _onDefinitionChange(definition: string, agent?: string): void {
		let behaviourTree = null;
		let behaviourTreeExceptionMessage = "";
		let canvasElements: CanvasElements = { nodes: [], edges: [] };

		// Get the type of the definition.
		const definitionType = this._getDefinitionType(definition);

		// Let's try to validate our definition.
		const validationResult = validateDefinition(definitionType === DefinitionType.JSON ? JSON.parse(definition) : definition);

		if (validationResult.succeeded) {
			try {
				// Create the behaviour tree!
				behaviourTree = this._createTreeInstance(
					definitionType === DefinitionType.JSON ? JSON.parse(definition) : definition,
					agent ?? this.state.agent
				);

				// Create the canvas elements based on the built tree.
				canvasElements = this._createCanvasElements(behaviourTree!.getTreeNodeDetails());
			} catch (error) {
				// We failed to build the tree instance.
				behaviourTreeExceptionMessage = `${error}`;
			}
		} else {
			// The definition was not valid.
			behaviourTreeExceptionMessage = validationResult.errorMessage!;
		}

		this.setState({ 
			definition,
			definitionType,
			behaviourTreeExceptionMessage,
			canvasElements: canvasElements,
			behaviourTree: behaviourTree
		 });
	}

	/**
	 * Handles a change of agent class definition.
	 * @param agentClassDefinition The agent class definition.
	 */
	private _onAgentChange(agentClassDefinition: string): void {
		let boardExceptionMessage = "";

		try {
			// Attempt to create a board instance, we just want to know if we can.
			this._createBoardInstance(agentClassDefinition);
		} catch (error) {
			boardExceptionMessage = `${(error as any).message}`;
		}

		let behaviourTree = null;

		try {
			behaviourTree = this._createTreeInstance(this.state.definition, agentClassDefinition);
		} catch {}

		this.setState({ 
			agent: agentClassDefinition,
			agentExceptionMessage: boardExceptionMessage,
			behaviourTree: behaviourTree
		});
	}

	/**
	 * Handles an example being selected.
	 * @param example The selected example.
	 */
	private _onExampleSelected(example: Example): void {
		this._onAgentChange(example.board);
		this._onDefinitionChange(example.definition, example.board);
		this.setState({ layoutId: example.name });
	}

	/**
	 * Handles an example being selected.
	 * @param example The selected example.
	 */
	private _convertDefinitonToJson(): void {
		// Convert the current definition, which we are assuming is valid MDSL, to JSON.
		const result = convertMDSLToJSON(this.state.definition);

		this._onDefinitionChange(JSON.stringify(result.length === 1 ? result[0] : result, null, 4));
	}

	/**
	 * Creates the behaviour tree instance.
	 * @param definition 
	 * @param board 
	 * @returns The behaviour tree instance.
	 */
	private _createTreeInstance(definition: string, boardClassDefinition: string): BehaviourTree | null {
		// Create the board object.
		const board = this._createBoardInstance(boardClassDefinition);

		const options: BehaviourTreeOptions = {
			// We are calling step() every 100ms in this class so a delta of 0.1 should match what we expect.
			getDeltaTime: () => 0.1
		};

		const behaviourTree = new BehaviourTree(definition, board, options);

		return behaviourTree;
	}

	/**
	 * Creates an instance of a board based on the class definition provided.
	 * @param boardClassDefinition The board class definition.
	 * @returns An instance of a board based on the class definition provided.
	 */
	private _createBoardInstance(boardClassDefinition: string): any {
		const boardClassCreator = new Function("BehaviourTree", "State", "getStringValue", "getNumberValue", "getBooleanValue", "showErrorToast", "showInfoToast", `return ${boardClassDefinition};`);

		const getStringValue = (message: string) => window.prompt(message);
		const getNumberValue = (message: string) => parseFloat(window.prompt(message) as string);
		const getBooleanValue = (message: string) => window.confirm(`${message}. (Ok=true Cancel=false)`);
		const showErrorToast = (message: string) => toast.error(message);
		const showInfoToast = (message: string) => toast.info(message);

		const boardClass = boardClassCreator(BehaviourTree, State, getStringValue, getNumberValue, getBooleanValue, showErrorToast, showInfoToast);

		const boardInstance = new boardClass();

		return boardInstance;
	}

	/**
	 * Parse the nodes and connectors.
	 * @param flattenedNodeDetails 
	 * @returns The parsed nodes and connectors.
	 */
	private _createCanvasElements(rootNodeDetails: NodeDetails): CanvasElements {
		let result: CanvasElements = { nodes: [], edges: [] };

		const processNodeDetails = (node: NodeDetails, parentId?: string) => {
			result.nodes.push({
				id: node.id,
				caption: node.name,
				state: node.state,
				type: node.type,
				args: node.args ?? [],
				whileGuard: node.while,
				untilGuard: node.until,
				entryCallback: node.entry,
				stepCallback: node.step,
				exitCallback: node.exit,
				variant: "default"
			} as any);

			if (parentId) {
				let variant;
				
				switch (node.state) {
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
					id: `${parentId}_${node.id}`,
					from: parentId,
					to: node.id,
					variant
				});
			}

			(node.children ?? []).forEach((child) => processNodeDetails(child, node.id));
		};

		processNodeDetails(rootNodeDetails);

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

			this.setState({ canvasElements: this._createCanvasElements(behaviourTree.getTreeNodeDetails()) });
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
			canvasElements: behaviourTree ? this._createCanvasElements(behaviourTree.getTreeNodeDetails()) : { nodes: [], edges: [] }
		});
	}

	private _getDefinitionType(definition: string): DefinitionType {
		if (!definition) {
			return DefinitionType.None;
		}

		// Lets see if its valid MDSL.
		try {
			// Try to convert our definition to JSON, assuming that it is MDSL.
			convertMDSLToJSON(definition);

			// It worked! We can assume that this definition is valid MDSL!
			return DefinitionType.MDSL;
		} catch {
			// It wasn't MDSL.
		}

		// Lets see if it's valid JSON.
		try {
			// Try to convert our definition to JSON.
			JSON.parse(definition);

			// It worked! We can assume that this definition is valid JSON!
			return DefinitionType.JSON;
		} catch {
			// It wasn't JSON.
		}

		return DefinitionType.None;
	}
}