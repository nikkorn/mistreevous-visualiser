import { useCallback, useEffect, useState } from "react";

import { WorkflowCanvas } from "./workflo/WorkflowCanvas";
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
    return (
        <WorkflowCanvas
            onInitalise={(instance) => {
                (window as any)["fit"] = instance.fit
            }}
            nodes={elements.nodes}
            connectors={elements.edges}
            nodeComponents={{
                "default": DefaultNode
            }} />
    );
  }
  