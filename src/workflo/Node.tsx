import React from "react";

import { NodeType } from "./workflo";

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
export const Node = React.forwardRef<HTMLDivElement, NodeProps>(({ wrapped: Wrapped, model }, ref) => {
  return (
      <div ref={ref} className="workflow-canvas-node" style={{ transform: `translate(${model.position.x}px, ${model.position.y}px)` }}>
        <Wrapped {...model} />
      </div>
  );
});