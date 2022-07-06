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
	variant: string;
}

export type ChildNode = {
	connector: ConnectorType, 
	child: NodeWithChildren
}

export type NodeWithChildren = {
	node: NodeType;
	children: ChildNode[];
}