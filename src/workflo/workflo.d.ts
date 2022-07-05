export type Position = { x: number; y: number; }

/**
 * The Node type.
 */
export type NodeType = {
    id: string;
    variant: string;
}

/**
 * The Connector type.
 */
export type ConnectorType = {
	id: string;
	from: string;
	to: string;
}

/**
 * The rendered node type.
 */
 export type RenderedNode = { 
	model: NodeType;
	ref: React.RefObject<HTMLDivElement>;
	position: Position;
}

/**
 * The rendered Connector type.
 */
export type RenderedConnector = { 
	model: ConnectorType;
	source: Position;
	target: Position;
}