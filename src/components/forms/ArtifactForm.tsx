import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ArtifactFormProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

export const ArtifactForm = ({ data, onChange }: ArtifactFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          value={data.label || ''}
          onChange={(e) => onChange('label', e.target.value)}
          placeholder="Artifact name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="filePath">File Path</Label>
        <Input
          id="filePath"
          value={data.filePath || ''}
          onChange={(e) => onChange('filePath', e.target.value)}
          placeholder="/var/log/evidence.txt"
          className="font-mono"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fileType">File Type</Label>
        <Input
          id="fileType"
          value={data.fileType || ''}
          onChange={(e) => onChange('fileType', e.target.value)}
          placeholder="text, binary, image, etc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hash">Hash (optional)</Label>
        <Input
          id="hash"
          value={data.hash || ''}
          onChange={(e) => onChange('hash', e.target.value)}
          placeholder="sha256:abcdef123456..."
          className="font-mono text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="size">File Size in bytes (optional)</Label>
        <Input
          id="size"
          type="number"
          value={data.size || ''}
          onChange={(e) => onChange('size', e.target.value ? parseInt(e.target.value) : undefined)}
          placeholder="2048"
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
