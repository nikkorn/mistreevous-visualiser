import { Position } from './workflo'; 

/**
 * The FailedConnector component props.
 */
export type FailedConnectorProps = {
  source: Position;
  target: Position;
  containerWidth: number;
  containerHeight: number;
};

/**
 * The FailedConnector component.
 */
export const FailedConnector: React.FunctionComponent<FailedConnectorProps> = ({ source, target, containerWidth, containerHeight }) => {
  return (
    <path 
        d={`M${source.x} ${source.y} C${containerWidth / 2} ${source.y} ${containerWidth / 2} ${target.y} ${target.x} ${target.y}`}
        stroke="#e63b02"
        strokeWidth={2}
        fill="transparent"
    />
  );
};
  