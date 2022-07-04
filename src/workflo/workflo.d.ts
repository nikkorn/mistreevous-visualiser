export type Position = { x: number; y: number; }

export type RenderedNode = { model: NodeType; ref: React.RefObject<HTMLDivElement>; }

/**
 * The Connector type.
 */
export type ConnectorType = {
	id: string;
	from: string;
	to: string;
}

/**
 * The Node type.
 */
export type NodeType = {
    id: string;
    variant: string;
	position: Position;
}