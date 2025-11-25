import { Handle, Position } from '@xyflow/react';
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
  };
}

export const ArtifactNode = ({ data }: ArtifactNodeProps) => {
  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <Card className="w-64 border-2 border-node-artifact bg-card/95 backdrop-blur">
      <Handle type="target" position={Position.Top} className="!bg-node-artifact" />
      
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-node-artifact/20 flex items-center justify-center">
            <FileText className="w-4 h-4 text-node-artifact" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{data.label}</div>
            <div className="text-xs text-muted-foreground">Artifact</div>
          </div>
        </div>
        
        {data.filePath && (
          <div className="text-xs font-mono bg-secondary/50 p-2 rounded truncate">
            {data.filePath}
          </div>
        )}
        
        {data.hash && (
          <div className="text-xs font-mono bg-secondary/50 p-2 rounded flex items-center gap-2">
            <Hash className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{data.hash.substring(0, 16)}...</span>
          </div>
        )}
        
        <div className="flex gap-2 flex-wrap">
          {data.fileType && (
            <Badge variant="secondary" className="text-xs">
              {data.fileType}
            </Badge>
          )}
          {data.size && (
            <Badge variant="outline" className="text-xs">
              {formatSize(data.size)}
            </Badge>
          )}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!bg-node-artifact" />
    </Card>
  );
};
