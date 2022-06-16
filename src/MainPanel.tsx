import ReactFlow, { Background, BackgroundVariant, Controls } from "react-flow-renderer";

/**
 * The MainPanel component.
 */
 export const MainPanel: React.FunctionComponent = () => {
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
                nodes={[{ id: '1', data: { label: 'label' }, position: { x: 100, y: 100 } }]}>
                <Controls />
                <Background variant={BackgroundVariant.Lines} gap={20} size={0.5} />
            </ReactFlow>
        </div>
    );
  }
  