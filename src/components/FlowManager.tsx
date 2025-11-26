import { useState } from 'react';
import { Folder, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
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

  const handleStartEdit = (flow: Flow) => {
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
    <div className="w-64 h-full bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-primary tracking-wider">FLOWS</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCreating(true)}
          className="h-7 w-7 p-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {isCreating && (
            <Card className="p-2 space-y-2 animate-scale-in">
              <Input
                value={newFlowName}
                onChange={(e) => setNewFlowName(e.target.value)}
                placeholder="Flow name..."
                className="h-8 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateFlow();
                  if (e.key === 'Escape') setIsCreating(false);
                }}
              />
              <div className="flex gap-1">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleCreateFlow}
                  className="flex-1 h-7"
                  disabled={!newFlowName.trim()}
                >
                  <Check className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 h-7"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          )}

          {flows.map((flow) => (
            <Card
              key={flow.id}
              className={`p-3 cursor-pointer transition-all hover:bg-secondary/50 ${
                flow.id === activeFlowId ? 'border-primary border-2' : ''
              }`}
              onClick={() => onSelectFlow(flow.id)}
            >
              {editingId === flow.id ? (
                <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="h-7 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                  />
                  <div className="flex gap-1">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSaveEdit}
                      className="flex-1 h-6"
                      disabled={!editingName.trim()}
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="flex-1 h-6"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{flow.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {flow.nodes.length} nodes
                      </p>
                    </div>
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(flow)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(flow.id)}
                        className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                        disabled={flows.length === 1}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Updated {new Date(flow.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border text-xs text-muted-foreground">
        <p className="font-semibold text-foreground mb-1">Tips:</p>
        <p>• Click to switch flows</p>
        <p>• + to create new flow</p>
        <p>• Edit/delete flow actions</p>
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
    </div>
  );
};
