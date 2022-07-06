import React from 'react';

import { Node } from './Node';
import { ConnectorType, NodeType } from './workflo';

import './WorkflowCanvas.css';

export type NodeWithChildren = {
	node: NodeType;
	children: NodeWithChildren[];
}

/**
 * The WorkflowCanvas component props.
 */
export type WorkflowCanvasProps = {
	nodes: NodeType[];
	connectors: ConnectorType[];
	nodeComponents: { [key: string]: React.ClassType<any, any, any> }
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

	/** The last canvas drag position. */
	private _lastCanvasDragPosition: { x: number, y: number } | null = null;

	/**
     * Creates the WorkflowCanvas element.
     * @param props The component properties.
     */
	public constructor(props: WorkflowCanvasProps) {
        super(props);

		this._canvasWrapperRef = React.createRef();

        // Set the initial state for the component.
        this.state = {
			translateX: 0,
			translateY: 0,
			scale: 1
        };

		this._onCanvasWrapperWheel = this._onCanvasWrapperWheel.bind(this);
		this._onCanvasMouseDown = this._onCanvasMouseDown.bind(this);
		this._onCanvasMouseMove = this._onCanvasMouseMove.bind(this);
    }

	/**
	 * Renders the component.
	 */
	public render(): React.ReactNode {
		const getNodeComponent = (variant: string) => this.props.nodeComponents[variant];

		return (
			<div ref={this._canvasWrapperRef} className="workflow-canvas-wrapper" 
				onWheel={this._onCanvasWrapperWheel}
				onMouseDown={this._onCanvasMouseDown}
				onMouseMove={this._onCanvasMouseMove}
				onMouseUp={() => this._lastCanvasDragPosition = null}
				onMouseLeave={() => this._lastCanvasDragPosition = null}>
				<div className="workflow-canvas">
					<div className="workflow-canvas-elements-box" style={{ transform: `translate(${this.state.translateX}px, ${this.state.translateY}px) translateZ(1px) scale(${this.state.scale})` }}>
						<div className="workflow-canvas-nodes-container">
							{this.state.nodes.map((node) => <Node key={node.id} wrapped={getNodeComponent(node.variant)} model={node} />)}
						</div>
					</div>
				</div>
			</div>
		);
	}

	public componentDidMount(): void {}

	public componentWillUnmount(): void {}

	public componentDidUpdate(prevProps: WorkflowCanvasProps): void {}

	private _onCanvasWrapperWheel(event: React.WheelEvent<HTMLDivElement>): void {
		if (event.deltaY < 0) {
		  this.setState({ scale: this.state.scale + 0.1 });
		} else if (event.deltaY > 0) {
		  this.setState({ scale: this.state.scale - 0.1 });
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

	private static _getNestedRootNodes(nodes: NodeType[], connectors: ConnectorType[]): NodeWithChildren[] {
		const getNode = (id: string) => nodes.find((node) => node.id === id);

		const addChildNodes = (parent: NodeWithChildren) => {
			// Get all outgoing connectors for the parent node.
			const outgoingConnectors = connectors.filter((connector) => connector.from === parent.node.id);

			parent.children = outgoingConnectors
				.map((connector) => {
					// Get the child node that is linked to the parent node.
					const childNode = getNode(connector.to);

					return childNode ? { node: childNode, children: [] } : null;
				})
				.filter((childNode) => !!childNode) as NodeWithChildren[];

			parent.children.forEach((child) => addChildNodes(child));
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
