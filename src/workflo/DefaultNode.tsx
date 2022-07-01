import './DefaultNode.css';

export type DefaultNodeProps = {
  caption: string;
  position: { x: number, y: number };
};

/**
 * The WorkflowCanvas component.
 */
export const DefaultNode: React.FunctionComponent<DefaultNodeProps> = ({ caption, position }) => {
  return (
      <div className="workflow-canvas-default-node" style={{ transform: `translate(${position.x}px, ${position.y}px)` }}>
        <p>{caption}</p>
      </div>
  );
};
  