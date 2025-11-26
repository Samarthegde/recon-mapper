import { Globe, Terminal, Monitor, Key, FileText, Plus, icons } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CustomNodeDefinition } from "@/types/customNode";

interface NodePaletteProps {
  onAddNode: (type: string) => void;
  customNodes?: CustomNodeDefinition[];
  onManageCustomNodes?: () => void;
}

const nodeTypes = [
  {
    category: "INPUT",
    nodes: [
      { type: "web", icon: Globe, label: "Web Endpoint", color: "node-web" },
    ],
  },
  {
    category: "NETWORK",
    nodes: [
      { type: "ssh", icon: Terminal, label: "SSH Access", color: "node-ssh" },
      { type: "rdp", icon: Monitor, label: "RDP Access", color: "node-rdp" },
    ],
  },
  {
    category: "SECURITY",
    nodes: [
      { type: "credential", icon: Key, label: "Credential", color: "node-credential" },
    ],
  },
  {
    category: "DATA",
    nodes: [
      { type: "artifact", icon: FileText, label: "Artifact", color: "node-artifact" },
    ],
  },
];

export const NodePalette = ({ onAddNode, customNodes, onManageCustomNodes }: NodePaletteProps) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 h-full bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-primary tracking-wider">NODE PALETTE</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {nodeTypes.map((category) => (
          <div key={category.category}>
            <div className="text-xs font-semibold text-muted-foreground mb-2 px-1 tracking-widest">
              {category.category}
            </div>
            <div className="space-y-2">
              {category.nodes.map((node) => {
                const Icon = node.icon;
                return (
                  <Card
                    key={node.type}
                    className="p-3 cursor-grab active:cursor-grabbing hover:bg-secondary/50 transition-all border-l-2 hover:border-l-4 animate-scale-in"
                    style={{
                      borderLeftColor: `hsl(var(--${node.color}))`,
                    }}
                    draggable
                    onDragStart={(event) => onDragStart(event, node.type)}
                    onClick={() => onAddNode(node.type)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center"
                        style={{
                          backgroundColor: `hsl(var(--${node.color}) / 0.2)`,
                          color: `hsl(var(--${node.color}))`,
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium">{node.label}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}

        {/* Custom Nodes */}
        {customNodes && customNodes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="text-xs font-semibold text-muted-foreground tracking-widest">
                CUSTOM
              </div>
            </div>
            <div className="space-y-2">
              {customNodes.map((customNode) => {
                const IconComponent = icons[customNode.icon as keyof typeof icons] || icons.Box;
                return (
                  <Card
                    key={customNode.id}
                    className="p-3 cursor-grab active:cursor-grabbing hover:bg-secondary/50 transition-all border-l-2 hover:border-l-4 animate-scale-in"
                    style={{
                      borderLeftColor: customNode.color,
                    }}
                    draggable
                    onDragStart={(event) => onDragStart(event, customNode.id)}
                    onClick={() => onAddNode(customNode.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center"
                        style={{
                          backgroundColor: `${customNode.color}20`,
                          color: customNode.color,
                        }}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium">{customNode.name}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      <Separator />
      
      <div className="p-3 space-y-3">
        {onManageCustomNodes && (
          <Button 
            onClick={onManageCustomNodes} 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
          >
            <Plus className="w-4 h-4 mr-2" />
            Manage Custom Nodes
          </Button>
        )}
        
        <div className="text-xs text-muted-foreground">
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Quick Tips:</p>
            <p>• Drag nodes to canvas</p>
            <p>• Double-click to edit</p>
            <p>• Delete/Backspace to remove</p>
          </div>
        </div>
      </div>
    </div>
  );
};
