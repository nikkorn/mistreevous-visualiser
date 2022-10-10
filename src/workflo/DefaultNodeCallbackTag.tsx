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
  
  const getArgument = (arg: DefaultNodeArgument) => {
    switch (arg.type) {
      case "string":
        return <p className="default-node-argument string">{`"${arg.value}"`}</p>;

      case "number":
        return <p className="default-node-argument number">{arg.value}</p>;
        
      case "boolean":
        return <p className="default-node-argument boolean">{arg.value ? "true" : "false"}</p>;

      case "null":
        return <p className="default-node-argument null">{"null"}</p>;

      default:
        throw new Error(`unknown argument type: ${arg.type}`);
    }
  };

  return (
    <div className="callback-tag">
      <div className="callback-tag-type">
        <p>{type}</p>
      </div>
      <div className="callback-tag-signature">
        <p>{functionName}</p>
        {args.map((arg) => getArgument(arg))}
      </div>
    </div>
  );
};
  