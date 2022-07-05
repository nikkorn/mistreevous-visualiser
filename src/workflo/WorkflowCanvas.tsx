import React from 'react';
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
	nodes: RenderedNode[];
	connectors?: RenderedConnector[];
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
			nodes: props.nodes.map((node) => ({ model: node, ref: React.createRef() }))
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
							{this.state.connectors && this.state.connectors.map(({ model, source, target }) => {
								return (
									<line key={model.id} x1={source.x} y1={source.y} x2={target.x} y2={target.y} style={{ stroke: "rgb(255,0,0)", strokeWidth: 2 }}></line>
								);
							})}
						</svg>
						<div className="workflow-canvas-nodes-container">
							{this.state.nodes.map(({ model, ref }) => <Node key={model.id} ref={ref} wrapped={getNodeComponent(model.variant)} model={model} />)}
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
			nodes: nextProps.nodes.map((node) => ({ model: node, ref: React.createRef() })),
			connectors: undefined
		};
    }

	public componentDidMount(): void {
		this._createRenderableConnectors();
	}

	public componentWillUnmount(): void {}

	public componentDidUpdate(prevProps: WorkflowCanvasProps): void {
		this._createRenderableConnectors();
	}

	private _createRenderableConnectors(): void {
		// We do not need to do anything if the connectors already exist.
		if (this.state.connectors) {
			return;
		}

		// TODO Check that every node has been rendered with refs that can give us node width/height

		const renderedConnectors: RenderedConnector[] = [];

		this.props.connectors.forEach((connector) => {
			const sourceNode = this.state.nodes.find((node) => node.model.id === connector.from);
			const targetNode = this.state.nodes.find((node) => node.model.id === connector.to);

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
					x: sourceNode.model.position.x + (sourceNodeWidth / 2), 
					y: sourceNode.model.position.y + (sourceNodeHeight / 2)
				},
				target: { 
					x: targetNode.model.position.x + (targetNodeWidth / 2), 
					y: targetNode.model.position.y + (targetNodeHeight / 2)
				}
			})
		});

		this.setState({ connectors: renderedConnectors });
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
