import ReactFlow, { Background, BackgroundVariant, Controls, Node, Edge } from "react-flow-renderer";

export type ReactFlowElements = { nodes: Node[], edges: Edge[] };

/**
 * The MainPanel component props.
 */
export type MainPanelProps = {
    elements: ReactFlowElements;
}

/**
 * The MainPanel component.
 */
 export const MainPanel: React.FunctionComponent<MainPanelProps> = ({ elements }) => {
    const onInit = (reactFlowInstance: any) => {
        console.log('flow loaded:', reactFlowInstance);
        reactFlowInstance.fitView();
    };

    return (
        <div className="main-panel reactflow-wrapper">
            <ReactFlow
                onInit={onInit}
                maxZoom={1.5}
				minZoom={0.6}
                nodes={elements.nodes}
                edges={elements.edges}>
                <Controls />
                <Background variant={BackgroundVariant.Lines} gap={20} size={0.5} />
            </ReactFlow>
        </div>
    );
  }
  