import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const FileUpload = ({ 
  onChange, 
  error, 
  accept = ".pdf,.doc,.docx,.txt,.rtf" 
}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    onChange(e);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    // Create a new input element to reset file input
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = handleFileChange;
    input.click();
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="file">File *</Label>
      <div className="flex items-center space-x-2">
        <Input
          id="file"
          name="file"
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className={error ? "border-destructive" : ""}
        />
        {selectedFile && (
          <div className="flex items-center space-x-2">
            <span className="text-sm truncate max-w-[200px]">
              {selectedFile.name}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive/80"
              onClick={handleFileRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
