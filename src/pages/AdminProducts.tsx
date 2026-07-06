import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  uploadProductImage,
} from '@/lib/api';

interface ProductImage {
  url: string;
  alt?: string;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  description: string;
  stock: number;
  images?: ProductImage[];
}

const emptyForm = {
  name: '',
  category: '',
  price: '',
  salePrice: '',
  description: '',
  stock: '',
  imageUrl: '',
};

const getProductImageUrl = (product: Product) =>
  product.images?.[0]?.url || '/placeholder.svg';

const productToForm = (product: Product) => ({
  name: product.name,
  category: product.category,
  price: String(product.price),
  salePrice: product.salePrice != null ? String(product.salePrice) : '',
  description: product.description,
  stock: String(product.stock),
  imageUrl: product.images?.[0]?.url || '',
});

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setImagePreview(null);
    setEditingProduct(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setImagePreview(null);
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormData(productToForm(product));
    setImagePreview(product.images?.[0]?.url || null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const buildImagesPayload = (existing?: ProductImage[]) => {
    const imageUrl = formData.imageUrl.trim();
    if (imageUrl) {
      return [{ url: imageUrl, alt: formData.name.trim() || 'Product image' }];
    }
    return existing?.length ? existing : undefined;
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uploaded = await uploadProductImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: uploaded.url }));
      setImagePreview(uploaded.url);
      toast({ title: 'Image uploaded', description: uploaded.url });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: (error as Error).message || 'Could not upload image',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category) {
      toast({
        title: 'Category required',
        description: 'Please select a product category',
        variant: 'destructive',
      });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      price: parseFloat(formData.price),
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
      stock: parseInt(formData.stock, 10) || 0,
      images: buildImagesPayload(editingProduct?.images),
    };

    setIsSaving(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, payload);
        toast({ title: 'Success', description: 'Product updated successfully' });
      } else {
        await createProduct(payload);
        toast({ title: 'Success', description: 'Product added successfully' });
      }

      await fetchProducts();
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || `Failed to ${editingProduct ? 'update' : 'add'} product`,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(productId);
      toast({ title: 'Success', description: 'Product deleted successfully' });
      if (editingProduct?._id === productId) {
        resetForm();
      }
      fetchProducts();
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Product Management</h1>
            <p className="text-muted-foreground">Manage your store products</p>
          </div>
          <Button
            onClick={() => (showForm && !editingProduct ? resetForm() : openAddForm())}
            className="bg-pink-600 hover:bg-pink-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <Separator className="mb-8" />

        {showForm && (
          <Card className="mb-8 border-pink-200">
            <CardHeader>
              <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
              {editingProduct && (
                <p className="text-sm text-muted-foreground">
                  Editing: <span className="font-medium">{editingProduct.name}</span> (ID:{' '}
                  {editingProduct._id})
                </p>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Gold Bangle"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bangles">Bangles</SelectItem>
                        <SelectItem value="earrings">Earrings</SelectItem>
                        <SelectItem value="necklaces">Necklaces</SelectItem>
                        <SelectItem value="rings">Rings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="salePrice">Sale Price (₹)</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Product description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="rounded-lg border border-pink-100 bg-pink-50/40 p-4 space-y-4">
                  <div>
                    <Label className="text-base font-medium">Product image</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload a new photo or change the image path below.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-28 h-28 rounded-lg border bg-white overflow-hidden flex-shrink-0">
                      {imagePreview || formData.imageUrl ? (
                        <img
                          src={imagePreview || formData.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={() => setImagePreview('/placeholder.svg')}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground p-2 text-center">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-3 w-full">
                      <div>
                        <Label htmlFor="image-file">Upload image file</Label>
                        <Input
                          id="image-file"
                          type="file"
                          accept="image/*"
                          disabled={uploadingImage}
                          onChange={handleImageFileChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="imageUrl">Image path / URL</Label>
                        <Input
                          id="imageUrl"
                          placeholder="/images/my-product.jpg"
                          value={formData.imageUrl}
                          onChange={(e) => {
                            setFormData({ ...formData, imageUrl: e.target.value });
                            setImagePreview(e.target.value || null);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isSaving || uploadingImage}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    {isSaving
                      ? 'Saving...'
                      : editingProduct
                      ? 'Save Changes'
                      : 'Add Product'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="bangles">Bangles</SelectItem>
              <SelectItem value="earrings">Earrings</SelectItem>
              <SelectItem value="necklaces">Necklaces</SelectItem>
              <SelectItem value="rings">Rings</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="pt-6">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow
                        key={product._id}
                        className={editingProduct?._id === product._id ? 'bg-pink-50/50' : ''}
                      >
                        <TableCell>
                          <img
                            src={getProductImageUrl(product)}
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover border"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="capitalize">{product.category}</TableCell>
                        <TableCell>
                          <span className="font-medium">₹{product.price}</span>
                          {product.salePrice != null && (
                            <span className="ml-2 text-sm text-green-600">
                              Sale: ₹{product.salePrice}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditForm(product)}
                              title="Edit product"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProduct(product._id)}
                              title="Delete product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AdminProducts;
