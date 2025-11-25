import { Handle, Position, NodeResizer } from '@xyflow/react';
import { FileText, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ArtifactNodeProps {
  data: {
    label: string;
    filePath?: string;
    fileType?: string;
    hash?: string;
    size?: number;
    width?: number;
    height?: number;
  };
  selected?: boolean;
}

const formatBytes = (bytes?: number) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

export const ArtifactNode = ({ data, selected }: ArtifactNodeProps) => {
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
          color="hsl(var(--node-artifact))" 
          minWidth={150}
          minHeight={100}
        />
      )}
      <Card className="border-2 border-node-artifact bg-card/95 backdrop-blur h-full">
        <Handle type="target" position={Position.Top} className="!bg-node-artifact" />

        <div className="p-3 space-y-2" style={{ fontSize: `${scale}rem` }}>
          <div className="flex items-center gap-2">
            <div className="rounded bg-node-artifact/20 flex items-center justify-center" style={{ width: `${scale * 32}px`, height: `${scale * 32}px` }}>
              <FileText style={{ width: `${scale * 16}px`, height: `${scale * 16}px` }} className="text-node-artifact" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate" style={{ fontSize: `${scale * 0.875}rem` }}>{data.label}</div>
              <div className="text-muted-foreground" style={{ fontSize: `${scale * 0.75}rem` }}>Artifact</div>
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
                    {data.filePath && (
                      <div>
                        <div className="font-semibold text-xs">File Path</div>
                        <div className="text-xs font-mono break-all">{data.filePath}</div>
                      </div>
                    )}
                    {data.fileType && (
                      <div>
                        <div className="font-semibold text-xs">Type</div>
                        <div className="text-xs">{data.fileType}</div>
                      </div>
                    )}
                    {data.size && (
                      <div>
                        <div className="font-semibold text-xs">Size</div>
                        <div className="text-xs">{formatBytes(data.size)}</div>
                      </div>
                    )}
                    {data.hash && (
                      <div>
                        <div className="font-semibold text-xs">Hash</div>
                        <div className="text-xs font-mono break-all">{data.hash}</div>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Handle type="source" position={Position.Bottom} className="!bg-node-artifact" />
      </Card>
    </div>
  );
};
