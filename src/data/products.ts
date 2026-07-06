
import { Product } from "../contexts/CartContext";

export const products: Product[] = [
  {
    id: "bangle-001",
    name: "Sunset Glow Silk Bangle Set",
    price: 24.99,
    description: "A beautiful set of three handcrafted silk thread bangles in sunset-inspired colors: peach, orange, and gold. Each bangle is meticulously wrapped with high-quality silk thread and adorned with small crystal embellishments.",
    category: "bangles",
    image: "/images/Golden%20Orange%20Wedding%20Silk%20Thread%20Bangle.jpg",
  },
  {
    id: "bangle-002",
    name: "Ocean Breeze Silk Bangle",
    price: 18.99,
    description: "Inspired by the calming colors of the sea, this wide silk thread bangle features shades of blue and turquoise with subtle silver accents. Perfect for both casual and formal wear.",
    category: "bangles",
    image: "/images/Ocean%20Pearl%20Silk%20Thread%20Bangle.jpg",
  },
  {
    id: "bangle-003",
    name: "Floral Fantasy Bangle Set",
    price: 29.99,
    description: "This exquisite set of five slim bangles showcases intricate flower patterns crafted with multicolored silk threads. The delicate design includes tiny pearl beads for an elegant touch.",
    category: "bangles",
    image: "/images/Peach%20Blossom%20Bridal%20Silk%20Thread%20Bangle%20Set.jpg",
  },
  {
    id: "bangle-004",
    name: "Royal Purple Silk Bangle",
    price: 15.99,
    description: "A statement bangle in royal purple, handcrafted with premium silk thread and adorned with golden zari work. The rich color and intricate designs make it perfect for festive occasions.",
    category: "bangles",
    image: "/images/Royal%20Maroon%20Kundan%20Bridal%20Bangle%20Set.jpg",
  },
  {
    id: "earring-001",
    name: "Peacock Feather Silk Thread Earrings",
    price: 12.99,
    description: "These stunning earrings are inspired by peacock feathers, featuring vibrant blue and green silk threads. The lightweight design hangs gracefully and catches the light beautifully.",
    category: "earrings",
    image: "/images/Royal%20Peacock%20Silk%20Thread%20Earrings.png",
  },
  {
    id: "earring-002",
    name: "Rose Gold Silk Jhumkas",
    price: 16.99,
    description: "Traditional jhumka earrings reimagined with rose gold silk thread wrapping. These medium-sized earrings feature small bells at the bottom for a subtle musical touch when you move.",
    category: "earrings",
    image: "/images/Princess%20Pink%20Pearl%20Jhumka.png",
  },
  {
    id: "earring-003",
    name: "Pastel Dream Silk Thread Hoops",
    price: 14.99,
    description: "Delicate hoop earrings wrapped in pastel pink, lavender, and mint green silk threads. These lightweight earrings add a pop of color to any outfit.",
    category: "earrings",
    image: "/images/Sunflower%20Halo%20Silk%20Thread%20Earrings.png",
  },
  {
    id: "earring-004",
    name: "Geometric Silk Thread Studs",
    price: 9.99,
    description: "Modern and minimalist, these geometric silk thread studs feature a triangle design wrapped in vibrant red silk thread with gold accents.",
    category: "earrings",
    image: "/images/Ruby%20Heritage%20Silk%20Thread%20Jhumka.png",
  }
  ,
  {
    id: "bangle-005",
    name: "Emerald Teardrop Silk Bangle",
    price: 21.99,
    description: "A single statement bangle in deep emerald tones with teardrop bead accents, wrapped in luxurious silk thread.",
    category: "bangles",
    image: "/images/Emerald%20Teardrop%20Silk%20Thread%20Bangle%20Set.jpg",
  },
  {
    id: "bangle-006",
    name: "Ruby Royale Silk Thread Bangle Set",
    price: 34.99,
    description: "A regal set of three ruby-hued bangles with subtle zari highlights for a festive touch.",
    category: "bangles",
    image: "/images/Ruby%20Royale%20Silk%20Thread%20Bangle%20Set.jpg",
  },
  {
    id: "earring-005",
    name: "Midnight Royale Silk Thread Jhumka",
    price: 18.99,
    description: "Dark and elegant jhumkas wrapped in midnight blue silk thread with tiny reflective beads for shimmer.",
    category: "earrings",
    image: "/images/Midnight%20Royale%20Silk%20Thread%20Jhumka.png",
  },
  {
    id: "earring-006",
    name: "Pink Blossom Silk Thread Jhumka",
    price: 17.99,
    description: "Soft pink jhumkas with floral motifs, lightweight and perfect for daytime ensembles.",
    category: "earrings",
    image: "/images/Pink%20Blossom%20Silk%20Thread%20Jhumka.png",
  }
  ,
  {
    id: "bangle-007",
    name: "Velvet Ruby Bridal Bangle Set",
    price: 44.99,
    description: "A luxurious velvet-wrapped ruby bangle set with kundan-style embellishments and pearl accents.",
    category: "bangles",
    image: "/images/Velvet%20Ruby%20Bridal%20Collection.png",
  },
  {
    id: "bangle-008",
    name: "Royal Maroon Kundan Bangle",
    price: 27.99,
    description: "Deep maroon silk thread bangle featuring traditional kundan stones and delicate gold beading.",
    category: "bangles",
    image: "/images/Royal%20Maroon%20Kundan%20Bridal%20Bangle%20Set.jpg",
  },
  {
    id: "earring-007",
    name: "Emerald Pearl Silk Thread Jhumka",
    price: 29.99,
    description: "Handcrafted jhumkas with emerald silk thread, pearl drops and gold-plated detailing.",
    category: "earrings",
    image: "/images/Emerald%20Pearl%20Silk%20Thread%20Jhumka.png",
  },
  {
    id: "earring-008",
    name: "Ruby Blossom Silk Thread Jhumka",
    price: 31.99,
    description: "Rich ruby-hued silk thread jhumkas adorned with kundan petals and dangling pearls.",
    category: "earrings",
    image: "/images/Ruby%20Blossom%20Silk%20Thread%20Jhumka.png",
  }
];

// Function to get products by category
export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

// Function to get a product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// Function to get featured products (just returns first 4 products in this mock data)
export const getFeaturedProducts = (): Product[] => {
  return products.slice(0, 4);
};
