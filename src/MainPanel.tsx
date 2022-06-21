import { useCallback, useEffect, useState } from "react";
import ReactFlow, { Background, BackgroundVariant, Controls, Node, Edge, useNodesState, useEdgesState, applyNodeChanges, applyEdgeChanges, ReactFlowInstance, NodeChange } from "react-flow-renderer";

export type ReactFlowElements = { nodes: Node[], edges: Edge[] };
  
/**
 * The MainPanel component props.
 */
export type MainPanelProps = {
    /** The behaviour tree definition. */
    definition: string;

    /** The behaviour tree ReactFlow elements. */
    elements: ReactFlowElements;
}

/**
 * The MainPanel component.
 */
 export const MainPanel: React.FunctionComponent<MainPanelProps> = ({ definition, elements }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();

    useEffect(() => {
        setNodes(elements.nodes);
        setEdges(elements.edges);
        reactFlowInstance?.fitView();
    }, [definition]);

    return (
        <div className="main-panel reactflow-wrapper">
            <ReactFlow
                onInit={setReactFlowInstance}
                maxZoom={1.5}
				minZoom={0.6}
                nodes={nodes}
                edges={edges}
                onNodesChange={(nodes: NodeChange[]) => {
                    onNodesChange(nodes);
                  
                    // When this is called and the type of any nodes is "dimensions" it looks like we get the width/height.

                    // The following will always get us the width/height.
                    // reactFlowInstance?.getNodes();

                    console.log(reactFlowInstance?.getNodes());
                }}
                onEdgesChange={onEdgesChange}>
                <Controls />
                <Background variant={BackgroundVariant.Lines} gap={20} size={0.5} />
            </ReactFlow>
        </div>
    );
  }
  