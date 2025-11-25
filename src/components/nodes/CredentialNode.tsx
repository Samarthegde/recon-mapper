import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Key, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CredentialNodeProps {
  data: {
    label: string;
    type?: string;
    username?: string;
    value?: string;
    width?: number;
    height?: number;
  };
  selected?: boolean;
}

export const CredentialNode = ({ data, selected }: CredentialNodeProps) => {
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
          color="hsl(var(--node-credential))" 
          minWidth={150}
          minHeight={100}
        />
      )}
      <Card className="border-2 border-node-credential bg-card/95 backdrop-blur h-full">
        <Handle type="target" position={Position.Top} className="!bg-node-credential" />

        <div className="p-3 space-y-2" style={{ fontSize: `${scale}rem` }}>
          <div className="flex items-center gap-2">
            <div className="rounded bg-node-credential/20 flex items-center justify-center" style={{ width: `${scale * 32}px`, height: `${scale * 32}px` }}>
              <Key style={{ width: `${scale * 16}px`, height: `${scale * 16}px` }} className="text-node-credential" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate" style={{ fontSize: `${scale * 0.875}rem` }}>{data.label}</div>
              <div className="text-muted-foreground" style={{ fontSize: `${scale * 0.75}rem` }}>Credential</div>
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
                    {data.type && (
                      <div>
                        <div className="font-semibold text-xs">Type</div>
                        <div className="text-xs">{data.type}</div>
                      </div>
                    )}
                    {data.username && (
                      <div>
                        <div className="font-semibold text-xs">Username</div>
                        <div className="text-xs font-mono">{data.username}</div>
                      </div>
                    )}
                    {data.value && (
                      <div>
                        <div className="font-semibold text-xs">Value</div>
                        <div className="text-xs font-mono break-all">{'•'.repeat(Math.min(data.value.length, 30))}</div>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Handle type="source" position={Position.Bottom} className="!bg-node-credential" />
      </Card>
    </div>
  );
};
