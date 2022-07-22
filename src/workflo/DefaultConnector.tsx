import { Position } from './workflo'; 

/**
 * The DefaultConnector component props.
 */
export type DefaultConnectorProps = {
  source: Position;
  target: Position;
  containerWidth: number;
  containerHeight: number;
};

/**
 * The DefaultConnector component.
 */
export const DefaultConnector: React.FunctionComponent<DefaultConnectorProps> = ({ source, target, containerWidth, containerHeight }) => {
  return (
    <path 
        d={`M${source.x} ${source.y} C${containerWidth / 2} ${source.y} ${containerWidth / 2} ${target.y} ${target.x} ${target.y}`}
        stroke="#646464"
        strokeWidth={2}
        fill="transparent"
    />
  );
};
  