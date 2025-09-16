import { useState } from "react";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ModelViewer } from "@/components/shop/ModelViewer";
import { ModelCard } from "@/components/shop/ModelCard";
import { UploadModal } from "@/components/shop/UploadModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, List, Filter } from "lucide-react";
import { toast } from "sonner";

// Mock data for demonstration
const mockModels = [
  {
    id: "1",
    name: "Modern Chair",
    author: "DesignPro",
    price: 29.99,
    category: "Furniture",
    rating: 4.8,
    downloads: 1247,
  },
  {
    id: "2", 
    name: "Sci-Fi Robot",
    author: "TechArtist",
    price: 0,
    category: "Characters",
    rating: 4.6,
    downloads: 2341,
  },
  {
    id: "3",
    name: "Sports Car",
    author: "AutoModeler",
    price: 49.99,
    category: "Vehicles", 
    rating: 4.9,
    downloads: 892,
  },
  {
    id: "4",
    name: "Medieval Sword",
    author: "FantasyCrafter",
    price: 15.99,
    category: "Weapons",
    rating: 4.7,
    downloads: 1556,
  },
  {
    id: "5",
    name: "Office Building",
    author: "ArchViz",
    price: 79.99,
    category: "Architecture",
    rating: 4.5,
    downloads: 443,
  },
  {
    id: "6",
    name: "Tree Collection",
    author: "NatureArt",
    price: 0,
    category: "Nature",
    rating: 4.4,
    downloads: 3021,
  },
];

const categories = ["All", "Furniture", "Characters", "Vehicles", "Weapons", "Architecture", "Nature"];

export const Shop = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredModels = mockModels.filter(model => 
    selectedCategory === "All" || model.category === selectedCategory
  );

  const handleModelView = (id: string) => {
    setSelectedModel(id);
    const model = mockModels.find(m => m.id === id);
    if (model) {
      toast.success(`Viewing ${model.name}`);
    }
  };

  const handleModelDownload = (id: string) => {
    const model = mockModels.find(m => m.id === id);
    if (model) {
      toast.success(`Downloaded ${model.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader onUploadClick={() => setUploadModalOpen(true)} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Model Viewer */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-shop-text-primary mb-2">
                {selectedModel ? 
                  `Viewing: ${mockModels.find(m => m.id === selectedModel)?.name}` : 
                  "3D Model Viewer"
                }
              </h2>
              <p className="text-muted-foreground">
                {selectedModel ? 
                  "Interact with the model - drag to rotate, scroll to zoom" :
                  "Select a model from the catalog to preview it here"
                }
              </p>
            </div>
            
            <ModelViewer 
              modelName={selectedModel ? mockModels.find(m => m.id === selectedModel)?.name : "Sample Models"}
              className="w-full"
            />
          </div>

          {/* Sidebar with filters and featured models */}
          <div className="space-y-6">
            {/* Categories */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-shop-text-primary mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "secondary"}
                    className={`cursor-pointer transition-colors ${
                      selectedCategory === category 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-shop-surface hover:bg-shop-surface-elevated"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Featured Model */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-shop-text-primary mb-3">Featured Model</h3>
              <div className="space-y-3">
                <div className="aspect-square bg-shop-surface rounded border border-border flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Preview</span>
                </div>
                <div>
                  <h4 className="font-medium">Cyberpunk City Block</h4>
                  <p className="text-sm text-muted-foreground">by FutureCraft</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge className="bg-secondary/20 text-secondary">Featured</Badge>
                    <span className="font-semibold text-primary">$39.99</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Models Catalog */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-shop-text-primary">
                Model Catalog
              </h2>
              <p className="text-muted-foreground">
                {filteredModels.length} models found
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
              >
                <Filter className="w-4 h-4 mr-1" />
                Filters
              </Button>
            </div>
          </div>

          {/* Models Grid */}
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {filteredModels.map((model) => (
              <ModelCard
                key={model.id}
                {...model}
                onView={handleModelView}
                onDownload={handleModelDownload}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      <UploadModal 
        open={uploadModalOpen} 
        onOpenChange={setUploadModalOpen} 
      />
    </div>
  );
};