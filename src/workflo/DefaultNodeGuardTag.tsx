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
    <div className="guard-tag">
      <div className="guard-tag-type">
        <p>{type}</p>
      </div>
      <div className="guard-tag-signature">
        <p>{condition}</p>
        {args.map((arg, index) => getArgument(arg, index))}
      </div>
    </div>
  );
};
  