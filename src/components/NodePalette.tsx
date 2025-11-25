import { Globe, Terminal, Monitor, Key, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface NodePaletteProps {
  onAddNode: (type: string) => void;
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

export const NodePalette = ({ onAddNode }: NodePaletteProps) => {
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
                    className="p-3 cursor-pointer hover:bg-secondary/50 transition-all border-l-2 hover:border-l-4"
                    style={{
                      borderLeftColor: `hsl(var(--${node.color}))`,
                    }}
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
      </div>
      
      <Separator />
      
      <div className="p-4 text-xs text-muted-foreground">
        <div className="space-y-1">
          <p className="font-semibold text-foreground">Quick Tips:</p>
          <p>• Click nodes to add to canvas</p>
          <p>• Drag nodes to position</p>
          <p>• Connect with handles</p>
        </div>
      </div>
    </div>
  );
};
