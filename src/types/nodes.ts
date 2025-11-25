export type NodeType = 'web' | 'ssh' | 'rdp' | 'credential' | 'artifact';

export interface BaseNodeData {
  label: string;
  description?: string;
  width?: number;
  height?: number;
}

export interface WebEndpointData extends BaseNodeData {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  authType?: 'none' | 'basic' | 'bearer' | 'api-key';
  status?: number;
}

export interface SSHAccessData extends BaseNodeData {
  host: string;
  port: number;
  username: string;
  authType: 'password' | 'key';
}

export interface RDPAccessData extends BaseNodeData {
  host: string;
  port: number;
  username: string;
  domain?: string;
}

export interface CredentialData extends BaseNodeData {
  type: 'password' | 'token' | 'api-key' | 'ssh-key';
  username?: string;
  value: string;
}

export interface ArtifactData extends BaseNodeData {
  filePath: string;
  fileType: string;
  hash?: string;
  size?: number;
}

export type NodeData = 
  | WebEndpointData 
  | SSHAccessData 
  | RDPAccessData 
  | CredentialData 
  | ArtifactData;
