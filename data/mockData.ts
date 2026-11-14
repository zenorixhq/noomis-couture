import { Product, Category, Order } from "@/types/store";

export const categories: Category[] = [
  {
    "id": "cat-bangles",
    "slug": "bangles",
    "name": "Bangles",
    "description": "Rigid luxury bangles, open-cuff kadas, and screw-lock everyday bangles in 316L steel.",
    "image": "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/categories/bangles-kada-1793372909246.jpg",
    "productCount": 0,
    "order": 1
  },
  {
    "id": "cat-necklaces",
    "slug": "necklaces",
    "name": "Necklaces",
    "description": "Interchangeable charm necklaces, dainty lockets, and radiant everyday pieces in 316L steel.",
    "image": "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/categories/necklaces-and-chains-1793372908704.jpg",
    "productCount": 0,
    "order": 2
  },
  {
    "id": "cat-bracelets",
    "slug": "bracelets",
    "name": "Bracelets",
    "description": "Waterproof clover bracelets, paperclip chains, and link cuffs.",
    "image": "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/categories/bracelets-1793372908945.jpg",
    "productCount": 19,
    "order": 3
  },
  {
    "id": "cat-pendants",
    "slug": "pendants",
    "name": "Pendants",
    "description": "Solitaire stones, clover medallions, and minimal layering pendants.",
    "image": "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/categories/necklaces-and-chains-1793372908704.jpg",
    "productCount": 12,
    "order": 4
  },
  {
    "id": "cat-watches",
    "slug": "watches",
    "name": "Watches",
    "description": "Refined minimalist luxury timepieces with stainless steel waterproof mesh and link bracelets.",
    "image": "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/categories/watches-1793372909299.jpg",
    "productCount": 0,
    "order": 5
  },
  {
    "id": "cat-rings",
    "slug": "rings",
    "name": "Rings",
    "description": "Waterproof adjustable rings, statement bands, and stackable sets.",
    "image": "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/categories/rings-1793372908809.jpg",
    "productCount": 11,
    "order": 6
  },
  {
    "id": "cat-hand-chains",
    "slug": "hand-chains",
    "name": "Hand Chains",
    "description": "Delicate ring-to-wrist hand harness chains in radiant 18K mirror gold finish.",
    "image": "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/categories/hip-chains-1793372909411.jpg",
    "productCount": 0,
    "order": 7
  },
  {
    "id": "cat-anklets",
    "slug": "anklets",
    "name": "Anklets",
    "description": "Boho bead anklets, butterfly charms, and shimmering multi-diamond anklets.",
    "image": "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/categories/anklets-1793372909460.jpg",
    "productCount": 0,
    "order": 8
  },
  {
    "id": "cat-earrings",
    "slug": "earrings",
    "name": "Earrings",
    "description": "Hypoallergenic hoops, contemporary drop earrings, and dainty daily studs.",
    "image": "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/categories/earrings-1793372908889.jpg",
    "productCount": 9,
    "order": 9
  },
  {
    "id": "cat-mangalsutra",
    "slug": "mangalsutra",
    "name": "Mangalsutra",
    "description": "Modern minimalist mangalsutra designs in waterproof 316L steel with auspicious black beads.",
    "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    "productCount": 0,
    "order": 10
  }
];

