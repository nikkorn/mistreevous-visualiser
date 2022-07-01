import React from 'react';
import { Node } from './Node';
import { ConnectorType, NodeType, PositionedNode } from './workflo';

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
	nodes: PositionedNode[];
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
			nodes: props.nodes.map((node) => ({ model: node, position: { x: 0, y: 0 }}))
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
							<line x1="0" y1="0" x2="300" y2="300" style={{ stroke: "rgb(255,0,0)", strokeWidth: 2 }}></line>
						</svg>
						<div className="workflow-canvas-nodes-container">
							{this.state.nodes.map(({ model, position }) => <Node wrapped={getNodeComponent(model.variant)} model={model} position={position} />)}
						</div>
					</div>
				</div>
			</div>
		);
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
