import { Handle, Position } from '@xyflow/react';
import { Terminal, Key } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SSHAccessNodeProps {
  data: {
    label: string;
    host?: string;
    port?: number;
    username?: string;
    authType?: string;
  };
}

export const SSHAccessNode = ({ data }: SSHAccessNodeProps) => {
  return (
    <Card className="w-64 border-2 border-node-ssh bg-card/95 backdrop-blur">
      <Handle type="target" position={Position.Top} className="!bg-node-ssh" />
      
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-node-ssh/20 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-node-ssh" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{data.label}</div>
            <div className="text-xs text-muted-foreground">SSH Access</div>
          </div>
        </div>
        
        {data.host && (
          <div className="text-xs font-mono bg-secondary/50 p-2 rounded">
            <div className="truncate">{data.host}:{data.port || 22}</div>
            {data.username && (
              <div className="text-muted-foreground mt-1">user: {data.username}</div>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          {data.authType && (
            <Badge variant="outline" className="text-xs gap-1">
              <Key className="w-3 h-3" />
              {data.authType}
            </Badge>
          )}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!bg-node-ssh" />
    </Card>
  );
};
