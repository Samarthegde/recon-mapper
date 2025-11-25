import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RDPAccessFormProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

export const RDPAccessForm = ({ data, onChange }: RDPAccessFormProps) => {
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
          value={data.port || 3389}
          onChange={(e) => onChange('port', parseInt(e.target.value) || 3389)}
          placeholder="3389"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={data.username || ''}
          onChange={(e) => onChange('username', e.target.value)}
          placeholder="Administrator"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="domain">Domain (optional)</Label>
        <Input
          id="domain"
          value={data.domain || ''}
          onChange={(e) => onChange('domain', e.target.value)}
          placeholder="DOMAIN"
        />
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
