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
export const Node: React.FunctionComponent<NodeProps> = ({ wrapped: Wrapped, model, position }) => {
  return (
      <div className="workflow-canvas-node" style={{ transform: `translate(${position.x}px, ${position.y}px)` }}>
        <Wrapped {...model} />
      </div>
  );
};
  