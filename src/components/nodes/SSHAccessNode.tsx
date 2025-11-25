import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Terminal, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SSHAccessNodeProps {
  data: {
    label: string;
    host?: string;
    port?: number;
    username?: string;
    authType?: string;
    width?: number;
    height?: number;
  };
  selected?: boolean;
}

export const SSHAccessNode = ({ data, selected }: SSHAccessNodeProps) => {
  const defaultWidth = 256;
  const scale = (data.width || defaultWidth) / defaultWidth;
  const style = {
    width: data.width || defaultWidth,
    height: data.height || 'auto',
  };

  return (
    <div 
      style={{ 
        width: data.width || 256, 
        height: data.height || 'auto' 
      }}
    >
      {selected && (
        <NodeResizer 
          color="hsl(var(--node-ssh))" 
          minWidth={150}
          minHeight={100}
        />
      )}
      <Card className="border-2 border-node-ssh bg-card/95 backdrop-blur h-full">
        <Handle type="target" position={Position.Top} className="!bg-node-ssh" />

        <div className="p-3 space-y-2" style={{ fontSize: `${scale}rem` }}>
          <div className="flex items-center gap-2">
            <div className="rounded bg-node-ssh/20 flex items-center justify-center" style={{ width: `${scale * 32}px`, height: `${scale * 32}px` }}>
              <Terminal style={{ width: `${scale * 16}px`, height: `${scale * 16}px` }} className="text-node-ssh" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate" style={{ fontSize: `${scale * 0.875}rem` }}>{data.label}</div>
              <div className="text-muted-foreground" style={{ fontSize: `${scale * 0.75}rem` }}>SSH Access</div>
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
                    {data.host && (
                      <div>
                        <div className="font-semibold text-xs">Host</div>
                        <div className="text-xs font-mono">{data.host}:{data.port || 22}</div>
                      </div>
                    )}
                    {data.username && (
                      <div>
                        <div className="font-semibold text-xs">Username</div>
                        <div className="text-xs">{data.username}</div>
                      </div>
                    )}
                    {data.authType && (
                      <div>
                        <div className="font-semibold text-xs">Auth Type</div>
                        <div className="text-xs">{data.authType}</div>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Handle type="source" position={Position.Bottom} className="!bg-node-ssh" />
      </Card>
    </div>
  );
};
