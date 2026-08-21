// src/services/localStorageService.js

// Initial data from your endpoints
const INITIAL_DATA = {
  categories: [
    {
      categoryId: 1,
      categoryName: "Beauty",
      description: "Makeup Products"
    },
    {
      categoryId: 2,
      categoryName: "Perfume",
      description: "Elegant and long lasting fragnance"
    },
    {
      categoryId: 3,
      categoryName: "Furniture",
      description: "Comfort meets elegance"
    },
    {
      categoryId: 4,
      categoryName: "Food items",
      description: "Tasty healthy and fresh"
    },
    {
      categoryId: 5,
      categoryName: "Fashion",
      description: "Men and Female Fashion"
    },
    {
      categoryId: 6,
      categoryName: "Shoes",
      description: "Shoes Accessories"
    },
    {
      categoryId: 9,
      categoryName: "Electronics",
      description: "Innovative gadgets for modern living "
    }
  ],
  products: [
    {
      brand: "Puma",
      categoryName: "Shoes",
      description: "Designed for distance running ",
      imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/9/i/l/6-406001-6-0-puma-grey-original-imahgwswgyqrgrgm.jpeg?q=70",
      price: 5000.00,
      productId: 4,
      productName: "Running shoes",
      status: "ACTIVE",
      stockQuantity: 15
    },
    {
      brand: "Essence",
      categoryName: "Beauty",
      description: "Volumizing and lengthening mascara.",
      imageUrl: "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      price: 9.99,
      productId: 9,
      productName: "Essence Mascara Lash Princess",
      status: "AVAILABLE",
      stockQuantity: 99
    },
    {
      brand: "Glamour Beauty",
      categoryName: "Beauty",
      description: "Versatile eyeshadow palette with mirror.",
      imageUrl: "https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp",
      price: 19.99,
      productId: 10,
      productName: "Eyeshadow Palette with Mirror",
      status: "AVAILABLE",
      stockQuantity: 34
    },
    {
      brand: "Velvet Touch",
      categoryName: "Beauty",
      description: "Finely milled face powder.",
      imageUrl: "https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp",
      price: 14.99,
      productId: 11,
      productName: "Powder Canister",
      status: "AVAILABLE",
      stockQuantity: 89
    },
    {
      brand: "Chic Cosmetics",
      categoryName: "Beauty",
      description: "Creamy red lipstick.",
      imageUrl: "https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp",
      price: 12.99,
      productId: 12,
      productName: "Red Lipstick",
      status: "AVAILABLE",
      stockQuantity: 91
    },
    {
      brand: "Nail Couture",
      categoryName: "Beauty",
      description: "Glossy quick-drying nail polish.",
      imageUrl: "https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/thumbnail.webp",
      price: 8.99,
      productId: 13,
      productName: "Red Nail Polish",
      status: "AVAILABLE",
      stockQuantity: 79
    },
    {
      brand: "Calvin Klein",
      categoryName: "Perfume",
      description: "Classic unisex fragrance.",
      imageUrl: "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp",
      price: 49.99,
      productId: 14,
      productName: "Calvin Klein CK One",
      status: "AVAILABLE",
      stockQuantity: 29
    },
    {
      brand: "Chanel",
      categoryName: "Perfume",
      description: "Elegant evening fragrance.",
      imageUrl: "https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp",
      price: 129.99,
      productId: 15,
      productName: "Chanel Coco Noir Eau De",
      status: "AVAILABLE",
      stockQuantity: 58
    },
    {
      brand: "Dolce & Gabbana",
      categoryName: "Perfume",
      description: "Fruity floral perfume.",
      imageUrl: "https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/thumbnail.webp",
      price: 69.99,
      productId: 17,
      productName: "Dolce Shine Eau De",
      status: "LOW_STOCK",
      stockQuantity: 4
    },
    {
      brand: "Gucci",
      categoryName: "Perfume",
      description: "Romantic floral fragrance.",
      imageUrl: "https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/thumbnail.webp",
      price: 79.99,
      productId: 18,
      productName: "Gucci Bloom Eau De",
      status: "AVAILABLE",
      stockQuantity: 91
    },
    {
      brand: "Annibale Colombo",
      categoryName: "Furniture",
      description: "Luxury wooden bed.",
      imageUrl: "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp",
      price: 1899.99,
      productId: 19,
      productName: "Annibale Colombo Bed",
      status: "AVAILABLE",
      stockQuantity: 88
    },
    {
      brand: "Annibale Colombo",
      categoryName: "Furniture",
      description: "Premium living room sofa.",
      imageUrl: "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp",
      price: 2499.99,
      productId: 20,
      productName: "Annibale Colombo Sofa",
      status: "AVAILABLE",
      stockQuantity: 60
    },
    {
      brand: "Furniture Co.",
      categoryName: "Furniture",
      description: "Elegant bedside table.",
      imageUrl: "https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp",
      price: 299.99,
      productId: 21,
      productName: "Bedside Table African Cherry",
      status: "AVAILABLE",
      stockQuantity: 64
    },
    {
      brand: "Knoll",
      categoryName: "Furniture",
      description: "Executive office chair.",
      imageUrl: "https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp",
      price: 499.99,
      productId: 22,
      productName: "Knoll Saarinen Executive Chair",
      status: "AVAILABLE",
      stockQuantity: 26
    },
    {
      brand: "Bath Trends",
      categoryName: "Furniture",
      description: "Luxury bathroom sink.",
      imageUrl: "https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/thumbnail.webp",
      price: 799.99,
      productId: 23,
      productName: "Wooden Bathroom Sink With Mirror",
      status: "LOW_STOCK",
      stockQuantity: 7
    },
    {
      brand: "Fresh Farms",
      categoryName: "Food items",
      description: "Fresh apples.",
      imageUrl: "https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp",
      price: 1.99,
      productId: 24,
      productName: "Apple",
      status: "AVAILABLE",
      stockQuantity: 8
    },
    {
      brand: "Fresh Farms",
      categoryName: "Food items",
      description: "Premium beef steak.",
      imageUrl: "https://cdn.dummyjson.com/product-images/groceries/beef-steak/thumbnail.webp",
      price: 12.99,
      productId: 25,
      productName: "Beef Steak",
      status: "AVAILABLE",
      stockQuantity: 86
    },
    {
      brand: "Pet Care",
      categoryName: "Food items",
      description: "Nutritious cat food.",
      imageUrl: "https://cdn.dummyjson.com/product-images/groceries/cat-food/thumbnail.webp",
      price: 8.99,
      productId: 26,
      productName: "Cat Food",
      status: "AVAILABLE",
      stockQuantity: 46
    },
    {
      brand: "Fresh Farms",
      categoryName: "Food items",
      description: "Fresh chicken meat.",
      imageUrl: "https://cdn.dummyjson.com/product-images/groceries/chicken-meat/thumbnail.webp",
      price: 9.99,
      productId: 27,
      productName: "Chicken Meat",
      status: "AVAILABLE",
      stockQuantity: 97
    },
    {
      brand: "Fortune",
      categoryName: "Food items",
      description: "Refined cooking oil.",
      imageUrl: "https://cdn.dummyjson.com/product-images/groceries/cooking-oil/thumbnail.webp",
      price: 4.99,
      productId: 28,
      productName: "Cooking Oil",
      status: "AVAILABLE",
      stockQuantity: 10
    },
    {
      brand: "Fresh Farms",
      categoryName: "Food items",
      description: "Fresh cucumber.",
      imageUrl: "https://cdn.dummyjson.com/product-images/groceries/cucumber/thumbnail.webp",
      price: 1.49,
      productId: 29,
      productName: "Cucumber",
      status: "AVAILABLE",
      stockQuantity: 84
    },
    {
      brand: "Pet Care",
      categoryName: "Food items",
      description: "Healthy dog food.",
      imageUrl: "https://cdn.dummyjson.com/product-images/groceries/dog-food/thumbnail.webp",
      price: 10.99,
      productId: 30,
      productName: "Dog Food",
      status: "AVAILABLE",
      stockQuantity: 71
    },
    {
      brand: "Fresh Farms",
      categoryName: "Food items",
      description: "Farm fresh eggs.",
      imageUrl: "https://cdn.dummyjson.com/product-images/groceries/eggs/thumbnail.webp",
      price: 2.99,
      productId: 31,
      productName: "Eggs",
      status: "AVAILABLE",
      stockQuantity: 9
    },
    {
      brand: "Sea Foods",
      categoryName: "Food items",
      description: "Fresh fish steak.",
      imageUrl: "https://cdn.dummyjson.com/product-images/groceries/fish-steak/thumbnail.webp",
      price: 14.99,
      productId: 32,
      productName: "Fish Steak",
      status: "AVAILABLE",
      stockQuantity: 74
    },
    {
      brand: "Fresh Farms",
      categoryName: "Food items",
      description: "Fresh green bell pepper.",
      imageUrl: "https://cdn.dummyjson.com/product-images/groceries/green-bell-pepper/thumbnail.webp",
      price: 1.29,
      productId: 33,
      productName: "Green Bell Pepper",
      status: "AVAILABLE",
      stockQuantity: 33
    },
    {
      brand: "Fresh Farms",
      categoryName: "Food items",
      description: "Hot green chili.",
      imageUrl: "https://cdn.dummyjson.com/product-images/groceries/green-chili-pepper/thumbnail.webp",
      price: 0.99,
      productId: 34,
      productName: "Green Chili Pepper",
      status: "LOW_STOCK",
      stockQuantity: 3
    },
    {
      brand: "Organic Foods",
      categoryName: "Food items",
      description: "Pure natural honey.",
      imageUrl: "https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp",
      price: 6.99,
      productId: 35,
      productName: "Honey Jar",
      status: "AVAILABLE",
      stockQuantity: 34
    },
    {
      brand: "Amul",
      categoryName: "Food items",
      description: "Creamy vanilla ice cream.",
      imageUrl: "https://cdn.dummyjson.com/product-images/groceries/ice-cream/thumbnail.webp",
      price: 5.49,
      productId: 36,
      productName: "Ice Cream",
      status: "AVAILABLE",
      stockQuantity: 27
    },
    {
      brand: "Real",
      categoryName: "Food items",
      description: "Mixed fruit juice.",
      imageUrl: "https://cdn.dummyjson.com/product-images/groceries/juice/thumbnail.webp",
      price: 3.99,
      productId: 37,
      productName: "Juice",
      status: "AVAILABLE",
      stockQuantity: 50
    },
    {
      brand: "Fresh Farms",
      categoryName: "Food items",
      description: "Fresh kiwi fruit.",
      imageUrl: "https://cdn.dummyjson.com/product-images/groceries/kiwi/thumbnail.webp",
      price: 2.49,
      productId: 38,
      productName: "Kiwi",
      status: "AVAILABLE",
      stockQuantity: 99
    },
    {
      brand: "ZWERLON",
      categoryName: "Fashion",
      description: "White printed fit-and-flare maxi dress with a flowy silhouette and waist tie.",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/dress/3/6/h/xl-d17-m3-zwerlon-original-imahj9ystzbd2vz5.jpeg?q=90",
      price: 82000.00,
      productId: 39,
      productName: "Women’s Printed Fit & Flare Maxi Dress",
      status: "ACTIVE",
      stockQuantity: 30
    },
    {
      brand: "ROKKLIKE",
      categoryName: "Fashion",
      description: "Top Palazzos Co-ords Set",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/apparel-set/q/x/a/s-156-co-ords-set-co-ords-rokklike-original-imahhtsasfsktwrb.jpeg?q=90",
      price: 5200.00,
      productId: 40,
      productName: "Top Palazzos Co-ords Set",
      status: "ACTIVE",
      stockQuantity: 100
    },
    {
      brand: "XYRIS",
      categoryName: "Fashion",
      description: "Women Solid Polo Neck Cotton Blend Dark Green T-Shirt",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/t-shirt/d/u/f/xxl-w1012-olive-riss-clothing-original-imahg2sgntswkkre.jpeg?q=90",
      price: 6900.00,
      productId: 41,
      productName: "Women Solid Polo Neck Cotton Blend Dark Green T-Shirt",
      status: "ACTIVE",
      stockQuantity: 100
    },
    {
      brand: "RR SA KURTIS",
      categoryName: "Fashion",
      description: "Casual Regular Sleeves Embroidered Women Beige Top",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/top/o/c/o/l-1-128-rr-sa-kurtis-original-imahmb647eupyapy.jpeg?q=90",
      price: 7999.00,
      productId: 42,
      productName: "Casual Regular Sleeves Embroidered Women Beige Top",
      status: "ACTIVE",
      stockQuantity: 100
    },
    {
      brand: "SanjuFashion",
      categoryName: "Fashion",
      description: "Casual Bell Sleeves Floral Print Women Maroon Top",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/top/b/b/h/m-1-top24dori-sanjufashion-original-imahpfzxhvxy2zmv.jpeg?q=90",
      price: 5999.00,
      productId: 43,
      productName: "Casual Bell Sleeves Floral Print Women Maroon Top",
      status: "ACTIVE",
      stockQuantity: 100
    },
    {
      brand: "dreamfashion",
      categoryName: "Fashion",
      description: "Men Graphic Print, Superhero Round Neck Pure Cotton White T-Shirt",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/t-shirt/y/1/7/xxl-spidr0233-dreamfashion-original-imahpmyxq634e6vh.jpeg?q=90",
      price: 999.00,
      productId: 44,
      productName: "Men Graphic Print, Superhero Round Neck Pure Cotton White T-Shirt",
      status: "ACTIVE",
      stockQuantity: 100
    },
    {
      brand: "RADHE SALES",
      categoryName: "Fashion",
      description: "Men Regular Fit Striped Button Down Collar Casual Shirt",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/shirt/8/8/b/xxl-ms-bws-004-radhe-sales-original-imahpgk9gpt97kzz.jpeg?q=90",
      price: 1299.00,
      productId: 45,
      productName: "Men Regular Fit Striped Button Down Collar Casual Shirt",
      status: "ACTIVE",
      stockQuantity: 100
    },
    {
      brand: "TANDUL",
      categoryName: "Fashion",
      description: "Men Checkered Single Breasted Casual Blazer",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/blazer/u/t/f/s-7276-tandul-original-imagudqfn6k6svmz.jpeg?q=90",
      price: 1699.00,
      productId: 46,
      productName: "Men Checkered Single Breasted Casual Blazer",
      status: "ACTIVE",
      stockQuantity: 100
    },
    {
      brand: "FLYING MACHINE",
      categoryName: "Fashion",
      description: "Men Striped Polo Neck Pure Cotton Black T-Shirt",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/t-shirt/v/h/5/-original-imahqfqy3pzcuwg3.jpeg?q=90",
      price: 1899.00,
      productId: 47,
      productName: "Men Striped Polo Neck Pure Cotton Black T-Shirt",
      status: "ACTIVE",
      stockQuantity: 100
    },
    {
      brand: "nancy",
      categoryName: "Fashion",
      description: "Girls Festive & Party Kurta, Pyjama & Dupatta Set",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/kids-ethnic-set/o/y/v/8-10-years-kids-220-wine-nancy-original-imahcuxxkyv7ve7p.jpeg?q=90",
      price: 1999.00,
      productId: 48,
      productName: "Girls Festive & Party Kurta, Pyjama & Dupatta Set",
      status: "ACTIVE",
      stockQuantity: 100
    },
    {
      brand: "KIDGARB",
      categoryName: "Fashion",
      description: "Boys Regular Fit Solid Mandarin Collar Casual Shirt",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/shirt/a/6/x/11-12-years-half-slv-sng-1-kidgarb-original-imahz7xedh39zkft.jpeg?q=90",
      price: 1999.00,
      productId: 49,
      productName: "Boys Regular Fit Solid Mandarin Collar Casual Shirt",
      status: "ACTIVE",
      stockQuantity: 100
    },
    {
      brand: "Acer Aspire",
      categoryName: "Electronics",
      description: "MS Office 2024 + M365 Basic, AMD Ryzen 3 Quad Core 7330U - (8 GB/256 GB SSD/Windows 11 Home) A311-45 Notebook (15.6 inch, Silver, 1.79 kg, With MS Office)",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/computer/0/t/s/-original-imahnt7jpy3mrfgz.jpeg?q=90",
      price: 59999.00,
      productId: 50,
      productName: "MS Office 2024 + M365 Basic, AMD Ryzen 3 Quad Core 7330U - (8 GB/256 GB SSD/Windows 11 Home) A311-45 Notebook (15.6 inch, Silver, 1.79 kg, With MS Office)",
      status: "ACTIVE",
      stockQuantity: 100
    },
    {
      brand: "Fire-Boltt",
      categoryName: "Electronics",
      description: "Ninja Calling Pro Plus 46.5mm (1.83) Display Bluetooth Calling, AI Voice Smartwatch (Silver Strap, Free Size)",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/smartwatch/l/o/v/-original-imahh3p8avdzeyea.jpeg?q=90",
      price: 49999.00,
      productId: 51,
      productName: "Ninja Calling Pro Plus 46.5mm (1.83) Display Bluetooth Calling, AI Voice Smartwatch (Silver Strap, Free Size)",
      status: "ACTIVE",
      stockQuantity: 100
    },
    {
      brand: "FUJIFILM",
      categoryName: "Electronics",
      description: "Instax Mini 12 Instant Camera (Pink)",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/instant-camera/s/h/u/-original-imahprkgmutbvffs.jpeg?q=90",
      price: 39999.00,
      productId: 52,
      productName: "Instax Mini 12 Instant Camera (Pink)",
      status: "ACTIVE",
      stockQuantity: 100
    },
    {
      brand: "Apple",
      categoryName: "Electronics",
      description: " iPhone 14 (Starlight, 128 GB)",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/mobile/m/o/b/-original-imaghx9qkugtbfrn.jpeg?q=90",
      price: 79999.00,
      productId: 53,
      productName: " iPhone 14 (Starlight, 128 GB)",
      status: "ACTIVE",
      stockQuantity: 100
    },
    {
      brand: "realme Buds",
      categoryName: "Electronics",
      description: " T310 with 12.4mm Driver, 46dB ANC, Spatial Audio and upto 40 hours Playback Bluetooth Headset (Vibrant Black, True Wireless)",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/headphone/6/9/j/-enriched-transparent-original-imah388mvfzxm2u8.png?q=90",
      price: 49879.00,
      productId: 54,
      productName: " T310 with 12.4mm Driver, 46dB ANC, Spatial Audio and upto 40 hours Playback Bluetooth Headset (Vibrant Black, True Wireless)",
      status: "ACTIVE",
      stockQuantity: 100
    },
    {
      brand: "OnePlus",
      categoryName: "Electronics",
      description: " OnePlus N6 5G (Fresh Mint, 128 GB) (6 GB RAM)",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/mobile/y/i/x/n6-5g-n6-oneplus-original-imahzvfjuqp6kz8y.jpeg?q=90",
      price: 45465.00,
      productId: 55,
      productName: " OnePlus N6 5G (Fresh Mint, 128 GB) (6 GB RAM)",
      status: "ACTIVE",
      stockQuantity: 100
    },
    {
      brand: "boAt",
      categoryName: "Electronics",
      description: " boAt Partypal 390Playback 160 W Bluetooth Speaker (Space Black, Mono Channel)",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/speaker/a/z/v/-original-imahghnszpzcgmfu.jpeg?q=90",
      price: 35465.00,
      productId: 56,
      productName: " boAt Partypal 390Playback 160 W Bluetooth Speaker (Space Black, Mono Channel)",
      status: "ACTIVE",
      stockQuantity: 100
    },
    {
      brand: "NIKE",
      categoryName: "Shoes",
      description: "Breeze Glide Running Shoes For Men (Multicolor , 8)",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/g/v/d/-watermarked-original-imahgcs9ybxuw4pg.jpeg?q=90",
      price: 6999.00,
      productId: 60,
      productName: "Breeze Glide Running Shoes For Men (Multicolor , 8)",
      status: "ACTIVE",
      stockQuantity: 100
    },
    {
      brand: "asian",
      categoryName: "Shoes",
      description: "asian Men’s Tango-01 Sneakers | Stylish & Lightweight Shoes with High Grip Sole Sneakers For Men (Beige, Brown , 8)",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/t/d/3/7-tango-01-7-asian-beige-btgrn-mouse-watermarked-original-imahhw9rkdrgaqvh.jpeg?q=90",
      price: 8999.00,
      productId: 61,
      productName: "asian Men’s Tango-01 Sneakers | Stylish & Lightweight Shoes with High Grip Sole Sneakers For Men (Beige, Brown , 8)",
      status: "ACTIVE",
      stockQuantity: 100
    },
    {
      brand: "ADIDAS",
      categoryName: "Shoes",
      description: "ADIDAS Fluo M Running Shoes For Men (Black , 11))",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/h/f/t/-resized-original-imahffabjuwyddhr.jpeg?q=90",
      price: 7999.00,
      productId: 62,
      productName: "ADIDAS Fluo M Running Shoes For Men (Black , 11)",
      status: "ACTIVE",
      stockQuantity: 100
    },
    {
      brand: "REEBOK",
      categoryName: "Shoes",
      description: "Breeze Glide Running Shoes For Men (Multicolor , 8)",
      imageUrl: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/shoe/o/c/c/-watermarked-original-imahjgs2ytvbfkkg.jpeg?q=90",
      price: 4999.00,
      productId: 63,
      productName: "Breeze Glide Running Shoes For Men (Multicolor , 8)",
      status: "ACTIVE",
      stockQuantity: 100
    }
  ],
  addresses: [
    {
      addressId: 4,
      addressLine1: "123 Main TownHall",
      city: "Manali",
      fullName: "AdyaAdya S",
      pinCode: "758423",
      state: "Himachal Pradesh",
      userId: 7
    },
    {
      addressId: 5,
      addressLine1: "plot 67",
      city: "Bbsr",
      fullName: "Aaaa",
      pinCode: "123454",
      state: "dddd",
      userId: 7
    },
    {
      addressId: 6,
      addressLine1: "plot 67",
      city: "Bbsr",
      fullName: "Aaaa",
      pinCode: "123454",
      state: "dddd",
      userId: 7
    },
    {
      addressId: 7,
      addressLine1: "123 Main TownHall",
      city: "Manali",
      fullName: "AdyaAdya S",
      pinCode: "758423",
      state: "Himachal Pradesh",
      userId: 7
    },
    {
      addressId: 8,
      addressLine1: "123 Main TownHall",
      city: "Manali",
      fullName: "AdyaAdya S",
      pinCode: "758423",
      state: "Himachal Pradesh",
      userId: 7
    },
    {
      addressId: 9,
      addressLine1: "123 Main TownHall",
      city: "Manali",
      fullName: "AdyaAdya S",
      pinCode: "758423",
      state: "Himachal Pradesh",
      userId: 7
    },
    {
      addressId: 10,
      addressLine1: "123 Main TownHall",
      city: "Manali",
      fullName: "AdyaAdya S",
      pinCode: "758423",
      state: "Himachal Pradesh",
      userId: 7
    }
  ],
  users: [
    {
      userId: 1,
      email: "demo@demo.com",
      password: "password",
      fullName: "Demo User",
      status: "ACTIVE"
    }
  ],
  orders: [
    {
      orderDate: "2026-08-01T18:00:39.611268",
      orderId: 1,
      orderStatus: "DELIVERED",
      paymentType: "CREDIT_CARD",
      totalAmount: 5000.00,
      transactionRef: null
    },
    {
      orderDate: "2026-08-01T18:16:05.702162",
      orderId: 2,
      orderStatus: "DELIVERED",
      paymentType: "UPI",
      totalAmount: 5000.00,
      transactionRef: null
    },
    {
      orderDate: "2026-08-14T17:33:46.512141",
      orderId: 5,
      orderStatus: "DELIVERED",
      paymentType: "CREDIT_CARD",
      totalAmount: 8883.96,
      transactionRef: null
    },
    {
      orderDate: "2026-08-19T21:55:02.231812",
      orderId: 6,
      orderStatus: "ORDER_PLACED",
      paymentType: "CREDIT_CARD",
      totalAmount: 5139.98,
      transactionRef: null
    }
  ],
  cart: {
    cartId: 14,
    grandTotal: 19.99,
    items: [
      {
        cartItemId: 22,
        price: 19.99,
        productId: 10,
        productName: "Eyeshadow Palette with Mirror",
        quantity: 1,
        totalPrice: 19.99
      }
    ],
    userId: 9
  }
};

