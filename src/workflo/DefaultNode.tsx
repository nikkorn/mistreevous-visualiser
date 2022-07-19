import { State } from 'mistreevous';
import './DefaultNode.css';

export type DefaultNodeProps = {
  id: string;
  caption: string;
  state: State;
};

/**
 * The WorkflowCanvas component.
 */
export const DefaultNode: React.FunctionComponent<DefaultNodeProps> = ({ id, caption, state }) => {
  let className = "workflow-canvas-default-node";

  switch (state) {
    case State.READY:
      className += " ready";
      break;

    case State.RUNNING:
      className += " running";
      break;

    case State.SUCCEEDED:
      className += " succeeded";
      break;

    case State.FAILED:
      className += " failed";
      break;
  }

  return (
      <div onClick={() => console.log("click")} className={className}>
        <p>{caption}</p>
      </div>
  );
};
  