export const products: Product[] = [
  {
    "id": "cmvtkaoyl0001k307xk3d3wuk",
    "slug": "emerald-green-pendent",
    "title": "Emerald Green Pendent ",
    "shortDescription": "Emerald Green Pendent ",
    "description": "Emerald Green Pendent ",
    "price": 259,
    "category": "necklaces-and-chains",
    "tags": [
      "necklaces-and-chains",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/emerald-green-pendent-1-1793372884427.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvtk9l380000k307nwfpx89d",
    "slug": "classic-pendent",
    "title": "Classic pendent ",
    "shortDescription": "Classic pendent ",
    "description": "Classic pendent ",
    "price": 259,
    "category": "necklaces-and-chains",
    "tags": [
      "necklaces-and-chains",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/classic-pendent-1-1793372884712.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvtgg4ki0003kx08gyy724j1",
    "slug": "charm-bangle-026-white",
    "title": "Charm Bangle 026 - White",
    "shortDescription": "Charm Bangle 026 - White",
    "description": "Charm Bangle 026 - White",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-026-white-1-1793372886207.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvtg2by90002kx08h7812pif",
    "slug": "charm-bangle-025-white",
    "title": "Charm Bangle 025 - white",
    "shortDescription": "Charm Bangle 025 - white",
    "description": "Charm Bangle 025 - white",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-025-white-1-1793372886493.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvtg135p0001kx08jf7gddwi",
    "slug": "charm-bangle-024-white",
    "title": "Charm Bangle 024 - white",
    "shortDescription": "Charm Bangle 024 - white",
    "description": "Charm Bangle 024 - white",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-024-white-1-1793372886785.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvtfyv350000kx08vkn2f3jr",
    "slug": "charm-bangle-023-white",
    "title": "Charm Bangle 023 - white",
    "shortDescription": "Charm Bangle 023 - white",
    "description": "Charm Bangle 023 - white",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-023-white-1-1793372887114.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 10,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvtfbje60000i708rif6c8zv",
    "slug": "charm-bangle-022-white",
    "title": "Charm Bangle 022- white",
    "shortDescription": "Charm Bangle 022- white",
    "description": "Charm Bangle 022- white",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-022-white-1-1793372887461.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvtf5rya0000l2082l0moe0r",
    "slug": "charm-bangle-021-pink",
    "title": "Charm Bangle 021 - pink",
    "shortDescription": "Charm Bangle 021 - pink",
    "description": "Charm Bangle 021 - pink",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-021-pink-1-1793372887753.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvtewueb0000js08o86roii6",
    "slug": "charm-bangle-020-white",
    "title": "Charm Bangle 020 - white",
    "shortDescription": "Charm Bangle 020 - white",
    "description": "Charm Bangle 020 - white",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-020-white-1-1793372888051.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvteib3m000al507wf4v7lt6",
    "slug": "charm-bangle-019-white",
    "title": "Charm Bangle 019 - white",
    "shortDescription": "Charm Bangle 019 - white",
    "description": "Charm Bangle 019 - white",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-019-white-1-1793372888355.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvtefz690009l507j06ii28c",
    "slug": "charm-bangle-018-black",
    "title": "Charm Bangle 018 - Black",
    "shortDescription": "Charm Bangle 018 - Black",
    "description": "Charm Bangle 018 - Black",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-018-black-1-1793372888638.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvtediqb0008l507g3pe6ils",
    "slug": "charm-bangle-017",
    "title": "Charm Bangle 017 - white",
    "shortDescription": "Charm Bangle 017 - ",
    "description": "Charm Bangle 017 - ",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-017-1-1793372888934.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvtecwo50007l5078ges3nhd",
    "slug": "charm-bangle-016-white",
    "title": "Charm bangle 016 - white",
    "shortDescription": "Charm bangle 016 - white",
    "description": "Charm bangle 016 - white",
    "price": 249,
    "category": "charms",
    "tags": [
      "necklaces-and-chains",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-016-white-1-1793372889210.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvtebmax0006l507ovxsl62r",
    "slug": "charm-bangle-015-red",
    "title": "Charm Bangle 015 - Red",
    "shortDescription": "Charm Bangle 015 - Red",
    "description": "Charm Bangle 015 - Red",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-015-red-1-1793372889489.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvtea78r0005l507210hdnh2",
    "slug": "charm-bangle-014-white",
    "title": "Charm Bangle  014 - white",
    "shortDescription": "Charm Bangle  014 - white",
    "description": "Charm Bangle  014 - white",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-014-white-1-1793372889776.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvte7qeh0004l5074on99lbz",
    "slug": "charm-bangle-013-pink",
    "title": "Charm Bangle 013 - pink",
    "shortDescription": "Charm Bangle 013 - pink",
    "description": "Charm Bangle 013 - pink",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-013-pink-1-1793372890117.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvte4j310003l507wyhnu3dn",
    "slug": "charm-bangle-012",
    "title": "Charm Bangle 012 - ",
    "shortDescription": "Charm Bangle 012 - ",
    "description": "Charm Bangle 012 - ",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-012-1-1793372890410.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvte3h1u0002l507eo25jpn2",
    "slug": "charm-bangle-011",
    "title": "Charm Bangle 011 - ",
    "shortDescription": "Charm Bangle 011 - ",
    "description": "Charm Bangle 011 - ",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-011-1-1793372890703.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvte1veq0001l507erfjjelh",
    "slug": "charm-bangle-010-black",
    "title": "Charm Bangle 010 - Black",
    "shortDescription": "Charm Bangle 010 - Black",
    "description": "Charm Bangle 010 - Black",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-010-black-1-1793372891020.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvtdwjwe0000l507ezscm0s2",
    "slug": "charm-bangle-009",
    "title": "Charm bangle 009",
    "shortDescription": "Charm bangle 009",
    "description": "Charm bangle 009",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-009-1-1793372891310.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvsj288x0000jx08avjkwu0s",
    "slug": "premium-bangle-2-6",
    "title": "Premium Bangle- 2.6",
    "shortDescription": "Premium Bangle- 2.6",
    "description": "Premium Bangle- 2.6",
    "price": 380,
    "category": "bangles-kada",
    "tags": [
      "bangles-kada",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/premium-bangle-2-6-1-1793372892189.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvs1vm020000lc080zwwtl05",
    "slug": "ruby-red-simple-chain",
    "title": "Ruby Red Simple Chain ",
    "shortDescription": "Ruby Red Simple Chain ",
    "description": "Ruby Red Simple Chain ",
    "price": 160,
    "category": "necklaces-and-chains",
    "tags": [
      "necklaces-and-chains",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/ruby-red-simple-chain-1-1793372892533.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 3,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvrzgnfx0000jk0841ukljhm",
    "slug": "geometrical-necklaces",
    "title": "Geometrical Necklaces ",
    "shortDescription": "Geometrical Necklaces ",
    "description": "Geometrical Necklaces ",
    "price": 320,
    "category": "necklaces-and-chains",
    "tags": [
      "necklaces-and-chains",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/geometrical-necklaces-1-1793372893429.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 3,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true,
    "variantAttributes": []
  },
  {
    "id": "cmvqpsi6q0000l508mnazke45",
    "slug": "heart-theme-pendant",
    "title": "Heart theme pendant ",
    "shortDescription": "Heart theme pendant ",
    "description": "Heart theme pendant ",
    "price": 199,
    "category": "necklaces-and-chains",
    "tags": [
      "necklaces-and-chains",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/heart-theme-pendant-1-1793372899388.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 2,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqpa4060000l5085ppnqc29",
    "slug": "premium-bangle-001",
    "title": "Premium bangle 001 - 2.6 ",
    "shortDescription": "Premium bangle 001",
    "description": "Premium bangle 001",
    "price": 379,
    "category": "bangles-kada",
    "tags": [
      "bangles-kada",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/premium-bangle-001-1-1793372900026.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": false,
    "stockCount": 10,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqoz0c00000ju07hvikwdgg",
    "slug": "bamboo-bangle-2-6",
    "title": "Bamboo Bangle - 2.6",
    "shortDescription": "Bamboo Bangle - 2.6",
    "description": "Bamboo Bangle - 2.6",
    "price": 270,
    "category": "bangles-kada",
    "tags": [
      "bangles-kada",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/bamboo-bangle-2-6-1-1793372900444.webp"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true,
    "variantAttributes": []
  },
  {
    "id": "cmvqorz6d0000i608wx6pr0eo",
    "slug": "charm-bangle-008-orange",
    "title": "Charm bangle 008 - orange",
    "shortDescription": "Charm bangle 008 - orange",
    "description": "Charm bangle 008 - orange",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-008-orange-1-1793372900735.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqmnfs90000l0083pbw506p",
    "slug": "charm-bangle-007-orange",
    "title": "Charm bangle 007 - orange",
    "shortDescription": "Charm bangle 007 - orange",
    "description": "Charm bangle 007 - orange",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-007-orange-1-1793372901043.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqlxrpf0000jm08r3z64cfu",
    "slug": "charm-bangle-006-white",
    "title": "Charm bangle 006 -  white",
    "shortDescription": "Charm bangle 006 -  white",
    "description": "Charm bangle 006 -  white",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-006-white-1-1793372901328.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqkzj960002l808v1omzz0m",
    "slug": "charm-bangle-005-pink",
    "title": "Charm bangle 005 - blue",
    "shortDescription": "Charm bangle 005 - pink",
    "description": "Charm bangle 005 - pink",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-005-pink-1-1793372901618.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqkvs5w0001l808m31qoo46",
    "slug": "charm-bangle-004-white",
    "title": "Charm bangle 004 -  white",
    "shortDescription": "Charm bangle 004 -  white",
    "description": "Charm bangle 004 -  white",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-004-white-1-1793372901935.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqktytc0000l808q6fjx0sr",
    "slug": "charm-bangle-003-black",
    "title": "Charm bangle 003 - black",
    "shortDescription": "Charm bangle 003 - black",
    "description": "Charm bangle 003 - black",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-003-black-1-1793372902218.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqkpjt90000l308itk6i7wy",
    "slug": "charm-bangle-002",
    "title": "Charm bangle 002",
    "shortDescription": "Charm bangle 002",
    "description": "Charm bangle 002",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-002-1-1793372902542.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqkn2fx0009js08tpdd7vov",
    "slug": "charm-bangle-001",
    "title": "Charm bangle 001 - pink",
    "shortDescription": "Charm bangle 001",
    "description": "Charm bangle 001",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bangle-001-1-1793372902823.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqkd2lh0008js087akwhmkc",
    "slug": "charm-bracelet-007",
    "title": "Charm bracelet 007",
    "shortDescription": "Charm bracelet 007",
    "description": "Charm bracelet 007",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bracelet-007-1-1793372903180.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqkap210007js08sh8l9zrn",
    "slug": "charm-bracelet-006",
    "title": "Charm bracelet 006",
    "shortDescription": "Charm bracelet 006",
    "description": "Charm bracelet 006",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bracelet-006-1-1793372903527.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqk7b2k0006js082dhxcdfg",
    "slug": "charm-bracelet",
    "title": "Charm bracelet ",
    "shortDescription": "Charm bracelet ",
    "description": "Charm bracelet ",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bracelet-1-1793372903880.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqk05240005js083yl2mvaj",
    "slug": "charm-bracelet-004",
    "title": "Charm bracelet 004",
    "shortDescription": "Charm bracelet 004",
    "description": "Charm bracelet 004",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bracelet-004-1-1793372904201.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqjq8fa0003js086mwpfmb7",
    "slug": "charm-bracelet-003",
    "title": "Charm bracelet 003",
    "shortDescription": "Charm bracelet 003",
    "description": "Charm bracelet 003",
    "price": 249,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bracelet-003-1-1793372904501.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqjoy9d0002js08ahalbxv0",
    "slug": "charm-bracelet-002",
    "title": "Charm bracelet 002",
    "shortDescription": "Charm bracelet 002",
    "description": "Charm bracelet 002",
    "price": 249,
    "category": "charms",
    "tags": [
      "necklaces-and-chains",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bracelet-002-1-1793372905002.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqjnd0z0001js08ld2tvz1d",
    "slug": "charm-bracelet-001",
    "title": "Charm bracelet 001",
    "shortDescription": "Charm bracelet 001",
    "description": "Charm bracelet 001",
    "price": 250,
    "category": "charms",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/charm-bracelet-001-1-1793372905432.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqjipek0000js080q1gvaq5",
    "slug": "pearl-pendant-chain",
    "title": "Pearl Pendant chain ",
    "shortDescription": "Pearl Pendant chain ",
    "description": "Pearl Pendant chain ",
    "price": 150,
    "category": "necklaces-and-chains",
    "tags": [
      "necklaces-and-chains",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/pearl-pendant-chain-1-1793372905736.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 3,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqjfu750004i608xir0kmrg",
    "slug": "geometric-necklaces",
    "title": "Geometric Necklaces ",
    "shortDescription": "Geometric Necklaces ",
    "description": "Geometric Necklaces ",
    "price": 290,
    "category": "necklaces-and-chains",
    "tags": [
      "necklaces-and-chains",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/geometric-necklaces-1-1793372906036.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqj9sz40003i608tf7r9un6",
    "slug": "double-layer-chain-rectangule-pendant",
    "title": "Double Layer chain (rectangule pendant)",
    "shortDescription": "Double Layer chain (rectangule pendant)",
    "description": "Double Layer chain (rectangule pendant)",
    "price": 270,
    "category": "necklaces-and-chains",
    "tags": [
      "necklaces-and-chains",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/double-layer-chain-rectangule-pendant-1-1793372906321.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqj2gk30002i6080l5qgv8i",
    "slug": "cross-heart-pendant-chain",
    "title": "Cross Heart Pendant Chain ",
    "shortDescription": "Cross Heart Pendant Chain ",
    "description": "Cross Heart Pendant Chain ",
    "price": 160,
    "category": "necklaces-and-chains",
    "tags": [
      "necklaces-and-chains",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/cross-heart-pendant-chain-1-1793372906629.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 3,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqiycld0001i6082itpkv85",
    "slug": "floral-pendent-chain",
    "title": "Snowflake chain",
    "shortDescription": "Floral Pendent Chain ",
    "description": "Floral Pendent Chain ",
    "price": 150,
    "category": "necklaces-and-chains",
    "tags": [
      "necklaces-and-chains",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/floral-pendent-chain-1-1793372906931.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 2,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true,
    "variantAttributes": []
  },
  {
    "id": "cmvqivc8u0000i6084ekphs1v",
    "slug": "floral-theme-chain",
    "title": "Floral Theme Chain",
    "shortDescription": "Floral Theme Chain",
    "description": "Floral Theme Chain",
    "price": 240,
    "category": "necklaces-and-chains",
    "tags": [
      "necklaces-and-chains",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/floral-theme-chain-1-1793372907248.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 3,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true,
    "variantAttributes": []
  },
  {
    "id": "cmvyyw9b10000kz078lckqvv0",
    "slug": "premium-bangle",
    "title": "Premium Bangle ",
    "shortDescription": "Premium Bangle ",
    "description": "Premium Bangle ",
    "price": 350,
    "category": "bangles-kada",
    "tags": [
      "bangles-kada",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/images/1793606154230-1b150fab84d6433aee0f8369aad1cab4.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": true,
    "variantAttributes": []
  },
  {
    "id": "cmvyzaymp0000ia07ofziceqy",
    "slug": "infinity-bangle",
    "title": "Infinity Bangle ",
    "shortDescription": "Infinity Bangle ",
    "description": "Infinity Bangle ",
    "price": 349,
    "category": "bangles-kada",
    "tags": [
      "bangles-kada",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/images/1793606573839-106f3d6dbbfb016ad444a3c3493571b8.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 5,
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": true,
    "variantAttributes": []
  },
  {
    "id": "cmvyzh9v30000ii07rk1f24as",
    "slug": "flower-bangle-2-2",
    "title": "Flower Bangle- 2.2",
    "shortDescription": "Flower Bangle- 2.2",
    "description": "Flower Bangle- 2.2",
    "price": 299,
    "category": "necklaces-and-chains",
    "tags": [
      "necklaces-and-chains",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/images/1793607145766-e124797e3939b9eade95875e59c690b1.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true,
    "variantAttributes": []
  },
  {
    "id": "cmvz0fd8k0000jr07pezfs65f",
    "slug": "crystal-cube-design-kada-white",
    "title": "Crystal Cube Design Kada - White ",
    "shortDescription": "Crystal Cube Design Kada - White ",
    "description": "Crystal Cube Design Kada - White ",
    "price": 360,
    "category": "bangles-kada",
    "tags": [
      "bangles-kada",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/images/1793608799747-IMG-3013.jpeg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvz3vb8j0000l207zaf5ssjj",
    "slug": "crystal-cube-design-kada-green",
    "title": "Crystal Cube Design Kada - Green",
    "shortDescription": "Crystal Cube Design Kada - Green",
    "description": "Crystal Cube Design Kada - Green",
    "price": 360,
    "category": "bangles-kada",
    "tags": [
      "bangles-kada",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/images/1793614503654-70_a22ebb9b-dd78-4842-bcb0-ebfc68e9a3e4.png"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvz47tkh0001l207sllkoff1",
    "slug": "black-bow-kada",
    "title": "Black Bow Kada",
    "shortDescription": "Black Bow Kada",
    "description": "Black Bow Kada",
    "price": 370,
    "category": "bangles-kada",
    "tags": [
      "bangles-kada",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/images/1793615240473-196361b9-334e-439a-8d7d-e4c6d1be103a.png"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvzwa6vv0000ku08q5ojsz34",
    "slug": "cuff-bangles-001",
    "title": "Cuff Bangles 001",
    "shortDescription": "Cuff Bangles 001",
    "description": "Cuff Bangles 001",
    "price": 270,
    "category": "bangles-kada",
    "tags": [
      "bangles-kada",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/images/1793662287796-file_0000000021d881fa8ecae57e4d8fcf07.png"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvzwbx0l0001ku084mr7undv",
    "slug": "cuff-bangle-002",
    "title": "Cuff Bangle 002",
    "shortDescription": "Cuff Bangle 002",
    "description": "Cuff Bangle 002",
    "price": 270,
    "category": "bangles-kada",
    "tags": [
      "bangles-kada",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/images/1793662465380-file_00000000c8e882118e0c460457e469ac.png"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvzwdlu50002ku08zbgidhec",
    "slug": "cuff-bamgle-003",
    "title": "Cuff Bamgle 003",
    "shortDescription": "Cuff Bamgle 003",
    "description": "Cuff Bamgle 003",
    "price": 270,
    "category": "bangles-kada",
    "tags": [
      "bangles-kada",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/images/1793662543439-file_00000000032c81fa8f896db910fa86ca.png"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": false,
    "stockCount": 10,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvzwkhpy0003ku08mpb5zlzd",
    "slug": "heart-and-x-bangle",
    "title": "Heart and X Bangle ",
    "shortDescription": "Heart and X Bangle ",
    "description": "Heart and X Bangle ",
    "price": 350,
    "category": "bangles-kada",
    "tags": [
      "bangles-kada",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/images/1793662859350-modern-heart-bracelet-design.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvtkcfro0002k307ll0x94dw",
    "slug": "silver-tulip-white",
    "title": "Silver Tulip - White",
    "shortDescription": "Silver Tulip - White",
    "description": "Silver Tulip - White",
    "price": 220,
    "category": "bracelets",
    "tags": [
      "bracelets",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/silver-tulip-white-1-1793372883756.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 10,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvthwmj70000l20862s764lc",
    "slug": "silver-tulip-bracelet-green",
    "title": "Silver Tulip Bracelet- Green",
    "shortDescription": "Silver Tulip Bracelet- Green",
    "description": "Silver Tulip Bracelet- Green",
    "price": 229,
    "category": "bracelets",
    "tags": [
      "bracelets",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/silver-tulip-bracelet-green-1-1793372885020.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvth8bzt0002js08ckzgqqed",
    "slug": "cherry-blossom-tulip-blue",
    "title": "Cherry Blossom Tulip- Blue",
    "shortDescription": "Cherry Blossom Tulip- Blue",
    "description": "Cherry Blossom Tulip- Blue",
    "price": 349,
    "category": "bracelets",
    "tags": [
      "bracelets",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/cherry-blossom-tulip-blue-1-1793372885330.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true,
    "variantAttributes": []
  },
  {
    "id": "cmvth60x10001js089w0syltj",
    "slug": "blue-tulip-bracelet",
    "title": "Blue Tulip Bracelet ",
    "shortDescription": "Blue Tulip Bracelet ",
    "description": "Blue Tulip Bracelet ",
    "price": 239,
    "category": "bracelets",
    "tags": [
      "bracelets",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/blue-tulip-bracelet-1-1793372885634.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true,
    "variantAttributes": []
  },
  {
    "id": "cmvth37in0000js08xziw5kwq",
    "slug": "red-tulip-bracelet",
    "title": "Red Tulip Bracelet ",
    "shortDescription": "Red Tulip Bracelet ",
    "description": "Red Tulip Bracelet ",
    "price": 239,
    "category": "bracelets",
    "tags": [
      "bracelets",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/red-tulip-bracelet-1-1793372885931.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true,
    "variantAttributes": []
  },
  {
    "id": "cmvsou3770001jn08xu2u09ld",
    "slug": "black-clover-bracelet",
    "title": "Black Clover Bracelet ",
    "shortDescription": "Black Clover Bracelet ",
    "description": "Black Clover Bracelet ",
    "price": 150,
    "category": "bracelets",
    "tags": [
      "bracelets",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/black-clover-bracelet-1-1793372891595.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 2,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true,
    "variantAttributes": []
  },
  {
    "id": "cmvsosw970000jn082byplw97",
    "slug": "golden-clover-bracelet",
    "title": "Golden Clover Bracelet ",
    "shortDescription": "Golden Clover Bracelet ",
    "description": "Golden Clover Bracelet ",
    "price": 150,
    "category": "bracelets",
    "tags": [
      "bracelets",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/golden-clover-bracelet-1-1793372891877.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 2,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true,
    "variantAttributes": []
  },
  {
    "id": "cmvs08twq0000js073tfqzloc",
    "slug": "contemporary-adjustable-ring-002",
    "title": "Contemporary Adjustable Ring-002",
    "shortDescription": "Contemporary Adjustable Ring-002",
    "description": "Contemporary Adjustable Ring-002",
    "price": 199,
    "category": "rings",
    "tags": [
      "rings",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/contemporary-adjustable-ring-002-1-1793372892853.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 10,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvrzyh3d0000jq082cu7qlek",
    "slug": "full-stone-adjustable-ring-white",
    "title": "Full Stone Adjustable Ring - White ",
    "shortDescription": "Full Stone Adjustable Ring - White ",
    "description": "Full Stone Adjustable Ring - White ",
    "price": 249,
    "category": "rings",
    "tags": [
      "rings",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/full-stone-adjustable-ring-white-1-1793372893146.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 2,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true,
    "variantAttributes": []
  },
  {
    "id": "cmvrxe1dy0005ld08inzz3ak6",
    "slug": "chunky-statement-hoop",
    "title": "Chunky Statement Hoop",
    "shortDescription": "Chunky Statement Hoop",
    "description": "Chunky Statement Hoop",
    "price": 249,
    "category": "earrings",
    "tags": [
      "earrings",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/chunky-statement-hoop-1-1793372893715.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 2,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvrx9s2v0004ld08a1ikwh47",
    "slug": "square-shaped-earrings",
    "title": "Square Shaped Earrings ",
    "shortDescription": "Square Shaped Earrings ",
    "description": "Square Shaped Earrings ",
    "price": 118,
    "category": "earrings",
    "tags": [
      "earrings",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/square-shaped-earrings-1-1793372894008.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 2,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvrx6ng70003ld088oz70d0a",
    "slug": "spiral-earrings",
    "title": "Spiral Earrings ",
    "shortDescription": "Spiral Earrings ",
    "description": "Spiral Earrings ",
    "price": 239,
    "category": "earrings",
    "tags": [
      "earrings",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/spiral-earrings-1-1793372894318.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true,
    "variantAttributes": []
  },
  {
    "id": "cmvrx20mw0002ld08p0486s9a",
    "slug": "triangular-earrings",
    "title": "Triangular Earrings ",
    "shortDescription": "Triangular Earrings ",
    "description": "Triangular Earrings ",
    "price": 118,
    "category": "earrings",
    "tags": [
      "earrings",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/triangular-earrings-1-1793372894685.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 3,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvrwwudw0000jq0835ibug9b",
    "slug": "flower-earrings",
    "title": "Flower earrings ",
    "shortDescription": "Flower earrings ",
    "description": "Flower earrings ",
    "price": 150,
    "category": "earrings",
    "tags": [
      "earrings",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/flower-earrings-1-1793372895041.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvrwrkg90001ld08vwkkbyao",
    "slug": "contemporary-drop-earrings",
    "title": "Contemporary Drop Earrings",
    "shortDescription": "Contemporary Drop Earrings",
    "description": "Contemporary Drop Earrings",
    "price": 118,
    "category": "earrings",
    "tags": [
      "earrings",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/contemporary-drop-earrings-1-1793372895340.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 3,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvrwn8d30000ld0850i88hjk",
    "slug": "heart-theme-earring-002",
    "title": "Heart Theme earring 002",
    "shortDescription": "Heart Theme earring 002",
    "description": "Heart Theme earring 002",
    "price": 118,
    "category": "earrings",
    "tags": [
      "earrings",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/heart-theme-earring-002-1-1793372895636.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 2,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvrweamh0000jz08650tqgqy",
    "slug": "heart-earrings",
    "title": "Heart Earrings ",
    "shortDescription": "Heart Earrings ",
    "description": "Heart Earrings ",
    "price": 179,
    "category": "earrings",
    "tags": [
      "earrings",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/heart-earrings-1-1793372896170.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 2,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvrw9jo30002lb08v7ewm4rw",
    "slug": "xuping-hoop-earing-multi",
    "title": "Xuping Hoop Earing - Multi",
    "shortDescription": "Xuping hoop earing - multi",
    "description": "Xuping hoop earing - multi",
    "price": 269,
    "category": "earrings",
    "tags": [
      "earrings",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/xuping-hoop-earing-multi-1-1793372896459.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 3,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true,
    "variantAttributes": []
  },
  {
    "id": "cmvrw0qxe0001lb082eszvgdh",
    "slug": "butterfly-theme-adjustable-ring",
    "title": "Butterfly Theme Adjustable Ring ",
    "shortDescription": "Butterfly Theme Adjustable Ring ",
    "description": "Butterfly Theme Adjustable Ring ",
    "price": 150,
    "category": "rings",
    "tags": [
      "rings",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/butterfly-theme-adjustable-ring-1-1793372896772.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 2,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true,
    "variantAttributes": []
  },
  {
    "id": "cmvrvxuyp0000lb08qds1gp3b",
    "slug": "floral-adjustable-ring",
    "title": "Floral Adjustable Ring ",
    "shortDescription": "Floral Adjustable Ring ",
    "description": "Floral Adjustable Ring ",
    "price": 170,
    "category": "rings",
    "tags": [
      "rings",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/floral-adjustable-ring-1-1793372897146.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvrubqvk0000l107hr75ppue",
    "slug": "contemporary-adjustable-ring",
    "title": "Contemporary adjustable ring",
    "shortDescription": "Contemporary adjustable ring",
    "description": "Contemporary adjustable ring",
    "price": 140,
    "category": "rings",
    "tags": [
      "rings",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/contemporary-adjustable-ring-1-1793372897508.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 2,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvro6yh00000jv08vhei5wu4",
    "slug": "three-layer-butterfly-ring",
    "title": "Three Layer Butterfly Ring",
    "shortDescription": "Three Layer Butterfly Ring",
    "description": "Three Layer Butterfly Ring",
    "price": 170,
    "category": "rings",
    "tags": [
      "rings",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/three-layer-butterfly-ring-1-1793372897795.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvro13210004jy07khk01qhx",
    "slug": "nail-ring",
    "title": "Nail Ring",
    "shortDescription": "Nail Ring",
    "description": "Nail Ring",
    "price": 249,
    "category": "rings",
    "tags": [
      "rings",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/nail-ring-1-1793372898083.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 6,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvrnwgu90003jy07ijkugrgv",
    "slug": "adjustable-full-stone-ring-blue",
    "title": "Adjustable Full Stone Ring - Blue ",
    "shortDescription": "Adjustable Full Stone Ring - Blue ",
    "description": "Adjustable Full Stone Ring - Blue ",
    "price": 249,
    "category": "rings",
    "tags": [
      "rings",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/adjustable-full-stone-ring-blue-1-1793372898362.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true,
    "variantAttributes": []
  },
  {
    "id": "cmvrns7bq0002jy071f8cgy24",
    "slug": "adjustable-full-stone-ring-multi",
    "title": "Adjustable Full Stone Ring - Multi",
    "shortDescription": "Adjustable Full Stone Ring - Multi",
    "description": "Adjustable Full Stone Ring - Multi",
    "price": 249,
    "category": "rings",
    "tags": [
      "rings",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/adjustable-full-stone-ring-multi-1-1793372898669.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true,
    "variantAttributes": []
  },
  {
    "id": "cmvrnn6ce0001jy079k0o7q8s",
    "slug": "adjustable-full-stone-ring-lavender",
    "title": "Adjustable full stone ring - lavender",
    "shortDescription": "Adjustable full stone ring - lavender",
    "description": "Adjustable full stone ring - lavender",
    "price": 249,
    "category": "rings",
    "tags": [
      "rings",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/adjustable-full-stone-ring-lavender-1-1793372899076.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 2,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvqpehf90001l50811umq4gt",
    "slug": "trendy-bracelet",
    "title": "Trendy bracelet ",
    "shortDescription": "Trendy bracelet ",
    "description": "Trendy bracelet ",
    "price": 260,
    "category": "bracelets",
    "tags": [
      "bracelets",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/trendy-bracelet-1-1793372899744.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvagcmgv0001jj08levb509s",
    "slug": "test",
    "title": "Green Square Adjustable Ring",
    "shortDescription": "AD stone",
    "description": "Green Square Adjustable Ring",
    "price": 249,
    "category": "rings",
    "tags": [
      "necklaces",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/products/test-1-1793372907605.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 3,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvy7cj430000l508fx0vo9w4",
    "slug": "pearl-charm-bracelet",
    "title": "Pearl charm Bracelet ",
    "shortDescription": "Pearl charm Bracelet ",
    "description": "Pearl charm Bracelet ",
    "price": 270,
    "category": "bracelets",
    "tags": [
      "bracelets",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/images/1793560038041-IMG-20260707-WA0344.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvy7f7mf0001l508zr6jwqlp",
    "slug": "silver-cherry-blossom-bracelet",
    "title": "Silver Cherry Blossom Bracelet ",
    "shortDescription": "Silver Cherry Blossom Bracelet ",
    "description": "Silver Cherry Blossom Bracelet ",
    "price": 299,
    "category": "bracelets",
    "tags": [
      "bracelets",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/images/1793560166077-e7913c77-d5bd-439d-8558-fa1f47cf0ae6.png"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvy7hpg60002l508sw7kebqa",
    "slug": "green-flies-bracelet",
    "title": "Green Flies Bracelet ",
    "shortDescription": "Green Flies Bracelet ",
    "description": "Green Flies Bracelet ",
    "price": 280,
    "category": "bracelets",
    "tags": [
      "bracelets",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/images/1793560255780-tbxt1x0BOcHIna0.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true,
    "variantAttributes": []
  },
  {
    "id": "cmvy7kizi0003l5080ur30m9d",
    "slug": "multi-heart-bracelet",
    "title": "Multi Heart Bracelet ",
    "shortDescription": "Multi Heart Bracelet ",
    "description": "Multi Heart Bracelet ",
    "price": 299,
    "category": "bracelets",
    "tags": [
      "bracelets",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/images/1793560340905-Round-Electroplated-18K-Real-Gold-Plated-304-Stainless-Steel-Bracelet-With-Zircon-Inlay-And-Side-Chain-For-Women-6.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 2,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvy8shgc0000jm08htkjknm6",
    "slug": "simple-tulip-bracelet-white",
    "title": "Simple Tulip Bracelet- White ",
    "shortDescription": "Simple Tulip Bracelet- White ",
    "description": "Simple Tulip Bracelet- White ",
    "price": 299,
    "category": "bracelets",
    "tags": [
      "bracelets",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/images/1793562464058-BA7B8582-EFF5-4961-A45F-0A3110A61D67.png"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvy8whod0001jm08ba9tud1p",
    "slug": "geometric-bracelet",
    "title": "Geometric Bracelet ",
    "shortDescription": "Geometric Bracelet ",
    "description": "Geometric Bracelet ",
    "price": 230,
    "category": "bracelets",
    "tags": [
      "charms",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/images/1793562652340-8b746b4d-9ef3-432b-9253-eb0921e7726e.png"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 2,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvy917k30002jm08ya4k452w",
    "slug": "heart-theme-bracelet-002",
    "title": "Heart Theme Bracelet 002",
    "shortDescription": "Heart Theme Bracelet 002",
    "description": "Heart Theme Bracelet 002",
    "price": 299,
    "category": "bracelets",
    "tags": [
      "bracelets",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/images/1793562815116-584c70bc-6709-4f86-861f-fa67b0dbf46a.png"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 2,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvy95wim0003jm08puvxnyr7",
    "slug": "clover-black-white-fusion",
    "title": "Clover Black & White fusion ",
    "shortDescription": "Clover Black & White fusion ",
    "description": "Clover Black & White fusion ",
    "price": 150,
    "category": "bracelets",
    "tags": [
      "bracelets",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/images/1793563098846-99faf58e6d1d7e88b55bfa07e96d481d.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true,
    "variantAttributes": []
  },
  {
    "id": "cmvy9sqcj0000kz08qm5004v9",
    "slug": "multi-square-charm",
    "title": "Multi square charm",
    "shortDescription": "Multi square charm",
    "description": "Multi square charm",
    "price": 299,
    "category": "bracelets",
    "tags": [
      "bracelets",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/images/1793564082847-Gemini_Generated_Image_jr854qjr854qjr85.png"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 2,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvyp01qz0000jv083mzw1guh",
    "slug": "simple-tulip-bracelet-red",
    "title": "Simple Tulip Bracelet - Red",
    "shortDescription": "Simple Tulip Bracelet - Red",
    "description": "Simple Tulip Bracelet - Red",
    "price": 159,
    "category": "bracelets",
    "tags": [
      "bracelets",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/images/1793589696824-af6c6fbf-1f79-4ec8-9e56-1ad23b621794.png"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 1,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  },
  {
    "id": "cmvyqkvfk0000l5085v45vxbw",
    "slug": "multi-heart-charm-bracelet",
    "title": "Multi Heart Charm Bracelet ",
    "shortDescription": "Multi Heart Charm Bracelet ",
    "description": "Multi Heart Charm Bracelet ",
    "price": 299,
    "category": "bracelets",
    "tags": [
      "bracelets",
      "New"
    ],
    "images": [
      "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/images/1793592350355-Round-Electroplated-18K-Real-Gold-Plated-304-Stainless-Steel-Bracelet-With-Zircon-Inlay-And-Side-Chain-For-Women-4.jpg"
    ],
    "rating": 5,
    "reviewCount": 0,
    "inStock": true,
    "stockCount": 2,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false,
    "variantAttributes": []
  }
];

export const sampleOrders: Order[] = [];