// Local Storage Service
class LocalStorageService {
  constructor() {
    this.initializeData();
  }

  // Initialize data in local storage if not exists
  initializeData() {
    if (!localStorage.getItem('ecommerce_data')) {
      localStorage.setItem('ecommerce_data', JSON.stringify(INITIAL_DATA));
    }
  }

  // Get all data
  getData() {
    const data = localStorage.getItem('ecommerce_data');
    return data ? JSON.parse(data) : INITIAL_DATA;
  }

  // Save data
  saveData(data) {
    localStorage.setItem('ecommerce_data', JSON.stringify(data));
  }

  // Category methods
  getCategories() {
    const data = this.getData();
    return data.categories || [];
  }

  getCategoryById(categoryId) {
    const categories = this.getCategories();
    return categories.find(cat => cat.categoryId === categoryId);
  }

  // Product methods
  getProducts() {
    const data = this.getData();
    return data.products || [];
  }

  getProductById(productId) {
    const products = this.getProducts();
    return products.find(prod => prod.productId === productId);
  }

  getProductsByCategory(categoryName) {
    const products = this.getProducts();
    return products.filter(prod => prod.categoryName === categoryName);
  }

  // Address methods
  getAddresses() {
    const data = this.getData();
    return data.addresses || [];
  }

  getAddressesByUserId(userId) {
    const addresses = this.getAddresses();
    return addresses.filter(addr => addr.userId === userId);
  }

