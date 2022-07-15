import { useEffect, useState } from "react";

import PlayArrow from '@mui/icons-material/PlayArrow';
import Stop from "@mui/icons-material/Stop";
import Fab from "@mui/material/Fab/Fab";

import { WorkflowCanvas, WorkflowCanvasInstance } from "./workflo/WorkflowCanvas";
import { DefaultNode } from "./workflo/DefaultNode";
import { DefaultConnector } from "./workflo/DefaultConnector";
import { NodeType, ConnectorType } from "./workflo/workflo";

import './MainPanel.css';

export type CanvasElements = { nodes: NodeType[], edges: ConnectorType[] };
  
/**
 * The MainPanel component props.
 */
export type MainPanelProps = {
    /** The behaviour tree elements. */
    elements: CanvasElements;

    showPlayButton: boolean;

    onPlayButtonClick(): void;

    showStopButton: boolean;

    onStopButtonClick(): void;
}

/**
 * The MainPanel component.
 */
 export const MainPanel: React.FunctionComponent<MainPanelProps> = ({ elements, showPlayButton, showStopButton, onPlayButtonClick, onStopButtonClick }) => {
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
                connectorComponents={{
                    "default": DefaultConnector
                }}
            />
            <div className="main-panel-fab-container">
                {showPlayButton && (
                    <Fab onClick={onPlayButtonClick} className="run-tree-fab main-panel-fab" size="medium" color="primary">
                        <PlayArrow/>
                    </Fab>
                )}
                {showStopButton && (
                    <Fab onClick={onStopButtonClick} className="run-tree-fab main-panel-fab" size="medium" color="primary">
                        <Stop/>
                    </Fab>
                )}
            </div>
        </div>
    );
  }
  