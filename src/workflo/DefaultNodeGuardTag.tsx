import { DefaultNodeArgument } from './DefaultNode';

import './DefaultNodeGuardTag.css';

export type Guard = "while" | "until";

/**
 * The DefaultNodeGuardTag component props.
 */
export type DefaultNodeGuardTagProps = {
	type: "while" | "until";
  condition: string;
	args: DefaultNodeArgument[];
};

/**
 * The DefaultNodeGuardTag component.
 */
export const DefaultNodeGuardTag: React.FunctionComponent<DefaultNodeGuardTagProps> = ({ type, condition, args }) => {
  
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
    <div className="guard-tag">
      <div className="guard-tag-type">
        <p>{type}</p>
      </div>
      <div className="guard-tag-signature">
        <p>{condition}</p>
        {args.map((arg) => getArgument(arg))}
      </div>
    </div>
  );
};
  