import { useCallback, useEffect, useState } from "react";
import ReactFlow, { Background, BackgroundVariant, Controls, Node, Edge, useNodesState, useEdgesState, applyNodeChanges, applyEdgeChanges, ReactFlowInstance, NodeChange } from "react-flow-renderer";
import ELK, { ElkNode } from "elkjs/lib/elk.bundled";

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

    const doAutoLayout = async () => {
        // There is nothing we can do if there is no REact Flow instance.
        if (!reactFlowInstance) {
            return;
        }

        const nodes = reactFlowInstance.getNodes();

        // Create the graph that ELK will use in order to generate a layout.
		const graph = {
			id: "root",
			layoutOptions: {
				"elk.algorithm": "layered",
				"elk.direction": "down"
			},
			children: nodes.map(({ id, width, height }) => ({ id, width, height })),
			edges: reactFlowInstance.getEdges().map(({ id, source, target }) => ({ id, sources: [source], targets: [target] }))
		};

        const elk = new ELK();

        const layoutResult = await elk.layout(graph as any);

        // Apply the new node positions based on the computed layout.
        nodes.forEach((node) => {
            const layoutedNode = layoutResult.children?.find((child) => child.id === node.id);

            if (!layoutedNode) {
                return;
            }

            node.position = { x: layoutedNode.x!, y: layoutedNode.y! };
        });

        setNodes(nodes);
    };

    const onNodesChangeHandler = async (nodes: NodeChange[]) => {
        onNodesChange(nodes);

        // Check whether this change handler is called in response to our nodes being added to the React Flow panel.
        const isInitialNodesRender = nodes.length && nodes.every((node) => node.type === "dimensions");

        // We will need to layout our nodes when they are rendered.
        if (isInitialNodesRender) {
            await doAutoLayout();

            reactFlowInstance?.fitView();
        }
    };

    return (
        <div className="main-panel reactflow-wrapper">
            <ReactFlow
                onInit={setReactFlowInstance}
                maxZoom={1.5}
				minZoom={0.6}
                nodes={nodes}
                edges={edges}
                onNodesChange={(nodes) => onNodesChangeHandler(nodes)}
                onEdgesChange={onEdgesChange}>
                <Controls />
                <Background variant={BackgroundVariant.Lines} gap={20} size={0.5} />
            </ReactFlow>
        </div>
    );
  }
  