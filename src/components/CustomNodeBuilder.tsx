import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { CustomNodeDefinition, CustomFieldDefinition, FieldType } from '@/types/customNode';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';

interface CustomNodeBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (definition: CustomNodeDefinition) => void;
  editingNode?: CustomNodeDefinition;
}

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'select', label: 'Dropdown' },
  { value: 'url', label: 'URL' },
  { value: 'email', label: 'Email' },
];

const LUCIDE_ICONS = [
  'Box', 'Database', 'Server', 'Cloud', 'Code', 'FileText', 'Image',
  'Lock', 'Mail', 'Phone', 'User', 'Users', 'Settings', 'Tool',
  'Package', 'Layers', 'Zap', 'Activity', 'BarChart', 'PieChart'
];

export const CustomNodeBuilder = ({ open, onOpenChange, onSave, editingNode }: CustomNodeBuilderProps) => {
  const [nodeName, setNodeName] = useState(editingNode?.name || '');
  const [nodeIcon, setNodeIcon] = useState(editingNode?.icon || 'Box');
  const [nodeColor, setNodeColor] = useState(editingNode?.color || '#3b82f6');
  const [fields, setFields] = useState<CustomFieldDefinition[]>(editingNode?.fields || []);

  const handleAddField = () => {
    const newField: CustomFieldDefinition = {
      id: `field-${Date.now()}`,
      label: '',
      type: 'text',
      validation: { required: false },
    };
    setFields([...fields, newField]);
  };

  const handleUpdateField = (index: number, updates: Partial<CustomFieldDefinition>) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], ...updates };
    setFields(updatedFields);
  };

  const handleDeleteField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleUpdateValidation = (index: number, key: string, value: any) => {
    const updatedFields = [...fields];
    updatedFields[index] = {
      ...updatedFields[index],
      validation: {
        ...updatedFields[index].validation,
        [key]: value,
      },
    };
    setFields(updatedFields);
  };

  const handleSave = () => {
    if (!nodeName.trim()) {
      return;
    }

    const definition: CustomNodeDefinition = {
      id: editingNode?.id || `custom-${Date.now()}`,
      name: nodeName.trim(),
      icon: nodeIcon,
      color: nodeColor,
      fields: fields.filter(f => f.label.trim()),
      createdAt: editingNode?.createdAt || new Date().toISOString(),
    };

    onSave(definition);
    handleReset();
    onOpenChange(false);
  };

  const handleReset = () => {
    setNodeName('');
    setNodeIcon('Box');
    setNodeColor('#3b82f6');
    setFields([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingNode ? 'Edit Custom Node Type' : 'Create Custom Node Type'}
          </DialogTitle>
          <DialogDescription>
            Define a custom node type with your own fields and validation rules.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nodeName">Node Type Name *</Label>
              <Input
                id="nodeName"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                placeholder="e.g., Database Connection"
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nodeIcon">Icon</Label>
              <Select value={nodeIcon} onValueChange={setNodeIcon}>
                <SelectTrigger id="nodeIcon">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LUCIDE_ICONS.map(icon => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nodeColor">Color</Label>
              <div className="flex gap-2">
                <Input
                  id="nodeColor"
                  type="color"
                  value={nodeColor}
                  onChange={(e) => setNodeColor(e.target.value)}
                  className="w-20 h-10 p-1"
                />
                <Input
                  value={nodeColor}
                  onChange={(e) => setNodeColor(e.target.value)}
                  placeholder="#3b82f6"
                />
              </div>
            </div>
          </div>

          {/* Custom Fields */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">Custom Fields</Label>
              <Button onClick={handleAddField} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Field
              </Button>
            </div>

            {fields.length === 0 ? (
              <Card className="p-6 text-center text-muted-foreground">
                No fields added yet. Click "Add Field" to create custom fields.
              </Card>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <Card key={field.id} className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <GripVertical className="w-5 h-5 text-muted-foreground mt-7" />
                      
                      <div className="flex-1 grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label>Field Label *</Label>
                          <Input
                            value={field.label}
                            onChange={(e) => handleUpdateField(index, { label: e.target.value })}
                            placeholder="e.g., Host"
                            maxLength={50}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Field Type</Label>
                          <Select
                            value={field.type}
                            onValueChange={(value: FieldType) => handleUpdateField(index, { type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {FIELD_TYPES.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Placeholder</Label>
                          <Input
                            value={field.placeholder || ''}
                            onChange={(e) => handleUpdateField(index, { placeholder: e.target.value })}
                            placeholder="Optional hint"
                            maxLength={100}
                          />
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteField(index)}
                        className="mt-7"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Options for select fields */}
                    {field.type === 'select' && (
                      <div className="ml-8 space-y-2">
                        <Label>Options (comma-separated)</Label>
                        <Textarea
                          value={field.options?.join(', ') || ''}
                          onChange={(e) => handleUpdateField(index, {
                            options: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          })}
                          placeholder="Option 1, Option 2, Option 3"
                          rows={2}
                        />
                      </div>
                    )}

                    {/* Validation */}
                    <div className="ml-8 space-y-3 pt-2 border-t">
                      <Label className="text-sm font-medium">Validation Rules</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`required-${field.id}`}
                            checked={field.validation?.required || false}
                            onCheckedChange={(checked) => handleUpdateValidation(index, 'required', checked)}
                          />
                          <Label htmlFor={`required-${field.id}`} className="font-normal cursor-pointer">
                            Required field
                          </Label>
                        </div>

                        {(field.type === 'text' || field.type === 'textarea') && (
                          <>
                            <div className="space-y-1">
                              <Label className="text-xs">Min Length</Label>
                              <Input
                                type="number"
                                value={field.validation?.minLength || ''}
                                onChange={(e) => handleUpdateValidation(index, 'minLength', e.target.value ? parseInt(e.target.value) : undefined)}
                                placeholder="0"
                                min={0}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Max Length</Label>
                              <Input
                                type="number"
                                value={field.validation?.maxLength || ''}
                                onChange={(e) => handleUpdateValidation(index, 'maxLength', e.target.value ? parseInt(e.target.value) : undefined)}
                                placeholder="100"
                                min={0}
                              />
                            </div>
                          </>
                        )}

                        {field.type === 'number' && (
                          <>
                            <div className="space-y-1">
                              <Label className="text-xs">Min Value</Label>
                              <Input
                                type="number"
                                value={field.validation?.min || ''}
                                onChange={(e) => handleUpdateValidation(index, 'min', e.target.value ? parseFloat(e.target.value) : undefined)}
                                placeholder="0"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Max Value</Label>
                              <Input
                                type="number"
                                value={field.validation?.max || ''}
                                onChange={(e) => handleUpdateValidation(index, 'max', e.target.value ? parseFloat(e.target.value) : undefined)}
                                placeholder="100"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { handleReset(); onOpenChange(false); }}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!nodeName.trim()}>
            {editingNode ? 'Update Node Type' : 'Create Node Type'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
