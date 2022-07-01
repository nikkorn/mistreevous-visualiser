import './DefaultNode.css';

export type DefaultNodeProps = {
  id: string;
  caption: string;
};

/**
 * The WorkflowCanvas component.
 */
export const DefaultNode: React.FunctionComponent<DefaultNodeProps> = ({ id, caption }) => {
  return (
      <div onClick={() => console.log("click")} className="workflow-canvas-default-node">
        <p>{caption}</p>
      </div>
  );
};
  