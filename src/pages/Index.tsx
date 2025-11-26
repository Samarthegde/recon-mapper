import { useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  NodeTypes,
  Node,
  NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Trash2, Upload, Download } from 'lucide-react';

import { NodePalette } from '@/components/NodePalette';
import { WebEndpointNode } from '@/components/nodes/WebEndpointNode';
import { SSHAccessNode } from '@/components/nodes/SSHAccessNode';
import { RDPAccessNode } from '@/components/nodes/RDPAccessNode';
import { CredentialNode } from '@/components/nodes/CredentialNode';
import { ArtifactNode } from '@/components/nodes/ArtifactNode';
import { NodeEditDialog } from '@/components/NodeEditDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const nodeTypes: NodeTypes = {
  web: WebEndpointNode,
  ssh: SSHAccessNode,
  rdp: RDPAccessNode,
  credential: CredentialNode,
  artifact: ArtifactNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'web',
    position: { x: 250, y: 100 },
    data: {
      label: 'Target API',
      url: 'https://api.target.com',
      method: 'GET',
      authType: 'bearer',
      status: 200,
      width: 256,
    },
  },
  {
    id: '2',
    type: 'credential',
    position: { x: 250, y: 300 },
    data: {
      label: 'API Token',
      type: 'bearer',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      width: 256,
    },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
];

const getDefaultNodeData = (type: string) => {
  switch (type) {
    case 'web':
      return {
        label: 'New Endpoint',
        url: 'https://example.com',
        method: 'GET',
        authType: 'none',
        width: 256,
      };
    case 'ssh':
      return {
        label: 'SSH Connection',
        host: '192.168.1.1',
        port: 22,
        username: 'root',
        authType: 'key',
        width: 256,
      };
    case 'rdp':
      return {
        label: 'RDP Connection',
        host: '192.168.1.1',
        port: 3389,
        username: 'Administrator',
        width: 256,
      };
    case 'credential':
      return {
        label: 'New Credential',
        type: 'password',
        username: 'user',
        value: 'password123',
        width: 256,
      };
    case 'artifact':
      return {
        label: 'Evidence File',
        filePath: '/var/log/evidence.txt',
        fileType: 'text',
        hash: 'sha256:abcdef1234567890',
        size: 2048,
        width: 256,
      };
    default:
      return { label: 'New Node', width: 256 };
  }
};

const Index = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeId, setNodeId] = useState(3);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle node changes and sync dimensions to data
  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChange(changes);
      
      // Sync node dimensions after resize
      changes.forEach((change: any) => {
        if (change.type === 'dimensions' && change.dimensions) {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === change.id
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      width: change.dimensions.width,
                      height: change.dimensions.height,
                    },
                  }
                : node
            )
          );
        }
      });
    },
    [onNodesChange, setNodes]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeDoubleClick: NodeMouseHandler = useCallback((event, node) => {
    setEditingNode(node);
    setIsEditDialogOpen(true);
  }, []);

  const handleSaveNode = useCallback((newData: any) => {
    if (!editingNode) return;

    setNodes((nds) =>
      nds.map((node) =>
        node.id === editingNode.id
          ? { ...node, data: newData }
          : node
      )
    );

    toast({
      title: "Node Updated",
      description: "Node properties have been saved successfully",
    });
  }, [editingNode, setNodes, toast]);

  const onDeleteSelected = useCallback(() => {
    const selectedNodes = nodes.filter((node) => node.selected);
    const selectedEdges = edges.filter((edge) => (edge as any).selected);
    
    if (selectedNodes.length === 0 && selectedEdges.length === 0) {
      return;
    }

    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !(edge as any).selected));

    const deletedCount = selectedNodes.length + selectedEdges.length;
    toast({
      title: "Deleted",
      description: `Removed ${deletedCount} item${deletedCount > 1 ? 's' : ''} from canvas`,
    });
  }, [nodes, edges, setNodes, setEdges, toast]);

  // Keyboard shortcut for delete
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        // Prevent backspace navigation
        if (event.key === 'Backspace' && 
            event.target instanceof HTMLElement && 
            !['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
          event.preventDefault();
        }
        onDeleteSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDeleteSelected]);

  const onAddNode = useCallback(
    (type: string) => {
      const newNode: Node = {
        id: nodeId.toString(),
        type,
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 400 + 100,
        },
        data: getDefaultNodeData(type),
      };
      
      setNodes((nds) => [...nds, newNode]);
      setNodeId((id) => id + 1);
    },
    [nodeId, setNodes]
  );

  const exportToJSON = useCallback(() => {
    const data = {
      nodes,
      edges,
      nodeId,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `investigation-flow-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Exported to JSON",
      description: "Graph has been exported successfully",
    });
  }, [nodes, edges, nodeId, toast]);

  const importFromJSON = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        setNodeId(data.nodeId || 1);
        
        toast({
          title: "Imported from JSON",
          description: "Graph has been imported successfully",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid JSON file format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [setNodes, setEdges, toast]);


  return (
    <div className="flex h-screen w-full bg-background">
      <NodePalette onAddNode={onAddNode} />
      
      <div className="flex-1 relative">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={importFromJSON}
          className="hidden"
        />
        <div className="absolute top-4 left-4 z-10 bg-card/95 backdrop-blur border border-border rounded-lg p-3 shadow-lg">
          <p className="text-xs text-muted-foreground mt-1">
            Investigation Flow • {nodes.length} nodes • {edges.length} connections
          </p>
        </div>

        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToJSON}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Import
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteSelected}
            className="gap-2"
            disabled={!nodes.some(n => n.selected)}
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </Button>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={onNodeDoubleClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-canvas-bg"
        >
          <Background color="hsl(var(--canvas-grid))" gap={20} size={1} />
          <Controls className="bg-card border-border" />
          <MiniMap
            className="bg-card border-border"
            nodeColor={(node) => {
              switch (node.type) {
                case 'web': return 'hsl(var(--node-web))';
                case 'ssh': return 'hsl(var(--node-ssh))';
                case 'rdp': return 'hsl(var(--node-rdp))';
                case 'credential': return 'hsl(var(--node-credential))';
                case 'artifact': return 'hsl(var(--node-artifact))';
                default: return 'hsl(var(--primary))';
              }
            }}
          />
        </ReactFlow>

        <NodeEditDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          nodeType={editingNode?.type || ''}
          nodeData={editingNode?.data || {}}
          onSave={handleSaveNode}
        />
      </div>
    </div>
  );
};

export default Index;
