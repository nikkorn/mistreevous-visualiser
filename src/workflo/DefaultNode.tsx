import { State } from 'mistreevous';

import actionIcon from './icons/action.png';
import conditionIcon from './icons/condition.png'; 
import failIcon from './icons/fail.png'; 
import flipIcon from './icons/flip.png'; 
import lottoIcon from './icons/lotto.png'; 
import parallelIcon from './icons/parallel.png'; 
import repeatIcon from './icons/repeat.png'; 
import retryIcon from './icons/retry.png'; 
import rootIcon from './icons/root.png'; 
import selectorIcon from './icons/selector.png'; 
import sequenceIcon from './icons/sequence.png'; 
import succeedIcon from './icons/succeed.png'; 
import waitIcon from './icons/wait.png'; 

import { DefaultNodeGuardTag } from './DefaultNodeGuardTag';
import { DefaultNodeCallbackTag } from './DefaultNodeCallbackTag';

import './DefaultNode.css';

export type DefaultNodeArgument = "string" | "number" | "boolean" | "null";

export type Guard = {
  condition: string;
	args: DefaultNodeArgument[];
	type: "while" | "until";
};

export type Callback = {
  functionName: string;
	args: DefaultNodeArgument[];
	type: "entry" | "exit" | "step";
};

/**
 * The DefaultNode component props.
 */
export type DefaultNodeProps = {
  id: string;
  caption: string;
  type: string;
  state: State;
  args: DefaultNodeArgument[];
  callbacks: Callback[];
  guards: Guard[];
};

/**
 * The DefaultNode component.
 */
export const DefaultNode: React.FunctionComponent<DefaultNodeProps> = ({ id, caption, type, state, args, callbacks, guards }) => {
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

  const getIcon = () => {
    switch (type) {
      case "action":
        return actionIcon;

      case "condition":
        return conditionIcon;
        
      case "fail":
        return failIcon;

      case "flip":
        return flipIcon;

      case "lotto":
        return lottoIcon;

      case "parallel":
        return parallelIcon;

      case "repeat":
        return repeatIcon;

      case "retry":
        return retryIcon;

      case "root":
        return rootIcon;

      case "selector":
        return selectorIcon;

      case "sequence":
        return sequenceIcon;

      case "succeed":
        return succeedIcon;

      case "wait":
        return waitIcon;

      default:
        throw new Error(`unknown type: ${type}`);
    }
  };

  const getArgument = (arg: DefaultNodeArgument, index: number) => {
    if (typeof arg === "string") {
      return <p key={index} className="default-node-argument string">{`"${arg}"`}</p>;
    } else if (typeof arg === "number") {
      return <p key={index} className="default-node-argument number">{arg}</p>;
    } else if (typeof arg === "boolean") {
      return <p key={index} className="default-node-argument boolean">{arg ? "true" : "false"}</p>;
    } else if (arg === null || arg === undefined) {
      return <p key={index} className="default-node-argument null">{arg === null ? "null" : "undefined"}</p>;
    } else {
      throw new Error(`unknown argument type: ${arg}`);
    }
  };

  return (
      <div className={className}>
        <div className="default-node-main-container">
          <div className="default-node-icon-container">
            <img className={`default-node-icon ${type}`} src={getIcon()} />
          </div>
          <div className="default-node-info-container">
            <div className="default-node-signature-container">
              <p className="default-node-caption">{caption}</p>
              {args.map((arg, index) => getArgument(arg, index))}
            </div>
            <div className="default-node-guard-callback-container">
              {guards.map((guard, index) => <DefaultNodeGuardTag key={index} type={guard.type} condition={guard.condition} args={guard.args} />)}
              {callbacks.map((callback, index) => <DefaultNodeCallbackTag key={index} type={callback.type} functionName={callback.functionName} args={callback.args} />)}
            </div>
          </div>
        </div>
      </div>
  );
};
  