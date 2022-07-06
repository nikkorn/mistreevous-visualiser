import React from "react";

import { NodeType } from "./workflo";

import './Node.css';

/**
 * The Node component props.
 */
export type NodeProps = {
  wrapped: React.ClassType<any, any, any>;
  model: NodeType;
};

/**
 * The Node component.
 */
export const Node: React.FunctionComponent<NodeProps> = ({ wrapped: Wrapped, model }) => {
  return (
      <div className="workflow-canvas-node">
        <Wrapped {...model} />
      </div>
  );
};