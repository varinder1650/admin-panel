import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload } from "lucide-react";
import { validateImageFile } from "@/utils/validation";
import { filesToBase64, getImageUrls } from "@/utils/imageHelpers";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  existingImages?: any;
}

export const ImageUploader = ({ 
  images, 
  onChange, 
  maxImages = 10,
  existingImages 
}: ImageUploaderProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const existingImageUrls = getImageUrls(existingImages);
  const displayImages = images.length > 0 ? images : existingImageUrls;
  const hasNewImages = images.length > 0;

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const validFiles = files.filter(file => {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast({ title: "Invalid File", description: validation.error, variant: "destructive" });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    if (validFiles.length > maxImages) {
      toast({ 
        title: "Too Many Images", 
        description: `Please select maximum ${maxImages} images`,
        variant: "destructive" 
      });
      return;
    }

    setIsUploading(true);
    try {
      const base64Images = await filesToBase64(validFiles);
      onChange(base64Images);
      setPreviews(base64Images);
      toast({ title: "Images Ready", description: `${base64Images.length} images loaded` });
    } catch (error) {
      toast({ title: "Upload Error", description: "Failed to process images", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
    setPreviews(newImages);
    
    if (newImages.length === 0) {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const clearAll = () => {
    onChange([]);
    setPreviews([]);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="space-y-3">
      <Label>Product Images</Label>
      
      <div className="flex items-center space-x-2">
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesUpload}
          disabled={isUploading}
          className="flex-1"
        />
        {displayImages.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearAll}
            disabled={isUploading}
          >
            Clear All
          </Button>
        )}
      </div>
      
      {isUploading && (
        <div className="flex items-center space-x-2 p-2 bg-muted rounded">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span className="text-sm text-muted-foreground">Processing images...</span>
        </div>
      )}
      
      {displayImages.length > 0 && !isUploading && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {hasNewImages 
                ? `${displayImages.length} new images ready to upload` 
                : `${displayImages.length} existing images`}
            </p>
            {hasNewImages && (
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                New Images
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-5 gap-3 p-3 border rounded-lg">
            {displayImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Product image ${index + 1}`}
                  className="h-20 w-20 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+';
                  }}
                />
                {hasNewImages && (
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b text-center">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        Upload product images (max {maxImages} images, 5MB each). First image will be primary.
      </p>
    </div>
  );
};