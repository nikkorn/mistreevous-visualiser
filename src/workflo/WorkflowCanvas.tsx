import React from 'react';
import ELK, { ElkNode } from "elkjs/lib/elk.bundled";

import { Node } from './Node';
import { ConnectorType, NodeType, RenderedConnector, RenderedNode } from './workflo';

import './WorkflowCanvas.css';

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
	nodes: NodeType[];
	connectors: ConnectorType[];
	renderedNodes: RenderedNode[];
	renderedConnectors?: RenderedConnector[];
	isLayoutRequired: boolean;
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
			scale: 1,
			nodes: props.nodes,
			connectors: props.connectors,
			renderedNodes: props.nodes.map((node) => ({ 
				model: node, 
				ref: React.createRef(),
				position: { x: 0, y: 0 }
			})),
			isLayoutRequired: true
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
						<svg className="workflow-canvas-edges-svg">
							{this.state.renderedConnectors && this.state.renderedConnectors.map(({ model, source, target }) => {
								return (
									<line key={model.id} x1={source.x} y1={source.y} x2={target.x} y2={target.y} style={{ stroke: "rgb(255,0,0)", strokeWidth: 2 }}></line>
								);
							})}
						</svg>
						<div className="workflow-canvas-nodes-container">
							{this.state.renderedNodes.map(({ model, ref, position }) => <Node key={model.id} ref={ref} wrapped={getNodeComponent(model.variant)} model={model} position={position} />)}
						</div>
					</div>
				</div>
			</div>
		);
	}

	/**
     * Gets the state derived from the given props.
     * @param nextProps The next props.
     * @param prevState The previous state.
     * @returns The state derived from the given props.
     */
	public static getDerivedStateFromProps(
        nextProps: WorkflowCanvasProps,
        prevState: WorkflowCanvasState
    ) {
    	// TODO Maybe check whether the nodes/connectors have not changed and return null.

		// TODO This will have to change quite a lot to handle position changes and other stuff.
		const haveNodesChanged = nextProps.nodes.length != prevState.nodes.length;

		if (!haveNodesChanged) {
			return null;
		}

		return {
			translateX: prevState.translateX,
			translateY: prevState.translateY,
			scale: prevState.scale,
			nodes: nextProps.nodes,
			connectors: nextProps.connectors,
			renderedNodes: nextProps.nodes.map((node) => ({ model: node, ref: React.createRef(), position: { x: 0, y: 0 } })),
			renderedConnectors: undefined,
			isLayoutRequired: true
		};
    }

	public componentDidMount(): void {	
		this._onCanvasUpdate();
	}

	public componentWillUnmount(): void {}

	public componentDidUpdate(prevProps: WorkflowCanvasProps): void {
		this._onCanvasUpdate();
	}

	private async _onCanvasUpdate(): Promise<void> {
		if (this.state.isLayoutRequired) {
			this.setState({ 
				renderedNodes: await this._layoutRenderableNodes(),
				renderedConnectors: this._createRenderableConnectors(),
				isLayoutRequired: false 
			});
		}
	}

	private async _layoutRenderableNodes(): Promise<RenderedNode[]> {
		const renderedNodes: RenderedNode[] = [];

		const getNodeDimensions = (id: string) => {
			const node = this.state.renderedNodes.find((node) => node.model.id === id);

			return {
				width: node?.ref.current?.children[0]?.clientWidth || 0,
				height: node?.ref.current?.children[0]?.clientWidth || 0
			}
		};

		// Create the graph that ELK will use in order to generate a layout.
		const graph = {
			id: "root",
			layoutOptions: {
				"elk.algorithm": "layered",
				"elk.direction": "down"
			},
			children: this.state.nodes.map(({ id }) => ({ id, ...getNodeDimensions(id) })),
			edges: this.state.connectors.map(({ id, from, to }) => ({ id, sources: [from], targets: [to] }))
		};

		const elk = new ELK();

        const layoutResult = await elk.layout(graph as any);

		this.state.renderedNodes.forEach((node) => {
			const layoutedNode = layoutResult.children?.find((child) => child.id === node.model.id);

            if (!layoutedNode) {
                return;
            }

			renderedNodes.push({
				model: node.model,
				ref: node.ref,
				position: { x: layoutedNode.x!, y: layoutedNode.y! }
			});
		});
		
		return renderedNodes;
	}

	private _createRenderableConnectors(): RenderedConnector[] {
		const renderedConnectors: RenderedConnector[] = [];

		this.props.connectors.forEach((connector) => {
			const sourceNode = this.state.renderedNodes.find((node) => node.model.id === connector.from);
			const targetNode = this.state.renderedNodes.find((node) => node.model.id === connector.to);

			// We need both source and tagret nodes to create our connector.
			if (!sourceNode || !targetNode) {
				return;
			}

			// Get the dimensions of our source and target nodes.
			const sourceNodeWidth = sourceNode.ref.current?.children[0]?.clientWidth || 0;
			const sourceNodeHeight = sourceNode.ref.current?.children[0]?.clientHeight || 0;
			const targetNodeWidth = targetNode.ref.current?.children[0]?.clientWidth || 0;
			const targetNodeHeight = targetNode.ref.current?.children[0]?.clientHeight || 0;

			renderedConnectors.push({
				model: connector,
				source: { 
					x: sourceNode.position.x + (sourceNodeWidth / 2), 
					y: sourceNode.position.y + (sourceNodeHeight / 2)
				},
				target: { 
					x: targetNode.position.x + (targetNodeWidth / 2), 
					y: targetNode.position.y + (targetNodeHeight / 2)
				}
			})
		});

		return renderedConnectors;
	}

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
}
