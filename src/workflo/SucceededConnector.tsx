import { Position } from './workflo'; 

/**
 * The SucceededConnector component props.
 */
export type SucceededConnectorProps = {
  source: Position;
  target: Position;
  containerWidth: number;
  containerHeight: number;
};

/**
 * The SucceededConnector component.
 */
export const SucceededConnector: React.FunctionComponent<SucceededConnectorProps> = ({ source, target, containerWidth, containerHeight }) => {
  return (
    <path 
        d={`M${source.x} ${source.y} C${containerWidth / 2} ${source.y} ${containerWidth / 2} ${target.y} ${target.x} ${target.y}`}
        stroke="#02c93e"
        strokeWidth={2}
        fill="transparent"
    />
  );
};
  