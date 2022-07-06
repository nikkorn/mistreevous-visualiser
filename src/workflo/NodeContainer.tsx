import React from "react";

import { Node } from './Node';

import { NodeType, ChildNode } from "./workflo";


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
    return (
        <div className="workflow-canvas-node-container">
            <div className="workflow-canvas-node-parent-container">
                <Node key={parentNode.id} wrapped={nodeComponents[parentNode.variant]} model={parentNode} />
                {/** Do we stick the SVG here? ... */}
            </div>
            {/** ... or here? */}
            {childNodes.length > 0 && (
                <div className="workflow-canvas-node-children-container">
                    {childNodes.map((childNode) =>
                        <NodeContainer parentNode={childNode.child.node} childNodes={childNode.child.children} nodeComponents={nodeComponents} />
                    )}
                </div>
            )}
        </div>
    );
  };