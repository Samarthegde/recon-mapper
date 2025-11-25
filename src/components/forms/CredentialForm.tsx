import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CredentialFormProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

export const CredentialForm = ({ data, onChange }: CredentialFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          value={data.label || ''}
          onChange={(e) => onChange('label', e.target.value)}
          placeholder="Credential name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Credential Type</Label>
        <Select value={data.type || 'password'} onValueChange={(value) => onChange('type', value)}>
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="password">Password</SelectItem>
            <SelectItem value="token">Token</SelectItem>
            <SelectItem value="api-key">API Key</SelectItem>
            <SelectItem value="ssh-key">SSH Key</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username (optional)</Label>
        <Input
          id="username"
          value={data.username || ''}
          onChange={(e) => onChange('username', e.target.value)}
          placeholder="username"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">Value</Label>
        {data.type === 'ssh-key' ? (
          <Textarea
            id="value"
            value={data.value || ''}
            onChange={(e) => onChange('value', e.target.value)}
            placeholder="-----BEGIN PRIVATE KEY-----"
            className="font-mono text-xs"
            rows={6}
          />
        ) : (
          <Input
            id="value"
            type="password"
            value={data.value || ''}
            onChange={(e) => onChange('value', e.target.value)}
            placeholder="Enter credential value"
            className="font-mono"
          />
        )}
      </div>

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
