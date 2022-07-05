import React from "react";

import { NodeType, Position } from "./workflo";

/**
 * The Node component props.
 */
export type NodeProps = {
  wrapped: React.ClassType<any, any, any>;
  model: NodeType;
  position: Position;
};

/**
 * The Node component.
 */
export const Node = React.forwardRef<HTMLDivElement, NodeProps>(({ wrapped: Wrapped, model, position }, ref) => {
  return (
      <div ref={ref} className="workflow-canvas-node" style={{ transform: `translate(${position.x}px, ${position.y}px)` }}>
        <Wrapped {...model} />
      </div>
  );
});