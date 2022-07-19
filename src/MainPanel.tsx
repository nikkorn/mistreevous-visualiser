import { useEffect, useState } from "react";

import PlayArrow from '@mui/icons-material/PlayArrow';
import Repeat from '@mui/icons-material/Repeat';
import Stop from "@mui/icons-material/Stop";
import FitScreen from "@mui/icons-material/FitScreen";
import Fab from "@mui/material/Fab/Fab";

import { ActiveConnector } from "./workflo/ActiveConnector";
import { SucceededConnector } from "./workflo/SucceededConnector";
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

    showReplayButton: boolean;

    showStopButton: boolean;

    onPlayButtonClick(): void;

    onReplayButtonClick(): void;

    onStopButtonClick(): void;
}

/**
 * The MainPanel component.
 */
 export const MainPanel: React.FunctionComponent<MainPanelProps> = ({ elements, showPlayButton, showReplayButton, showStopButton, onPlayButtonClick, onReplayButtonClick, onStopButtonClick }) => {
    const [canvasInstance, setCanvasInstance] = useState<WorkflowCanvasInstance | null>(null);

    useEffect(() => {
        // canvasInstance?.fit();
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
                    "default": DefaultConnector,
                    "active": ActiveConnector,
                    "succeeded": SucceededConnector
                }}
            />
            <div className="main-panel-fab-container">
                {showPlayButton && (
                    <Fab onClick={onPlayButtonClick} className="run-tree-fab main-panel-fab" size="medium" color="primary">
                        <PlayArrow/>
                    </Fab>
                )}
                 {showReplayButton && (
                    <Fab onClick={onReplayButtonClick} className="run-tree-fab main-panel-fab" size="medium" color="primary">
                        <Repeat/>
                    </Fab>
                )}
                {showStopButton && (
                    <Fab onClick={onStopButtonClick} className="run-tree-fab main-panel-fab" size="medium" color="primary">
                        <Stop/>
                    </Fab>
                )}
                {elements.edges.length && elements.nodes.length && (
                    <Fab onClick={() => canvasInstance?.fit()} className="run-tree-fab main-panel-fab" size="medium" color="primary">
                        <FitScreen/>
                    </Fab>
                )}
            </div>
        </div>
    );
  }
  