import { useEffect, useState } from "react";

import { WorkflowCanvas, WorkflowCanvasInstance } from "./workflo/WorkflowCanvas";
import { DefaultNode } from "./workflo/DefaultNode";
import { NodeType, ConnectorType } from "./workflo/workflo";

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
        <WorkflowCanvas
            onInitalise={(instance) => setCanvasInstance(instance)}
            nodes={elements.nodes}
            connectors={elements.edges}
            nodeComponents={{
                "default": DefaultNode
            }}
        />
    );
  }
  