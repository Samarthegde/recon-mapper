import { Handle, Position } from '@xyflow/react';
import { Globe, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WebEndpointNodeProps {
  data: {
    label: string;
    url?: string;
    method?: string;
    authType?: string;
    status?: number;
  };
}

export const WebEndpointNode = ({ data }: WebEndpointNodeProps) => {
  return (
    <Card className="w-64 border-2 border-node-web bg-card/95 backdrop-blur">
      <Handle type="target" position={Position.Top} className="!bg-node-web" />
      
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-node-web/20 flex items-center justify-center">
            <Globe className="w-4 h-4 text-node-web" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{data.label}</div>
            <div className="text-xs text-muted-foreground">Web Endpoint</div>
          </div>
        </div>
        
        {data.url && (
          <div className="text-xs font-mono bg-secondary/50 p-2 rounded truncate">
            {data.url}
          </div>
        )}
        
        <div className="flex gap-2 flex-wrap">
          {data.method && (
            <Badge variant="secondary" className="text-xs">
              {data.method}
            </Badge>
          )}
          {data.authType && data.authType !== 'none' && (
            <Badge variant="outline" className="text-xs gap-1">
              <Lock className="w-3 h-3" />
              {data.authType}
            </Badge>
          )}
          {data.status && (
            <Badge 
              variant={data.status < 400 ? "default" : "destructive"}
              className="text-xs"
            >
              {data.status}
            </Badge>
          )}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!bg-node-web" />
    </Card>
  );
};
