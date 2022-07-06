import React, { useEffect, useRef, useState } from "react";

import { Node } from './Node';

import { NodeType, ChildNode } from "./workflo";

/**
 * The connector target offsets type keyed on connector id.
 */
export type ConnectorTargetOffsets = { [key: string]: number };

/**
 * The NodeContainer component props.
 */
export type NodeContainerProps = {
    parentNode: NodeType;
	childNodes: ChildNode[];
    nodeComponents: { [key: string]: React.ClassType<any, any, any> };
};

/**
 * The NodeContainer component.
 */
 export const NodeContainer: React.FunctionComponent<NodeContainerProps> = ({ parentNode, childNodes, nodeComponents }) => {
    // The ref to the node children container.
    const nodeChildrenContainerRef = useRef<HTMLDivElement>(null);

    const [connectorTargetOffsets, setConnectorTargetOffsets] = useState<number[] | null>(null);
    const [nodeChildrenContainerHeight, setNodeChildrenContainerHeight] = useState<number>(0);

    useEffect(() => {
        const currentNodeChildrenContainerHeight = nodeChildrenContainerRef.current?.clientHeight || 0;

        // Work out the connector target offsets based on the heights and positions of each child node.
        if (!connectorTargetOffsets || currentNodeChildrenContainerHeight != nodeChildrenContainerHeight) {
            const offsets = [];

            let childPositionOffset = 0;

            for (let childIndex = 0; childIndex < (nodeChildrenContainerRef.current?.children.length || 0); childIndex++) {
                // Get the current child element.
                const childElement = nodeChildrenContainerRef.current?.children[childIndex]!;

                // Get the height of the child.
                const childHeight = childElement.clientHeight;

                // Calculate the end point of the connector, which should be aligned with the child element.
                const childConnectorOffset = childPositionOffset + (childHeight / 2);

                offsets.push(childConnectorOffset);

                // Add the child height to the offset.
                childPositionOffset += childHeight;
            }

            setConnectorTargetOffsets(offsets);
            setNodeChildrenContainerHeight(currentNodeChildrenContainerHeight);
        }
    });

    return (
        <div className="workflow-canvas-node-container">
            <div className="workflow-canvas-node-parent-container">
                <Node key={parentNode.id} wrapped={nodeComponents[parentNode.variant]} model={parentNode} />
            </div>
            <div className="workflow-canvas-node-connector-svg-wrapper">
                <svg className="workflow-canvas-node-connector-svg">
                    {connectorTargetOffsets && connectorTargetOffsets.map((offset, index) =>
                        <line x1="0" y1="50%" x2="100%" y2={`${offset}`} stroke="#ff0000" stroke-width="1" stroke-linecap="round"></line>
                    )}
                </svg>
            </div>
            <div ref={nodeChildrenContainerRef} className="workflow-canvas-node-children-container">
                {childNodes.map((childNode) =>
                    <NodeContainer parentNode={childNode.child.node} childNodes={childNode.child.children} nodeComponents={nodeComponents} />
                )}
            </div>
        </div>
    );
  };