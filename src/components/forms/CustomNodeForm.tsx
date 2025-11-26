import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomNodeDefinition } from '@/types/customNode';

interface CustomNodeFormProps {
  data: any;
  onChange: (field: string, value: any) => void;
  definition: CustomNodeDefinition;
}

export const CustomNodeForm = ({ data, onChange, definition }: CustomNodeFormProps) => {
  const validateField = (field: any, value: any) => {
    if (field.validation?.required && !value) {
      return false;
    }
    if (field.type === 'text' || field.type === 'textarea') {
      if (field.validation?.minLength && value.length < field.validation.minLength) {
        return false;
      }
      if (field.validation?.maxLength && value.length > field.validation.maxLength) {
        return false;
      }
    }
    if (field.type === 'number') {
      const num = parseFloat(value);
      if (field.validation?.min !== undefined && num < field.validation.min) {
        return false;
      }
      if (field.validation?.max !== undefined && num > field.validation.max) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          value={data.label || ''}
          onChange={(e) => onChange('label', e.target.value)}
          placeholder="Node name"
          required
        />
      </div>

      {definition.fields.map((field) => {
        const fieldValue = data.customData?.[field.id] || '';
        
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.validation?.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            
            {field.type === 'text' && (
              <Input
                id={field.id}
                value={fieldValue}
                onChange={(e) => {
                  const newData = { ...data.customData, [field.id]: e.target.value };
                  onChange('customData', newData);
                }}
                placeholder={field.placeholder}
                required={field.validation?.required}
                minLength={field.validation?.minLength}
                maxLength={field.validation?.maxLength}
              />
            )}
            
            {field.type === 'number' && (
              <Input
                id={field.id}
                type="number"
                value={fieldValue}
                onChange={(e) => {
                  const newData = { ...data.customData, [field.id]: e.target.value };
                  onChange('customData', newData);
                }}
                placeholder={field.placeholder}
                required={field.validation?.required}
                min={field.validation?.min}
                max={field.validation?.max}
              />
            )}
            
            {field.type === 'textarea' && (
              <Textarea
                id={field.id}
                value={fieldValue}
                onChange={(e) => {
                  const newData = { ...data.customData, [field.id]: e.target.value };
                  onChange('customData', newData);
                }}
                placeholder={field.placeholder}
                required={field.validation?.required}
                minLength={field.validation?.minLength}
                maxLength={field.validation?.maxLength}
                rows={3}
              />
            )}
            
            {field.type === 'url' && (
              <Input
                id={field.id}
                type="url"
                value={fieldValue}
                onChange={(e) => {
                  const newData = { ...data.customData, [field.id]: e.target.value };
                  onChange('customData', newData);
                }}
                placeholder={field.placeholder || 'https://example.com'}
                required={field.validation?.required}
              />
            )}
            
            {field.type === 'email' && (
              <Input
                id={field.id}
                type="email"
                value={fieldValue}
                onChange={(e) => {
                  const newData = { ...data.customData, [field.id]: e.target.value };
                  onChange('customData', newData);
                }}
                placeholder={field.placeholder || 'email@example.com'}
                required={field.validation?.required}
              />
            )}
            
            {field.type === 'select' && field.options && (
              <Select
                value={fieldValue}
                onValueChange={(value) => {
                  const newData = { ...data.customData, [field.id]: value };
                  onChange('customData', newData);
                }}
              >
                <SelectTrigger id={field.id}>
                  <SelectValue placeholder={field.placeholder || 'Select an option'} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {field.validation && (
              <div className="text-xs text-muted-foreground">
                {field.validation.minLength && `Min: ${field.validation.minLength} chars. `}
                {field.validation.maxLength && `Max: ${field.validation.maxLength} chars. `}
                {field.validation.min !== undefined && `Min: ${field.validation.min}. `}
                {field.validation.max !== undefined && `Max: ${field.validation.max}. `}
              </div>
            )}
          </div>
        );
      })}

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          value={data.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Additional notes"
        />
      </div>
    </div>
  );
};
