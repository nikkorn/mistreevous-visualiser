import { useEffect, useState } from "react";

import { WorkflowCanvas, WorkflowCanvasInstance } from "./workflo/WorkflowCanvas";
import { DefaultNode } from "./workflo/DefaultNode";
import { NodeType, ConnectorType } from "./workflo/workflo";
import Fab from "@mui/material/Fab/Fab";

import './MainPanel.css';

export type CanvasElements = { nodes: NodeType[], edges: ConnectorType[] };
  
/**
 * The MainPanel component props.
 */
export type MainPanelProps = {
    /** The behaviour tree definition. */
    definition: string;

    /** The behaviour tree elements. */
    elements: CanvasElements;
}

/**
 * The MainPanel component.
 */
 export const MainPanel: React.FunctionComponent<MainPanelProps> = ({ definition, elements }) => {
    const [canvasInstance, setCanvasInstance] = useState<WorkflowCanvasInstance | null>(null);

    useEffect(() => {
        canvasInstance?.fit();
    });

    return (
        <div className="main-panel">
            <WorkflowCanvas
                onInitalise={(instance) => setCanvasInstance(instance)}
                nodes={elements.nodes}
                connectors={elements.edges}
                nodeComponents={{
                    "default": DefaultNode
                }}
            />
            <div className="main-panel-fab-container">
                <Fab className="run-tree-fab main-panel-fab" size="medium" color="primary">
                </Fab>
                <Fab className="run-tree-fab main-panel-fab" size="medium" color="primary">
                </Fab>
            </div>
        </div>
    );
  }
  