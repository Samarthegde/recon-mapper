export type FieldType = 'text' | 'number' | 'select' | 'textarea' | 'url' | 'email';

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
}

export interface CustomFieldDefinition {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[]; // For select fields
  validation?: FieldValidation;
}

export interface CustomNodeDefinition {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  color: string; // Hex color for the node
  fields: CustomFieldDefinition[];
  createdAt: string;
}

export interface CustomNodeStorage {
  customNodes: CustomNodeDefinition[];
}
