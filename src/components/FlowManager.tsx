import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Flow } from '@/types/flow';

interface FlowManagerProps {
  flows: Flow[];
  activeFlowId: string | null;
  onSelectFlow: (flowId: string) => void;
  onCreateFlow: (name: string) => void;
  onDeleteFlow: (flowId: string) => void;
  onRenameFlow: (flowId: string, newName: string) => void;
}

export const FlowManager = ({
  flows,
  activeFlowId,
  onSelectFlow,
  onCreateFlow,
  onDeleteFlow,
  onRenameFlow,
}: FlowManagerProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [newFlowName, setNewFlowName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleTabDoubleClick = (flow: Flow) => {
    setEditingId(flow.id);
    setEditingName(flow.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      onRenameFlow(editingId, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleCreateFlow = () => {
    if (newFlowName.trim()) {
      onCreateFlow(newFlowName.trim());
      setNewFlowName('');
      setIsCreating(false);
    }
  };

  const handleDeleteClick = (flowId: string) => {
    setDeleteConfirm(flowId);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      onDeleteFlow(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1 bg-muted/30 border-b border-border px-2 py-1 overflow-x-auto">
        {flows.map((flow) => (
          <div
            key={flow.id}
            className={`
              group flex items-center gap-2 px-3 py-1.5 rounded-t-md cursor-pointer
              transition-colors min-w-[120px] max-w-[200px]
              ${flow.id === activeFlowId 
                ? 'bg-background border-t border-x border-border text-foreground' 
                : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
              }
            `}
            onClick={() => onSelectFlow(flow.id)}
            onDoubleClick={() => handleTabDoubleClick(flow)}
          >
            {editingId === flow.id ? (
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="h-6 text-sm px-1 py-0"
                autoFocus
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                onBlur={handleSaveEdit}
              />
            ) : (
              <>
                <span className="text-sm truncate flex-1">{flow.name}</span>
                {flows.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(flow.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:bg-muted-foreground/20 rounded p-0.5 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </>
            )}
          </div>
        ))}
        
        {isCreating ? (
          <div className="flex items-center gap-1 px-2 py-1 bg-background rounded-t-md border-t border-x border-border min-w-[150px]">
            <Input
              value={newFlowName}
              onChange={(e) => setNewFlowName(e.target.value)}
              placeholder="Flow name..."
              className="h-6 text-sm px-2 py-0"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFlow();
                if (e.key === 'Escape') setIsCreating(false);
              }}
              onBlur={() => {
                if (newFlowName.trim()) {
                  handleCreateFlow();
                } else {
                  setIsCreating(false);
                }
              }}
            />
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCreating(true)}
            className="h-7 w-7 p-0 ml-1"
            title="New flow"
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Flow?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the flow and all its nodes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
