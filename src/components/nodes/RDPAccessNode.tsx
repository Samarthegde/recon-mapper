import { Handle, Position } from '@xyflow/react';
import { Monitor } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RDPAccessNodeProps {
  data: {
    label: string;
    host?: string;
    port?: number;
    username?: string;
    domain?: string;
  };
}

export const RDPAccessNode = ({ data }: RDPAccessNodeProps) => {
  return (
    <Card className="w-64 border-2 border-node-rdp bg-card/95 backdrop-blur">
      <Handle type="target" position={Position.Top} className="!bg-node-rdp" />
      
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-node-rdp/20 flex items-center justify-center">
            <Monitor className="w-4 h-4 text-node-rdp" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{data.label}</div>
            <div className="text-xs text-muted-foreground">RDP Access</div>
          </div>
        </div>
        
        {data.host && (
          <div className="text-xs font-mono bg-secondary/50 p-2 rounded">
            <div className="truncate">{data.host}:{data.port || 3389}</div>
            {data.username && (
              <div className="text-muted-foreground mt-1">
                {data.domain ? `${data.domain}\\` : ''}{data.username}
              </div>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs">
            RDP
          </Badge>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!bg-node-rdp" />
    </Card>
  );
};
