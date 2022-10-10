import { Position } from './workflo'; 

import './ActiveConnector.css';

/**
 * The ActiveConnector component props.
 */
export type ActiveConnectorProps = {
  source: Position;
  target: Position;
  containerWidth: number;
  containerHeight: number;
};

/**
 * The ActiveConnector component.
 */
export const ActiveConnector: React.FunctionComponent<ActiveConnectorProps> = ({ source, target, containerWidth, containerHeight }) => {
  return (
    <path 
        className="active-connector-path" 
        d={`M${source.x} ${source.y} C${containerWidth / 2} ${source.y} ${containerWidth / 2} ${target.y} ${target.x} ${target.y}`}
        stroke="#0388fc"
        strokeWidth={2}
        strokeLinejoin={"round"}
        strokeDasharray={"8, 4"} 
        fill="transparent"
    />
  );
};
  