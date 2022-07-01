import React from 'react';
import { DefaultNode } from './DefaultNode';

import './WorkflowCanvas.css';

export type NodeType = {
	id: string;
	variant: string;
}

export type ConnectorType = {
	id: string;
	from: string;
	to: string;
}

export type WorkflowCanvasProps = {
	nodes: NodeType[];
	connectors: ConnectorType[];
	nodeComponents: { [key: string]: React.ComponentClass }
}

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
		return (
			<div ref={this._canvasWrapperRef} className="workflow-canvas-wrapper" 
				onWheel={this._onCanvasWrapperWheel}
				onMouseDown={this._onCanvasMouseDown}
				onMouseMove={this._onCanvasMouseMove}
				onMouseUp={() => this._lastCanvasDragPosition = null}
				onMouseLeave={() => this._lastCanvasDragPosition = null}>
				<div className="workflow-canvas">
					<div className="workflow-canvas-elements-box" style={{ transform: `translate(${this.state.translateX}px, ${this.state.translateY}px) scale(${this.state.scale})` }}>
						<div className="workflow-canvas-nodes-container">
							<DefaultNode caption='Hello' position={{ x: 0, y: 0 }} />
							<DefaultNode caption='World' position={{ x: 300, y: 300  }} />
						</div>
						<svg className="workflow-canvas-edges-svg">
							<line x1="0" y1="0" x2="300" y2="300" style={{ stroke: "rgb(255,0,0)", strokeWidth: 2 }}></line>
						</svg>
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
