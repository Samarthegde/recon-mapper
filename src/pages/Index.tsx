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
  Node,
  NodeMouseHandler,
} from '@xyflow/react';
import type { NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Trash2, Upload, RotateCcw, FileImage, Undo2, Redo2, FileJson, Settings } from 'lucide-react';
import html2canvas from 'html2canvas';

import { NodePalette } from '@/components/NodePalette';
import { FlowManager } from '@/components/FlowManager';
import { WebEndpointNode } from '@/components/nodes/WebEndpointNode';
import { SSHAccessNode } from '@/components/nodes/SSHAccessNode';
import { RDPAccessNode } from '@/components/nodes/RDPAccessNode';
import { CredentialNode } from '@/components/nodes/CredentialNode';
import { ArtifactNode } from '@/components/nodes/ArtifactNode';
import { CustomNode } from '@/components/nodes/CustomNode';
import { CustomNodeBuilder } from '@/components/CustomNodeBuilder';
import { NodeEditDialog } from '@/components/NodeEditDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';
import { Flow, FlowStorage } from '@/types/flow';
import { CustomNodeDefinition, CustomNodeStorage } from '@/types/customNode';

const nodeTypes = {
  web: WebEndpointNode,
  ssh: SSHAccessNode,
  rdp: RDPAccessNode,
  credential: CredentialNode,
  artifact: ArtifactNode,
} as const satisfies NodeTypes;

const initialNodes = [
  {
    id: '1',
    type: 'web' as const,
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
    type: 'credential' as const,
    position: { x: 250, y: 300 },
    data: {
      label: 'API Token',
      type: 'bearer',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      width: 256,
    },
  },
] as Node[];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
];

const getDefaultNodeData = (type: string, customNodeDef?: CustomNodeDefinition) => {
  // Handle custom nodes
  if (customNodeDef) {
    return {
      label: `New ${customNodeDef.name}`,
      customDefinition: customNodeDef,
      customData: {},
      width: 256,
    };
  }
  
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

const STORAGE_KEY = 'investigation-flows-v2';
const CUSTOM_NODES_KEY = 'custom-node-types';

const loadCustomNodes = (): CustomNodeDefinition[] => {
  try {
    const saved = localStorage.getItem(CUSTOM_NODES_KEY);
    if (saved) {
      const storage: CustomNodeStorage = JSON.parse(saved);
      return storage.customNodes;
    }
  } catch (error) {
    console.error('Failed to load custom nodes:', error);
  }
  return [];
};

const saveCustomNodes = (customNodes: CustomNodeDefinition[]) => {
  try {
    const storage: CustomNodeStorage = { customNodes };
    localStorage.setItem(CUSTOM_NODES_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('Failed to save custom nodes:', error);
  }
};

const loadFromStorage = (): FlowStorage => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load from storage:', error);
  }
  
  // Create default flow
  const defaultFlow: Flow = {
    id: '1',
    name: 'Investigation 1',
    nodes: initialNodes,
    edges: initialEdges,
    nodeId: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return {
    flows: [defaultFlow],
    activeFlowId: '1',
  };
};

const saveToStorage = (storage: FlowStorage) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('Failed to save to storage:', error);
  }
};

