import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, File, X } from "lucide-react";
import { toast } from "sonner";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UploadModal = ({ open, onOpenChange }: UploadModalProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    tags: ""
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    if (!formData.name || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Here you would upload to your backend
    toast.success("Model uploaded successfully!");
    onOpenChange(false);
    
    // Reset form
    setSelectedFiles([]);
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      tags: ""
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-shop-text-primary">Upload 3D Model</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File upload area */}
          <div className="space-y-4">
            <Label>Model Files (.obj, .fbx, .gltf, .glb)</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragOver 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50 bg-shop-surface'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your 3D model files here, or
              </p>
              <Button type="button" variant="outline" asChild>
                <label className="cursor-pointer">
                  Browse Files
                  <input
                    type="file"
                    multiple
                    accept=".obj,.fbx,.gltf,.glb,.dae,.3ds"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </Button>
            </div>

            {/* Selected files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-shop-surface rounded border border-border">
                    <File className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm flex-1">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Model information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Model Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-shop-surface border-border"
                placeholder="Enter model name"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="bg-shop-surface border-border">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="architecture">Architecture</SelectItem>
                  <SelectItem value="characters">Characters</SelectItem>
                  <SelectItem value="vehicles">Vehicles</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="nature">Nature</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="bg-shop-surface border-border"
                placeholder="0.00 (Free)"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-shop-surface border-border"
                placeholder="Describe your 3D model..."
                rows={3}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="bg-shop-surface border-border"
                placeholder="modern, realistic, lowpoly, etc."
              />
            </div>
          </div>

          {/* Submit buttons */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Upload Model
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};