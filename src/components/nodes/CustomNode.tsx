import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Info, icons } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CustomNodeDefinition } from '@/types/customNode';

interface CustomNodeProps {
  data: {
    label: string;
    customDefinition?: CustomNodeDefinition;
    customData?: Record<string, any>;
    width?: number;
    height?: number;
  };
  selected?: boolean;
}

export const CustomNode = ({ data, selected }: CustomNodeProps) => {
  const defaultWidth = 256;
  const scale = (data.width || defaultWidth) / defaultWidth;
  
  const IconComponent = data.customDefinition?.icon 
    ? icons[data.customDefinition.icon as keyof typeof icons] 
    : icons.Box;

  return (
    <div 
      style={{ 
        width: data.width || 256, 
        height: data.height || 'auto' 
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3"
        style={{ background: '#555' }}
      />
      
      {selected && <NodeResizer minWidth={200} minHeight={100} />}
      
      <Card 
        className="p-4 shadow-lg border-2 transition-all duration-200 h-full"
        style={{ 
          borderColor: selected ? data.customDefinition?.color || '#3b82f6' : 'transparent',
          backgroundColor: data.customDefinition?.color ? `${data.customDefinition.color}10` : undefined,
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {IconComponent && (
              <div 
                className="flex-shrink-0 p-1.5 rounded"
                style={{ backgroundColor: data.customDefinition?.color || '#3b82f6' }}
              >
                <IconComponent 
                  className="text-white" 
                  size={Math.max(16, 20 * scale)}
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div 
                className="font-semibold truncate"
                style={{ fontSize: `${Math.max(12, 14 * scale)}px` }}
              >
                {data.label}
              </div>
              <div 
                className="text-xs text-muted-foreground truncate"
                style={{ fontSize: `${Math.max(10, 11 * scale)}px` }}
              >
                {data.customDefinition?.name || 'Custom Node'}
              </div>
            </div>
          </div>
          
          {data.customData && Object.keys(data.customData).length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex-shrink-0">
                    <Info 
                      className="text-muted-foreground cursor-help" 
                      size={Math.max(14, 16 * scale)} 
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <div className="space-y-1.5">
                    {data.customDefinition?.fields.map(field => {
                      const value = data.customData?.[field.id];
                      if (!value) return null;
                      return (
                        <div key={field.id} className="text-xs">
                          <span className="font-medium">{field.label}:</span>{' '}
                          <span className="text-muted-foreground">{String(value)}</span>
                        </div>
                      );
                    })}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </Card>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3"
        style={{ background: '#555' }}
      />
    </div>
  );
};
