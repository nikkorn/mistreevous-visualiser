import React, { useEffect, useRef, useState } from "react";

import { Node } from './Node';

import { NodeType, ChildNode } from "./workflo";

import './NodeContainer.css';

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
    connectorComponents: { [key: string]: React.ClassType<any, any, any> };
};

/**
 * The NodeContainer component.
 */
export const NodeContainer: React.FunctionComponent<NodeContainerProps> = ({ parentNode, childNodes, nodeComponents, connectorComponents }) => {
    // The ref to the node children container.
    const nodeChildrenContainerRef = useRef<HTMLDivElement>(null);

    const [connectorTargetOffsets, setConnectorTargetOffsets] = useState<number[] | null>(null);
    const [nodeChildrenContainerHeight, setNodeChildrenContainerHeight] = useState<number>(0);

    useEffect(() => {
        const currentNodeChildrenContainerHeight = nodeChildrenContainerRef.current?.clientHeight || 0;

        // Work out the connector target offsets based on the heights and positions of each child node.
        if (!connectorTargetOffsets || currentNodeChildrenContainerHeight != nodeChildrenContainerHeight || connectorTargetOffsets.length != childNodes.length) {
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
            {childNodes.length > 0 && (
                <>
                    <div className="workflow-canvas-node-connector-svg-wrapper">
                        <svg className="workflow-canvas-node-connector-svg">
                            {connectorTargetOffsets && connectorTargetOffsets.length === childNodes.length && connectorTargetOffsets.map((offset, index) => {
                                const { connector } = childNodes[index];       
                                
                                const Connector = connectorComponents[connector.variant];

                                return (
                                    <Connector
                                        key={index}
                                        source={{ x: 0, y: nodeChildrenContainerHeight / 2 }} 
                                        target={{ x: 40, y: offset }}
                                        containerWidth={40}
                                        containerHeight={nodeChildrenContainerHeight}
                                    />
                                );
                            })}
                        </svg>
                    </div>
                    <div ref={nodeChildrenContainerRef} className="workflow-canvas-node-children-container">
                        {childNodes.map((childNode, index) =>
                            <NodeContainer
                                key={index}
                                parentNode={childNode.child.node} 
                                childNodes={childNode.child.children} 
                                nodeComponents={nodeComponents}
                                connectorComponents={connectorComponents}
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
};