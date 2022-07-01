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
}

/**
 * The WorkflowCanvas component.
 */
export class WorkflowCanvas extends React.Component<WorkflowCanvasProps, WorkflowCanvasState> {
	 /**
     * Creates the WorkflowCanvas element.
     * @param props The component properties.
     */
	  public constructor(props: WorkflowCanvasProps) {
        super(props);

        // Set the initial state for the component.
        this.state = {
			translateX: 0,
			translateY: 0
        };
    }

	/**
	 * Renders the component.
	 */
	public render(): React.ReactNode {
		return (
			<div className="workflow-canvas-wrapper">
				<div className="workflow-canvas">
					<div className="workflow-canvas-elements-box" style={{ transform: `translate(${0}px, ${0}px) scale(${1})` }}>
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
}
