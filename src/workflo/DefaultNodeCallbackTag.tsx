import { DefaultNodeArgument } from './DefaultNode';

import './DefaultNodeCallbackTag.css';

/**
 * The DefaultNodeCallbackTag component props.
 */
export type DefaultNodeCallbackTagProps = {
	type: "entry" | "exit" | "step";
  functionName: string;
	args: DefaultNodeArgument[];
};

/**
 * The DefaultNodeCallbackTag component.
 */
export const DefaultNodeCallbackTag: React.FunctionComponent<DefaultNodeCallbackTagProps> = ({ type, functionName, args }) => {
  
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
    <div className="callback-tag">
      <div className="callback-tag-type">
        <p>{type}</p>
      </div>
      <div className="callback-tag-signature">
        <p>{functionName}</p>
        {args.map((arg, index) => getArgument(arg, index))}
      </div>
    </div>
  );
};
  