import { Handle, Position, NodeResizer } from '@xyflow/react';
import { FileText, Hash } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

export const ArtifactNode = ({ data, selected }: ArtifactNodeProps) => {
  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

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
          </div>

          {data.filePath && (
            <div className="font-mono bg-secondary/50 p-2 rounded truncate" style={{ fontSize: `${scale * 0.75}rem` }}>
              {data.filePath}
            </div>
          )}

          {data.hash && (
            <div className="font-mono bg-secondary/50 p-2 rounded flex items-center gap-2" style={{ fontSize: `${scale * 0.75}rem` }}>
              <Hash style={{ width: `${scale * 12}px`, height: `${scale * 12}px` }} className="text-muted-foreground flex-shrink-0" />
              <span className="truncate">{data.hash.substring(0, 16)}...</span>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            {data.fileType && (
              <Badge variant="secondary" style={{ fontSize: `${scale * 0.75}rem` }}>
                {data.fileType}
              </Badge>
            )}
            {data.size && (
              <Badge variant="outline" style={{ fontSize: `${scale * 0.75}rem` }}>
                {formatSize(data.size)}
              </Badge>
            )}
          </div>
        </div>

        <Handle type="source" position={Position.Bottom} className="!bg-node-artifact" />
      </Card>
    </div>
  );
};
