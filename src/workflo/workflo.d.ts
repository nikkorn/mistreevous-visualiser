export type Position = { x: number; y: number; }

export type PositionedNode = { model: NodeType; position: Position; }

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
}