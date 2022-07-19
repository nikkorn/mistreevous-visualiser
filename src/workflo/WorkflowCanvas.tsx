import React from 'react';

import { Node } from './Node';
import { NodeContainer } from './NodeContainer';
import { ConnectorType, NodeType, NodeWithChildren } from './workflo';

import './WorkflowCanvas.css';

export type WorkflowCanvasInstance = {
	fit(): void;
}

/**
 * The WorkflowCanvas component props.
 */
export type WorkflowCanvasProps = {
	nodes: NodeType[];
	connectors: ConnectorType[];
	nodeComponents: { [key: string]: React.ClassType<any, any, any> };
	connectorComponents: { [key: string]: React.ClassType<any, any, any> };
	onInitalise?(instance: WorkflowCanvasInstance): void;
	onUpdate?(): void;
}

/**
 * The WorkflowCanvas component state.
 */
export type WorkflowCanvasState = {
	translateX: number;
	translateY: number;
	scale: number;
}

/**
 * The WorkflowCanvas component.
 */
export class WorkflowCanvas extends React.Component<WorkflowCanvasProps, WorkflowCanvasState> {
	/** A reference to the canvas wrapper. */
	private readonly _canvasWrapperRef: React.RefObject<HTMLDivElement>;

	/** A reference to root nodes container. */
	private readonly _rootNodesContainerRef: React.RefObject<HTMLDivElement>;

	/** The last canvas drag position. */
	private _lastCanvasDragPosition: { x: number, y: number } | null = null;

	/**
     * Creates the WorkflowCanvas element.
     * @param props The component properties.
     */
	public constructor(props: WorkflowCanvasProps) {
        super(props);

		this._canvasWrapperRef = React.createRef();
		this._rootNodesContainerRef = React.createRef();

        // Set the initial state for the component.
        this.state = {
			translateX: 0,
			translateY: 0,
			scale: 1
        };

		this._onCanvasWrapperWheel = this._onCanvasWrapperWheel.bind(this);
		this._onCanvasMouseDown = this._onCanvasMouseDown.bind(this);
		this._onCanvasMouseMove = this._onCanvasMouseMove.bind(this);

		props.onInitalise?.(this._getInstanceObject());
    }

	/**
	 * Renders the component.
	 */
	public render(): React.ReactNode {
		const nestedRootNodes = WorkflowCanvas._getNestedRootNodes(this.props.nodes, this.props.connectors);

		return (
			<div ref={this._canvasWrapperRef} className="workflow-canvas-wrapper" 
				onWheel={this._onCanvasWrapperWheel}
				onMouseDown={this._onCanvasMouseDown}
				onMouseMove={this._onCanvasMouseMove}
				onMouseUp={() => this._lastCanvasDragPosition = null}
				onMouseLeave={() => this._lastCanvasDragPosition = null}>
				<div className="workflow-canvas">
					<svg className="workflow-canvas-background-svg">
						<pattern id="canvas-pattern-background" x={this.state.translateX} y={this.state.translateY} width={20 * this.state.scale} height={20 * this.state.scale} patternUnits="userSpaceOnUse">
							<circle cx="0.5" cy="0.5" r="0.5" fill="#949494"></circle>
						</pattern>
						<rect x="0" y="0" width="100%" height="100%" fill="url(#canvas-pattern-background)"></rect>
					</svg>
					<div className="workflow-canvas-elements-box" style={{ transform: `translate(${this.state.translateX}px, ${this.state.translateY}px) translateZ(1px) scale(${this.state.scale})` }}>
						<div ref={this._rootNodesContainerRef} className="workflow-canvas-root-nodes-container">
							{nestedRootNodes.map((rootNode, index) =>
								<NodeContainer
									key={index}
									parentNode={rootNode.node}
									childNodes={rootNode.children}
									nodeComponents={this.props.nodeComponents}
									connectorComponents={this.props.connectorComponents}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}

	public componentDidMount(): void {
		this.props.onUpdate?.();
	}

	public componentWillUnmount(): void {}

	public componentDidUpdate(prevProps: WorkflowCanvasProps): void {
		this.props.onUpdate?.();
	}

	private _onCanvasWrapperWheel(event: React.WheelEvent<HTMLDivElement>): void {
		if (event.deltaY < 0) {
		  this.setState({ scale: Math.min(this.state.scale + 0.1, 2) });
		} else if (event.deltaY > 0) {
		  this.setState({ scale: Math.max(this.state.scale - 0.1, 0.5) });
		}
	}

	private _onCanvasMouseDown(event: React.MouseEvent): void {
		this._lastCanvasDragPosition = { x: event.clientX, y: event.clientY };
	}

	private _onCanvasMouseMove(event: React.MouseEvent): void {
		if (!this._lastCanvasDragPosition) {
			return;
		}

		this.setState({
			translateX: this.state.translateX - (this._lastCanvasDragPosition.x - event.clientX),
			translateY: this.state.translateY - (this._lastCanvasDragPosition.y - event.clientY)
		});

		this._lastCanvasDragPosition = { x: event.clientX, y: event.clientY };
	}

	/**
	 * Fit the contents into the centre of the canvas.
	 */
	private _fit(): void {
		const canvasWrapperOffsetHeight = this._canvasWrapperRef.current?.offsetHeight || 0;
		const canvasWrapperOffsetWidth = this._canvasWrapperRef.current?.offsetWidth || 0;
		const rootNodesContainerOffsetHeight = this._rootNodesContainerRef.current?.offsetHeight || 0;
		const rootNodesContainerOffsetWidth = this._rootNodesContainerRef.current?.offsetWidth || 0;

		this.setState({ 
			translateY: (canvasWrapperOffsetHeight / 2) - (rootNodesContainerOffsetHeight / 2),
			translateX: (canvasWrapperOffsetWidth / 2) - (rootNodesContainerOffsetWidth / 2),
			scale: 1
		})
	} 

	/**
	 * Gets the instance object for use by parent components.
	 * @returns The instance object for use by parent components.
	 */
	private _getInstanceObject(): WorkflowCanvasInstance {
		return {
			fit: () => this._fit()
		}
	} 

	/**
	 * Gets the nested root nodes.
	 * @param nodes 
	 * @param connectors 
	 * @returns The nested root nodes.
	 */
	private static _getNestedRootNodes(nodes: NodeType[], connectors: ConnectorType[]): NodeWithChildren[] {
		const addChildNodes = (parent: NodeWithChildren) => {
			// Get all outgoing connectors for the parent node.
			const outgoingConnectors = connectors.filter((connector) => connector.from === parent.node.id);

			parent.children = outgoingConnectors.map((connector) => {
				// Get the child node that is linked to the parent node.
				const childNode = nodes.find((node) => node.id === connector.to);;

				if (!childNode) {
					throw new Error("missing target node");
				}

				return { 
					connector, 
					child: { node: childNode, children: [] } 
				};
			});

			parent.children.forEach(({ child }) => addChildNodes(child));
		};

		// Get all of the nodes without incoming connectors, these will be our root nodes.
		const rootNodes: NodeWithChildren[] = nodes
			.filter((node) => !connectors.find((connector) => connector.to === node.id))
			.map((node) => ({ node, children: [] }));

		// Recursively populate our tree from the root nodes. 
		rootNodes.forEach((rootNode) => addChildNodes(rootNode));

		return rootNodes;
	}
}
