import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SSHAccessFormProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

export const SSHAccessForm = ({ data, onChange }: SSHAccessFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          value={data.label || ''}
          onChange={(e) => onChange('label', e.target.value)}
          placeholder="Connection name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="host">Host</Label>
        <Input
          id="host"
          value={data.host || ''}
          onChange={(e) => onChange('host', e.target.value)}
          placeholder="192.168.1.1 or example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="port">Port</Label>
        <Input
          id="port"
          type="number"
          value={data.port || 22}
          onChange={(e) => onChange('port', parseInt(e.target.value) || 22)}
          placeholder="22"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={data.username || ''}
          onChange={(e) => onChange('username', e.target.value)}
          placeholder="root"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="authType">Auth Type</Label>
        <Select value={data.authType || 'key'} onValueChange={(value) => onChange('authType', value)}>
          <SelectTrigger id="authType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="password">Password</SelectItem>
            <SelectItem value="key">SSH Key</SelectItem>
          </SelectContent>
        </Select>
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
