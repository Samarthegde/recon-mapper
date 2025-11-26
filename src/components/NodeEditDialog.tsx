import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WebEndpointForm } from './forms/WebEndpointForm';
import { SSHAccessForm } from './forms/SSHAccessForm';
import { RDPAccessForm } from './forms/RDPAccessForm';
import { CredentialForm } from './forms/CredentialForm';
import { ArtifactForm } from './forms/ArtifactForm';
import { CustomNodeForm } from './forms/CustomNodeForm';
import { CustomNodeDefinition } from '@/types/customNode';

interface NodeEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeType: string;
  nodeData: any;
  onSave: (data: any) => void;
  customNodeDefinition?: CustomNodeDefinition;
}

const getNodeTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    web: 'Web Endpoint',
    ssh: 'SSH Access',
    rdp: 'RDP Access',
    credential: 'Credential',
    artifact: 'Artifact',
  };
  return labels[type] || 'Node';
};

export const NodeEditDialog = ({
  open,
  onOpenChange,
  nodeType,
  nodeData,
  onSave,
  customNodeDefinition,
}: NodeEditDialogProps) => {
  const [editedData, setEditedData] = useState(nodeData);

  useEffect(() => {
    setEditedData(nodeData);
  }, [nodeData, open]);

  const handleChange = (field: string, value: any) => {
    setEditedData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedData);
    onOpenChange(false);
  };

  const renderForm = () => {
    // Check if it's a custom node
    if (customNodeDefinition) {
      return <CustomNodeForm data={editedData} onChange={handleChange} definition={customNodeDefinition} />;
    }
    
    switch (nodeType) {
      case 'web':
        return <WebEndpointForm data={editedData} onChange={handleChange} />;
      case 'ssh':
        return <SSHAccessForm data={editedData} onChange={handleChange} />;
      case 'rdp':
        return <RDPAccessForm data={editedData} onChange={handleChange} />;
      case 'credential':
        return <CredentialForm data={editedData} onChange={handleChange} />;
      case 'artifact':
        return <ArtifactForm data={editedData} onChange={handleChange} />;
      default:
        return <div>Unknown node type</div>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {getNodeTypeLabel(nodeType)}</DialogTitle>
          <DialogDescription>
            Update the properties for this node. All fields are saved locally.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {renderForm()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