  addAddress(address) {
    const data = this.getData();
    const newAddress = {
      ...address,
      addressId: data.addresses.length > 0 ? Math.max(...data.addresses.map(a => a.addressId)) + 1 : 1
    };
    data.addresses.push(newAddress);
    this.saveData(data);
    return newAddress;
  }

  // Order methods
  getOrders() {
    const data = this.getData();
    return data.orders || [];
  }

  getOrdersByUserId(userId) {
    const orders = this.getOrders();
    return orders.filter(o => o.userId === userId);
  }

  addOrder(order) {
    const data = this.getData();
    const newOrder = {
      ...order,
      orderId: data.orders.length > 0 ? Math.max(...data.orders.map(o => o.orderId)) + 1 : 1,
      orderDate: new Date().toISOString()
    };
    data.orders.push(newOrder);
    this.saveData(data);
    return newOrder;
  }

  // Cart methods
  getCart() {
    const data = this.getData();
    return data.cart || { items: [], grandTotal: 0 };
  }

  addToCart(productId, quantity = 1) {
    const data = this.getData();
    if (!data.cart) {
      data.cart = { cartId: 1, items: [], grandTotal: 0, userId: 1 };
    }

    const product = this.getProductById(productId);
    if (!product) return null;

    const existingItem = data.cart.items.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalPrice = existingItem.price * existingItem.quantity;
    } else {
      data.cart.items.push({
        cartItemId: data.cart.items.length > 0 ? Math.max(...data.cart.items.map(i => i.cartItemId)) + 1 : 1,
        price: product.price,
        productId: product.productId,
        productName: product.productName,
        quantity: quantity,
        totalPrice: product.price * quantity
      });
    }

