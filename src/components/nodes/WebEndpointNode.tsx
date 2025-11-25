import { Handle, Position, NodeResizer } from '@xyflow/react';
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
    width?: number;
    height?: number;
  };
  selected?: boolean;
}

export const WebEndpointNode = ({ data, selected }: WebEndpointNodeProps) => {
  const defaultWidth = 256;
  const scale = (data.width || defaultWidth) / defaultWidth;
  
  return (
    <div 
      style={{ 
        width: data.width || 256, 
        height: data.height || 'auto' 
      }}
    >
      {selected && (
        <NodeResizer 
          color="hsl(var(--node-web))" 
          minWidth={150}
          minHeight={100}
        />
      )}
      <Card className="border-2 border-node-web bg-card/95 backdrop-blur h-full">
        <Handle type="target" position={Position.Top} className="!bg-node-web" />

        <div className="p-3 space-y-2" style={{ fontSize: `${scale}rem` }}>
          <div className="flex items-center gap-2">
            <div className="rounded bg-node-web/20 flex items-center justify-center" style={{ width: `${scale * 32}px`, height: `${scale * 32}px` }}>
              <Globe style={{ width: `${scale * 16}px`, height: `${scale * 16}px` }} className="text-node-web" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate" style={{ fontSize: `${scale * 0.875}rem` }}>{data.label}</div>
              <div className="text-muted-foreground" style={{ fontSize: `${scale * 0.75}rem` }}>Web Endpoint</div>
            </div>
          </div>

          {data.url && (
            <div className="font-mono bg-secondary/50 p-2 rounded truncate" style={{ fontSize: `${scale * 0.75}rem` }}>
              {data.url}
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            {data.method && (
              <Badge variant="secondary" style={{ fontSize: `${scale * 0.75}rem` }}>
                {data.method}
              </Badge>
            )}
            {data.authType && data.authType !== 'none' && (
              <Badge variant="outline" className="gap-1" style={{ fontSize: `${scale * 0.75}rem` }}>
                <Lock style={{ width: `${scale * 12}px`, height: `${scale * 12}px` }} />
                {data.authType}
              </Badge>
            )}
            {data.status && (
              <Badge
                variant={data.status < 400 ? "default" : "destructive"}
                style={{ fontSize: `${scale * 0.75}rem` }}
              >
                {data.status}
              </Badge>
            )}
          </div>
        </div>

        <Handle type="source" position={Position.Bottom} className="!bg-node-web" />
      </Card>
    </div>
  );
};
