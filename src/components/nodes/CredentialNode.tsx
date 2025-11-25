import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Key, Eye, EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

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
  const [showValue, setShowValue] = useState(false);

  const maskValue = (value: string) => {
    if (!value) return '';
    return showValue ? value : '•'.repeat(Math.min(value.length, 20));
  };

  const style = {
    width: data.width || 256,
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
          color="hsl(var(--node-credential))" 
          minWidth={150}
          minHeight={100}
        />
      )}
      <Card className="border-2 border-node-credential bg-card/95 backdrop-blur h-full">
        <Handle type="target" position={Position.Top} className="!bg-node-credential" />

        <div className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-node-credential/20 flex items-center justify-center">
              <Key className="w-4 h-4 text-node-credential" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{data.label}</div>
              <div className="text-xs text-muted-foreground">Credential</div>
            </div>
          </div>

          {data.username && (
            <div className="text-xs font-mono bg-secondary/50 p-2 rounded truncate">
              user: {data.username}
            </div>
          )}

          {data.value && (
            <div className="text-xs font-mono bg-secondary/50 p-2 rounded flex items-center justify-between gap-2">
              <span className="truncate">{maskValue(data.value)}</span>
              <button
                onClick={() => setShowValue(!showValue)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showValue ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
            </div>
          )}

          <div className="flex gap-2">
            {data.type && (
              <Badge variant="outline" className="text-xs">
                {data.type}
              </Badge>
            )}
          </div>
        </div>

        <Handle type="source" position={Position.Bottom} className="!bg-node-credential" />
      </Card>
    </div>
  );
};
