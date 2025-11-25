import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Globe, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="rounded-full hover:bg-secondary/80 p-1 transition-colors">
                    <Info style={{ width: `${scale * 14}px`, height: `${scale * 14}px` }} className="text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-2">
                    {data.url && (
                      <div>
                        <div className="font-semibold text-xs">URL</div>
                        <div className="text-xs font-mono break-all">{data.url}</div>
                      </div>
                    )}
                    {data.method && (
                      <div>
                        <div className="font-semibold text-xs">Method</div>
                        <div className="text-xs">{data.method}</div>
                      </div>
                    )}
                    {data.authType && data.authType !== 'none' && (
                      <div>
                        <div className="font-semibold text-xs">Auth Type</div>
                        <div className="text-xs">{data.authType}</div>
                      </div>
                    )}
                    {data.status && (
                      <div>
                        <div className="font-semibold text-xs">Status</div>
                        <div className="text-xs">{data.status}</div>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Handle type="source" position={Position.Bottom} className="!bg-node-web" />
      </Card>
    </div>
  );
};