    // Update grand total
    data.cart.grandTotal = data.cart.items.reduce((total, item) => total + item.totalPrice, 0);
    
    this.saveData(data);
    return data.cart;
  }

  removeFromCart(productId) {
    const data = this.getData();
    if (!data.cart) return null;

    data.cart.items = data.cart.items.filter(item => item.productId !== productId);
    data.cart.grandTotal = data.cart.items.reduce((total, item) => total + item.totalPrice, 0);
    
    this.saveData(data);
    return data.cart;
  }

  updateCartItemQuantity(productId, quantity) {
    const data = this.getData();
    if (!data.cart) return null;

    const item = data.cart.items.find(item => item.productId === productId);
    if (!item) return null;

    if (quantity <= 0) {
      return this.removeFromCart(productId);
    }

    item.quantity = quantity;
    item.totalPrice = item.price * quantity;
    data.cart.grandTotal = data.cart.items.reduce((total, item) => total + item.totalPrice, 0);
    
    this.saveData(data);
    return data.cart;
  }

  clearCart() {
    const data = this.getData();
    if (data.cart) {
      data.cart.items = [];
      data.cart.grandTotal = 0;
      this.saveData(data);
    }
    return data.cart;
  }

  // User methods
  getUsers() {
    const data = this.getData();
    return data.users || [];
  }

  findUserByEmailAndPassword(email, password) {
    const users = this.getUsers();
    return users.find(u => u.email === email && u.password === password) || null;
  }

  addUser(user) {
    const data = this.getData();
    const newUser = {
      ...user,
      userId: data.users && data.users.length > 0 ? Math.max(...data.users.map(u => u.userId)) + 1 : 1,
      status: user.status || 'ACTIVE'
    };
    data.users = data.users || [];
    data.users.push(newUser);
    this.saveData(data);
    return newUser;
  }
}

// Create a singleton instance
const localStorageService = new LocalStorageService();

// Export the service and individual methods for convenience
export default localStorageService;

// Individual exports for specific use cases
export const {
  getCategories,
  getCategoryById,
  getProducts,
  getProductById,
  getProductsByCategory,
  getAddresses,
  getAddressesByUserId,
  addAddress,
  getOrders,
  getOrdersByUserId,
  addOrder,
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart
  ,
  getUsers,
  findUserByEmailAndPassword,
  addUser
} = localStorageService;