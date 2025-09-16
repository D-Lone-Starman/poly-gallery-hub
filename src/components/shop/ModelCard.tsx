import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Heart } from "lucide-react";

interface ModelCardProps {
  id: string;
  name: string;
  author: string;
  price: number;
  category: string;
  rating: number;
  downloads: number;
  thumbnail?: string;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
}

export const ModelCard = ({
  id,
  name,
  author,
  price,
  category,
  rating,
  downloads,
  thumbnail,
  onView,
  onDownload
}: ModelCardProps) => {
  return (
    <Card className="group bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden hover:shadow-[var(--shadow-3d)]">
      {/* Thumbnail/Preview */}
      <div className="relative aspect-square bg-gradient-to-br from-shop-surface to-shop-surface-elevated p-4">
        <div className="w-full h-full bg-shop-surface-elevated rounded-lg flex items-center justify-center border border-border group-hover:border-primary/30 transition-colors">
          {thumbnail ? (
            <img src={thumbnail} alt={name} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs">3D Preview</span>
            </div>
          )}
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onView(id)}
            className="bg-primary/20 hover:bg-primary/30 text-primary border-primary/30"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-shop-surface-elevated/80 hover:bg-shop-surface-elevated"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Category badge */}
        <Badge className="absolute top-2 left-2 bg-secondary/20 text-secondary border-secondary/30">
          {category}
        </Badge>

        {/* Price badge */}
        <Badge className="absolute top-2 right-2 bg-primary/20 text-primary border-primary/30">
          ${price === 0 ? 'Free' : price.toFixed(2)}
        </Badge>
      </div>

      {/* Model info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-shop-text-primary group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground">by {author}</p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>⭐ {rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            <span>{downloads.toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => onView(id)}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onDownload(id)}
            className="bg-shop-surface-elevated hover:bg-shop-surface"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};