const Index = () => {
  const [storage, setStorage] = useState<FlowStorage>(loadFromStorage);
  const [customNodes, setCustomNodes] = useState<CustomNodeDefinition[]>(loadCustomNodes);
  const [isCustomNodeBuilderOpen, setIsCustomNodeBuilderOpen] = useState(false);
  const activeFlow = storage.flows.find(f => f.id === storage.activeFlowId) || storage.flows[0];
  
  const [nodes, setNodes, onNodesChange] = useNodesState(activeFlow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(activeFlow.edges);
  const [nodeId, setNodeId] = useState(activeFlow.nodeId);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // History management for undo/redo
  const history = useHistory(activeFlow.nodes, activeFlow.edges, { maxHistorySize: 50 });

  // Dynamically register custom nodes
  const dynamicNodeTypes = {
    ...nodeTypes,
    ...Object.fromEntries(
      customNodes.map(cn => [cn.id, CustomNode])
    ),
  } as NodeTypes;

  // Update active flow when switching - also reset history
  useEffect(() => {
    const flow = storage.flows.find(f => f.id === storage.activeFlowId);
    if (flow) {
      setNodes(flow.nodes);
      setEdges(flow.edges);
      setNodeId(flow.nodeId);
      history.clear(flow.nodes, flow.edges);
    }
  }, [storage.activeFlowId, setNodes, setEdges, history]);

  // Take snapshot for history when nodes or edges change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      history.takeSnapshot(nodes, edges);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [nodes, edges, history]);

  // Save current flow to storage whenever data changes
  useEffect(() => {
    if (!storage.activeFlowId) return;
    
    const updatedFlows = storage.flows.map(flow =>
      flow.id === storage.activeFlowId
        ? { ...flow, nodes, edges, nodeId, updatedAt: new Date().toISOString() }
        : flow
    );
    
    const newStorage = { ...storage, flows: updatedFlows };
    setStorage(newStorage);
    saveToStorage(newStorage);
  }, [nodes, edges, nodeId]);

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

  // Keyboard shortcuts for delete, undo, redo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      const isTyping = event.target instanceof HTMLElement && 
                      ['INPUT', 'TEXTAREA'].includes(event.target.tagName);
      
      // Undo: Ctrl+Z (or Cmd+Z on Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        handleUndo();
        return;
      }
      
      // Redo: Ctrl+Y or Ctrl+Shift+Z (or Cmd on Mac)
      if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.shiftKey && event.key === 'z'))) {
        event.preventDefault();
        handleRedo();
        return;
      }
      
      // Delete
      if (event.key === 'Delete' || event.key === 'Backspace') {
        // Prevent backspace navigation
        if (event.key === 'Backspace' && !isTyping) {
          event.preventDefault();
        }
        if (!isTyping) {
          onDeleteSelected();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDeleteSelected]);

  // Undo handler
  const handleUndo = useCallback(() => {
    const previousState = history.undo();
    if (previousState) {
      setNodes(previousState.nodes);
      setEdges(previousState.edges);
      toast({
        title: "Undo",
        description: "Reverted last change",
      });
    }
  }, [history, setNodes, setEdges, toast]);

  // Redo handler
  const handleRedo = useCallback(() => {
    const nextState = history.redo();
    if (nextState) {
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      toast({
        title: "Redo",
        description: "Reapplied change",
      });
    }
  }, [history, setNodes, setEdges, toast]);

  const onAddNode = useCallback(
    (type: string, position?: { x: number; y: number }) => {
      const customNodeDef = customNodes.find(cn => cn.id === type);
      
      const newNode: Node = {
        id: nodeId.toString(),
        type: customNodeDef ? customNodeDef.id : type,
        position: position || {
          x: Math.random() * 400 + 100,
          y: Math.random() * 400 + 100,
        },
        data: getDefaultNodeData(type, customNodeDef),
      };
      
      setNodes((nds) => [...nds, newNode]);
      setNodeId((id) => id + 1);
    },
    [nodeId, customNodes, setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance || !reactFlowWrapper.current) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      onAddNode(type, position);
    },
    [reactFlowInstance, onAddNode]
  );

  const handleSelectFlow = useCallback((flowId: string) => {
    setStorage(prev => ({ ...prev, activeFlowId: flowId }));
  }, []);

  const handleCreateFlow = useCallback((name: string) => {
    const newFlow: Flow = {
      id: Date.now().toString(),
      name,
      nodes: [],
      edges: [],
      nodeId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const newStorage: FlowStorage = {
      flows: [...storage.flows, newFlow],
      activeFlowId: newFlow.id,
    };
    
    setStorage(newStorage);
    saveToStorage(newStorage);
    
    toast({
      title: "Flow Created",
      description: `"${name}" has been created`,
    });
  }, [storage.flows, toast]);

  const handleDeleteFlow = useCallback((flowId: string) => {
    const flowToDelete = storage.flows.find(f => f.id === flowId);
    const remainingFlows = storage.flows.filter(f => f.id !== flowId);
    
    let newActiveFlowId = storage.activeFlowId;
    if (flowId === storage.activeFlowId) {
      newActiveFlowId = remainingFlows[0]?.id || null;
    }
    
    const newStorage: FlowStorage = {
      flows: remainingFlows,
      activeFlowId: newActiveFlowId,
    };
    
    setStorage(newStorage);
    saveToStorage(newStorage);
    
    toast({
      title: "Flow Deleted",
      description: `"${flowToDelete?.name}" has been deleted`,
    });
  }, [storage, toast]);

  const handleRenameFlow = useCallback((flowId: string, newName: string) => {
    const updatedFlows = storage.flows.map(flow =>
      flow.id === flowId
        ? { ...flow, name: newName, updatedAt: new Date().toISOString() }
        : flow
    );
    
    const newStorage = { ...storage, flows: updatedFlows };
    setStorage(newStorage);
    saveToStorage(newStorage);
    
    toast({
      title: "Flow Renamed",
      description: `Renamed to "${newName}"`,
    });
  }, [storage, toast]);

  const onClearCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setNodeId(1);
    toast({
      title: "Canvas Cleared",
      description: "All nodes and connections have been removed",
    });
  }, [setNodes, setEdges, toast]);

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

  const exportAsPNG = useCallback(async () => {
    if (!reactFlowWrapper.current) return;

    try {
      const canvas = await html2canvas(reactFlowWrapper.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `flow-${activeFlow.name}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: "Exported as PNG",
        description: "Flow has been exported as an image",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export as PNG",
        variant: "destructive",
      });
    }
  }, [activeFlow.name, toast]);

  // Custom Node Management
  const handleSaveCustomNode = useCallback((definition: CustomNodeDefinition) => {
    setCustomNodes(prev => {
      const existing = prev.find(cn => cn.id === definition.id);
      const updated = existing 
        ? prev.map(cn => cn.id === definition.id ? definition : cn)
        : [...prev, definition];
      
      saveCustomNodes(updated);
      
      toast({
        title: existing ? "Node Type Updated" : "Node Type Created",
        description: `Custom node type "${definition.name}" has been ${existing ? 'updated' : 'created'}`,
      });
      
      return updated;
    });
  }, [toast]);


  return (
    <div className="flex h-screen w-full bg-background">
      <NodePalette 
        onAddNode={onAddNode} 
        customNodes={customNodes}
        onManageCustomNodes={() => setIsCustomNodeBuilderOpen(true)}
      />
      
      <div className="flex-1 flex flex-col">
        <FlowManager
          flows={storage.flows}
          activeFlowId={storage.activeFlowId}
          onSelectFlow={handleSelectFlow}
          onCreateFlow={handleCreateFlow}
          onDeleteFlow={handleDeleteFlow}
          onRenameFlow={handleRenameFlow}
        />
        
        <div 
          className="flex-1 relative" 
          ref={reactFlowWrapper}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={importFromJSON}
          className="hidden"
        />
        <div className="absolute top-4 left-4 z-10 bg-card/95 backdrop-blur border border-border rounded-lg p-3 shadow-lg">
          <p className="text-xs text-muted-foreground">
            {nodes.length} nodes • {edges.length} connections • Auto-saved
          </p>
        </div>

        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="w-4 h-4" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleUndo} disabled={!history.canUndo}>
                <Undo2 className="w-4 h-4 mr-2" />
                Undo
                <span className="ml-auto text-xs text-muted-foreground">⌘Z</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRedo} disabled={!history.canRedo}>
                <Redo2 className="w-4 h-4 mr-2" />
                Redo
                <span className="ml-auto text-xs text-muted-foreground">⌘Y</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={exportToJSON}>
                <FileJson className="w-4 h-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportAsPNG}>
                <FileImage className="w-4 h-4 mr-2" />
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Import JSON
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onClearCanvas} className="text-destructive focus:text-destructive">
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear Canvas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteSelected}
            className="gap-2"
            disabled={!nodes.some(n => n.selected)}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={onNodeDoubleClick}
          onInit={setReactFlowInstance}
          nodeTypes={dynamicNodeTypes}
          fitView
          className="bg-canvas-bg"
        >
          <Background color="hsl(var(--canvas-grid))" gap={20} size={1} />
          <Controls className="bg-card border-border" />
          <MiniMap
            className="bg-card border-border"
            nodeColor={(node) => {
              // Check if it's a custom node
              const customNode = customNodes.find(cn => cn.id === node.type);
              if (customNode) {
                return customNode.color;
              }
              
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
          customNodeDefinition={
            editingNode?.type ? customNodes.find(cn => cn.id === editingNode.type) : undefined
          }
        />

        <CustomNodeBuilder
          open={isCustomNodeBuilderOpen}
          onOpenChange={setIsCustomNodeBuilderOpen}
          onSave={handleSaveCustomNode}
        />
      </div>
      </div>
    </div>
  );
};

export default Index;
