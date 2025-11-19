module.exports = {
  categories: [
    {
      name: 'Laptops & Tablets',
      description:
        'Premium notebooks and versatile tablets designed for productivity and creativity.'
    },
    {
      name: 'Smartphones & Wearables',
      description:
        'Flagship smartphones and connected wearables that keep you ahead of the curve.'
    },
    {
      name: 'Audio & Music',
      description:
        'Immersive headphones and smart speakers tuned for audiophiles.'
    },
    {
      name: 'Cameras & Drones',
      description:
        'High-resolution cameras and agile drones for capturing every moment.'
    },
    {
      name: 'Home Essentials',
      description:
        'Smart appliances that bring comfort, convenience, and efficiency to your home.'
    },
    {
      name: 'Gaming & Entertainment',
      description:
        'Next-gen consoles and accessories built for competitive gaming and VR adventures.'
    }
  ],
  merchants: [
    {
      name: 'TechWave Warehouses',
      email: 'contact@techwave.com',
      phoneNumber: '+1-800-555-1001',
      brandName: 'TechWave',
      business:
        'Authorized retailer for TechWave laptops and tablets with nationwide coverage.'
    },
    {
      name: 'PixelPro Trading',
      email: 'hello@pixelpro.com',
      phoneNumber: '+1-800-555-1002',
      brandName: 'PixelPro',
      business:
        'Specialised distributor of PixelPro smartphones and wearable devices.'
    },
    {
      name: 'SoundSphere Distribution',
      email: 'support@soundsphere.com',
      phoneNumber: '+1-800-555-1003',
      brandName: 'SoundSphere',
      business:
        'Supplies immersive audio gear and smart speakers to retailers worldwide.'
    },
    {
      name: 'Lumina Optics Hub',
      email: 'sales@luminaoptics.com',
      phoneNumber: '+1-800-555-1004',
      brandName: 'Lumina Optics',
      business:
        'Premier supplier of Lumina Optics cameras, lenses, and aerial drones.'
    },
    {
      name: 'HomeEase Suppliers',
      email: 'info@homeease.com',
      phoneNumber: '+1-800-555-1005',
      brandName: 'HomeEase',
      business:
        'Distributes smart appliances engineered to simplify everyday living.'
    },
    {
      name: 'GameForge Outlets',
      email: 'press@gameforge.com',
      phoneNumber: '+1-800-555-1006',
      brandName: 'GameForge',
      business:
        'Official channel partner for GameForge consoles, VR gear, and accessories.'
    }
  ],
  brands: [
    {
      name: 'TechWave',
      description:
        'Cutting-edge laptops and tablets engineered for professionals and creators.',
      merchantEmail: 'contact@techwave.com'
    },
    {
      name: 'PixelPro',
      description:
        'Flagship smartphones and wearable devices that blend design with intelligence.',
      merchantEmail: 'hello@pixelpro.com'
    },
    {
      name: 'SoundSphere',
      description:
        'Immersive audio equipment with adaptive sound and seamless smart-home integration.',
      merchantEmail: 'support@soundsphere.com'
    },
    {
      name: 'Lumina Optics',
      description:
        'Cameras and drones that deliver professional-grade optics with intuitive controls.',
      merchantEmail: 'sales@luminaoptics.com'
    },
    {
      name: 'HomeEase',
      description:
        'Smart appliances that learn your routines to create a relaxed, efficient home.',
      merchantEmail: 'info@homeease.com'
    },
    {
      name: 'GameForge',
      description:
        'High-performance gaming systems and VR accessories for enthusiasts.',
      merchantEmail: 'press@gameforge.com'
    }
  ],
  products: [
    {
      sku: 'TW-ULTRA-14',
      name: 'TechWave Atlas 14" Ultrabook',
      description:
        'Ultra-thin aluminium chassis with 11th Gen Intel i7, 16GB RAM, and 1TB NVMe SSD.',
      price: 1299,
      quantity: 25,
      taxable: true,
      isFeatured: true,
      categoryName: 'Laptops & Tablets',
      brandName: 'TechWave',
      imageUrl:
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=960&q=80'
    },
    {
      sku: 'TW-FLEX-12',
      name: 'TechWave Flex 12" 2-in-1 Tablet',
      description:
        'Convertible touchscreen with detachable keyboard, Wi-Fi 6, and all-day battery.',
      price: 899,
      quantity: 40,
      taxable: true,
      isFeatured: false,
      categoryName: 'Laptops & Tablets',
      brandName: 'TechWave',
      imageUrl:
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=960&q=80'
    },
    {
      sku: 'TW-STRATA-15',
      name: 'TechWave Strata 15" Workstation',
      description:
        'Performance-focused mobile workstation with RTX graphics and advanced thermal design.',
      price: 1599,
      quantity: 20,
      taxable: true,
      isFeatured: true,
      categoryName: 'Laptops & Tablets',
      brandName: 'TechWave',
      imageUrl:
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=960&q=80'
    },
    {
      sku: 'TW-AIRNOTE-13',
      name: 'TechWave AirNote 13" Notebook',
      description:
        'Featherweight ultrabook with OLED display, instant wake, and Wi-Fi 6E.',
      price: 1099,
      quantity: 35,
      taxable: true,
      isFeatured: false,
      categoryName: 'Laptops & Tablets',
      brandName: 'TechWave',
      imageUrl:
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=960&q=80'
    },
    {
      sku: 'PP-X1-PRO',
      name: 'PixelPro X1 Pro Smartphone',
      description:
        '6.7" AMOLED display, triple 108MP camera system, and AI-enhanced performance.',
      price: 999,
      quantity: 50,
      taxable: true,
      isFeatured: true,
      categoryName: 'Smartphones & Wearables',
      brandName: 'PixelPro',
      imageUrl:
        'https://cdn2.cellphones.com.vn/x/media/catalog/product/_/v/_vc_1.jpg'
    },
    {
      sku: 'PP-ACTIVE-2',
      name: 'PixelPro Active Watch 2',
      description:
        'Lightweight smartwatch with ECG monitoring, LTE connectivity, and 3-day battery life.',
      price: 299,
      quantity: 80,
      taxable: true,
      isFeatured: true,
      categoryName: 'Smartphones & Wearables',
      brandName: 'PixelPro',
      imageUrl:
        'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=960&q=80'
    },
    {
      sku: 'PP-LITE-5G',
      name: 'PixelPro Lite 5G Smartphone',
      description:
        'Slim 5G-ready phone with dual cameras and adaptive refresh display.',
      price: 699,
      quantity: 60,
      taxable: true,
      isFeatured: false,
      categoryName: 'Smartphones & Wearables',
      brandName: 'PixelPro',
      imageUrl:
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=960&q=80'
    },
    {
      sku: 'PP-BUDS-PRO',
      name: 'PixelPro Studio Buds Pro',
      description:
        'Wireless earbuds with adaptive EQ, transparency mode, and Qi charging case.',
      price: 199,
      quantity: 120,
      taxable: true,
      isFeatured: false,
      categoryName: 'Smartphones & Wearables',
      brandName: 'PixelPro',
      imageUrl:
        'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?auto=format&fit=crop&w=960&q=80'
    },
    {
      sku: 'SS-AURA-NC',
      name: 'SoundSphere Aura Noise-Canceling Headphones',
      description:
        'Adaptive noise cancellation with studio-grade drivers and 30 hours of playback.',
      price: 349,
      quantity: 60,
      taxable: true,
      isFeatured: true,
      categoryName: 'Audio & Music',
      brandName: 'SoundSphere',
      imageUrl:
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=960&q=80'
    },
    {
      sku: 'SS-PULSE-SMART',
      name: 'SoundSphere Pulse Smart Speaker',
      description:
        'Room-filling 360° audio, far-field microphones, and multi-room synchronisation.',
      price: 199,
      quantity: 90,
      taxable: true,
      isFeatured: false,
      categoryName: 'Audio & Music',
      brandName: 'SoundSphere',
      imageUrl:
        'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=960&q=80'
    },
    {
      sku: 'SS-STUDIO-MON',
      name: 'SoundSphere Studio Reference Monitors',
      description:
        'Bi-amped nearfield monitors tuned for colour-accurate mixing and mastering.',
      price: 549,
      quantity: 30,
      taxable: true,
      isFeatured: false,
      categoryName: 'Audio & Music',
      brandName: 'SoundSphere',
      imageUrl:
        'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=960&q=80'
    },
    {
      sku: 'SS-MOTION-SBAR',
      name: 'SoundSphere Motion Dolby Soundbar',
      description:
        'Slim Dolby Atmos soundbar with wireless subwoofer and adaptive voice enhancement.',
      price: 499,
      quantity: 45,
      taxable: true,
      isFeatured: false,
      categoryName: 'Audio & Music',
      brandName: 'SoundSphere',
      imageUrl:
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=960&q=80'
    },
    {
      sku: 'LO-VESTA-M',
      name: 'Lumina Optics Vesta Mirrorless Camera',
      description:
        '24MP full-frame sensor, 5-axis stabilisation, and 4K/60fps video capture.',
      price: 1199,
      quantity: 30,
      taxable: true,
      isFeatured: true,
      categoryName: 'Cameras & Drones',
      brandName: 'Lumina Optics',
      imageUrl:
        'https://fotocentreindia.com/wp-content/uploads/Sony-a7-III-Mirrorless-Camera-Body-Only-Online-Buy-India_1.jpg'
    },
    {
      sku: 'LO-AIRSCOUT',
      name: 'Lumina Optics AirScout Drone',
      description:
        'Foldable 6K aerial drone with obstacle avoidance and 45-minute flight time.',
      price: 899,
      quantity: 35,
      taxable: true,
      isFeatured: false,
      categoryName: 'Cameras & Drones',
      brandName: 'Lumina Optics',
      imageUrl:
        'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=960&q=80'
    },
    {
      sku: 'LO-PRIME-35',
      name: 'Lumina Optics Prime 35mm Lens',
      description:
        'Fast f/1.4 prime lens with weather sealing and whisper-quiet autofocus.',
      price: 799,
      quantity: 40,
      taxable: true,
      isFeatured: true,
      categoryName: 'Cameras & Drones',
      brandName: 'Lumina Optics',
      imageUrl:
        'https://nisiopticsusa.com/wp-content/uploads/2025/03/Aureus-35PL.jpg'
    },
    {
      sku: 'LO-SCOUT-MINI',
      name: 'Lumina Optics Scout Mini Drone',
      description:
        'Compact travel drone with 4K HDR camera and quick-launch smart modes.',
      price: 649,
      quantity: 50,
      taxable: true,
      isFeatured: false,
      categoryName: 'Cameras & Drones',
      brandName: 'Lumina Optics',
      imageUrl:
        'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=960&q=80'
    },
    {
      sku: 'HE-PUREFLOW',
      name: 'HomeEase PureFlow Robot Vacuum',
      description:
        'Laser navigation, automatic dirt disposal, and app-controlled cleaning routines.',
      price: 499,
      quantity: 45,
      taxable: true,
      isFeatured: true,
      categoryName: 'Home Essentials',
      brandName: 'HomeEase',
      imageUrl:
        'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=960&q=80'
    },
    {
      sku: 'HE-BARISTA',
      name: 'HomeEase Barista Smart Coffee Maker',
      description:
        'Wi-Fi connected brewer with bean-to-cup grinding and custom brew profiles.',
      price: 249,
      quantity: 55,
      taxable: true,
      isFeatured: false,
      categoryName: 'Home Essentials',
      brandName: 'HomeEase',
      imageUrl:
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=960&q=80'
    },
    {
      sku: 'HE-CLIMATE-SENSE',
      name: 'HomeEase Climate Sense Thermostat',
      description:
        'Smart thermostat with occupancy sensing, scheduling, and energy reports.',
      price: 299,
      quantity: 70,
      taxable: true,
      isFeatured: true,
      categoryName: 'Home Essentials',
      brandName: 'HomeEase',
      imageUrl:
        'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?auto=format&fit=crop&w=960&q=80'
    },
    {
      sku: 'HE-PUREAIR',
      name: 'HomeEase PureAir Smart Purifier',
      description:
        'HEPA air purifier with air quality sensors and automatic night mode.',
      price: 349,
      quantity: 65,
      taxable: true,
      isFeatured: false,
      categoryName: 'Home Essentials',
      brandName: 'HomeEase',
      imageUrl:
        'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=960&q=80'
    },
    {
      sku: 'GF-NEXUS',
      name: 'GameForge Nexus Console',
      description:
        'Next-gen 8K-ready console with 2TB SSD, ray tracing, and 120fps support.',
      price: 599,
      quantity: 70,
      taxable: true,
      isFeatured: true,
      categoryName: 'Gaming & Entertainment',
      brandName: 'GameForge',
      imageUrl:
        'https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=960&q=80'
    },
    {
      sku: 'GF-APEX-VR',
      name: 'GameForge Apex VR Headset',
      description:
        '4K per-eye resolution, inside-out tracking, and low-latency wireless streaming.',
      price: 449,
      quantity: 65,
      taxable: true,
      isFeatured: true,
      categoryName: 'Gaming & Entertainment',
      brandName: 'GameForge',
      imageUrl:
        'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=960&q=80'
    },
    {
      sku: 'GF-RIFT-CONTROL',
      name: 'GameForge Rift Wireless Controller',
      description:
        'Precision wireless controller with programmable paddles and Hall-effect sticks.',
      price: 129,
      quantity: 150,
      taxable: true,
      isFeatured: false,
      categoryName: 'Gaming & Entertainment',
      brandName: 'GameForge',
      imageUrl:
        'https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=960&q=80'
    },
    {
      sku: 'GF-STRIKE-CHAIR',
      name: 'GameForge Strike Gaming Chair',
      description:
        'Ergonomic gaming chair with memory foam cushions and adjustable lumbar support.',
      price: 349,
      quantity: 40,
      taxable: true,
      isFeatured: false,
      categoryName: 'Gaming & Entertainment',
      brandName: 'GameForge',
      imageUrl:
        'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=960&q=80'
    }
  ],
  productReviews: {
    'TW-ULTRA-14': [
      {
        userEmail: 'jane.doe@example.com',
        rating: 5,
        review:
          'Fantastic build quality and stellar battery life. Perfect companion for remote work.',
        isRecommended: true
      },
      {
        userEmail: 'john.smith@example.com',
        rating: 4,
        review:
          'Lightweight and powerful, though the fans can ramp up under heavy load.',
        isRecommended: true
      }
    ],
    'TW-FLEX-12': [
      {
        userEmail: 'jane.doe@example.com',
        rating: 4,
        review:
          'Tablet mode is excellent for sketching, but the detachable keyboard flexes a little.',
        isRecommended: true
      }
    ],
    'TW-STRATA-15': [
      {
        userEmail: 'alex.lee@example.com',
        rating: 5,
        review:
          'Desktop-grade performance in a portable body. Handles 4K editing without breaking a sweat.',
        isRecommended: true
      }
    ],
    'TW-AIRNOTE-13': [
      {
        userEmail: 'john.smith@example.com',
        rating: 4,
        review:
          'Super light and the OLED panel is gorgeous. Battery life could be a touch longer.',
        isRecommended: true
      }
    ],
    'PP-X1-PRO': [
      {
        userEmail: 'alex.lee@example.com',
        rating: 5,
        review:
          'Camera quality is unbelievable and the battery comfortably lasts two days.',
        isRecommended: true
      },
      {
        userEmail: 'jane.doe@example.com',
        rating: 4,
        review:
          'Brilliant performance, but wish the colour options included matte black.',
        isRecommended: true
      }
    ],
    'PP-ACTIVE-2': [
      {
        userEmail: 'john.smith@example.com',
        rating: 4,
        review:
          'Accurate fitness tracking and LTE works great. Straps could be softer.',
        isRecommended: true
      }
    ],
    'PP-LITE-5G': [
      {
        userEmail: 'jane.doe@example.com',
        rating: 4,
        review:
          'Excellent midrange value with a smooth display and reliable battery life.',
        isRecommended: true
      }
    ],
    'PP-BUDS-PRO': [
      {
        userEmail: 'alex.lee@example.com',
        rating: 5,
        review:
          'Great seal, rich bass, and the transparency mode sounds very natural.',
        isRecommended: true
      }
    ],
    'SS-AURA-NC': [
      {
        userEmail: 'alex.lee@example.com',
        rating: 5,
        review:
          'Noise cancellation rivals over-ears twice the price. The case supports quick charge too.',
        isRecommended: true
      }
    ],
    'SS-PULSE-SMART': [
      {
        userEmail: 'jane.doe@example.com',
        rating: 4,
        review:
          'Great for multi-room audio and Alexa integration is seamless.',
        isRecommended: true
      }
    ],
    'SS-STUDIO-MON': [
      {
        userEmail: 'alex.lee@example.com',
        rating: 5,
        review:
          'Flat response and plenty of headroom. Perfect for my home studio mixes.',
        isRecommended: true
      }
    ],
    'SS-MOTION-SBAR': [
      {
        userEmail: 'john.smith@example.com',
        rating: 4,
        review:
          'Dialogue is crisp and the wireless sub hits hard. Setup was quick too.',
        isRecommended: true
      }
    ],
    'LO-VESTA-M': [
      {
        userEmail: 'john.smith@example.com',
        rating: 5,
        review:
          'Autofocus is insanely fast and the low-light performance is top notch.',
        isRecommended: true
      },
      {
        userEmail: 'alex.lee@example.com',
        rating: 5,
        review:
          'Ergonomics are superb and the 4K footage is crisp with accurate colours.',
        isRecommended: true
      }
    ],
    'LO-AIRSCOUT': [
      {
        userEmail: 'jane.doe@example.com',
        rating: 4,
        review:
          'Easy to fly even for a beginner. Would love a bundled travel case.',
        isRecommended: true
      }
    ],
    'LO-PRIME-35': [
      {
        userEmail: 'john.smith@example.com',
        rating: 5,
        review:
          'Tack-sharp at f/1.4 and the weather sealing gives me peace of mind outdoors.',
        isRecommended: true
      }
    ],
    'LO-SCOUT-MINI': [
      {
        userEmail: 'alex.lee@example.com',
        rating: 4,
        review:
          'Fits easily in my backpack and still shoots beautiful 4K clips.',
        isRecommended: true
      }
    ],
    'HE-PUREFLOW': [
      {
        userEmail: 'john.smith@example.com',
        rating: 5,
        review:
          'Scheduling and room mapping work flawlessly. The auto-clean dock is a life saver.',
        isRecommended: true
      }
    ],
    'HE-BARISTA': [
      {
        userEmail: 'alex.lee@example.com',
        rating: 4,
        review:
          'Makes excellent espresso consistently. Setup takes a little patience.',
        isRecommended: true
      }
    ],
    'HE-CLIMATE-SENSE': [
      {
        userEmail: 'jane.doe@example.com',
        rating: 5,
        review:
          'Learning schedule works perfectly and the energy reports are super helpful.',
        isRecommended: true
      }
    ],
    'HE-PUREAIR': [
      {
        userEmail: 'john.smith@example.com',
        rating: 4,
        review:
          'Noticed a difference in air quality within a day. The auto mode is quiet at night.',
        isRecommended: true
      }
    ],
    'GF-NEXUS': [
      {
        userEmail: 'john.smith@example.com',
        rating: 5,
        review:
          'Load times are practically instant and 120fps gaming is smooth as silk.',
        isRecommended: true
      },
      {
        userEmail: 'jane.doe@example.com',
        rating: 5,
        review:
          'Controller haptics are next level. Could not be happier with the purchase.',
        isRecommended: true
      }
    ],
    'GF-APEX-VR': [
      {
        userEmail: 'alex.lee@example.com',
        rating: 4,
        review:
          'Resolution is amazingly sharp. Wish the head strap had a bit more padding.',
        isRecommended: true
      }
    ],
    'GF-RIFT-CONTROL': [
      {
        userEmail: 'jane.doe@example.com',
        rating: 4,
        review:
          'Buttons feel premium and the extra paddles are great for competitive play.',
        isRecommended: true
      }
    ],
    'GF-STRIKE-CHAIR': [
      {
        userEmail: 'alex.lee@example.com',
        rating: 5,
        review:
          'Supportive for long sessions and the memory foam cushions are fantastic.',
        isRecommended: true
      }
    ]
  },
  members: [
    {
      email: 'jane.doe@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      password: 'customer123'
    },
    {
      email: 'john.smith@example.com',
      firstName: 'John',
      lastName: 'Smith',
      password: 'customer123'
    },
    {
      email: 'alex.lee@example.com',
      firstName: 'Alex',
      lastName: 'Lee',
      password: 'customer123'
    }
  ],
  merchantUsers: [
    {
      email: 'contact@techwave.com',
      firstName: 'Mia',
      lastName: 'Thompson',
      password: 'merchant123'
    },
    {
      email: 'hello@pixelpro.com',
      firstName: 'Brian',
      lastName: 'Carson',
      password: 'merchant123'
    },
    {
      email: 'support@soundsphere.com',
      firstName: 'Stephanie',
      lastName: 'Nguyen',
      password: 'merchant123'
    },
    {
      email: 'sales@luminaoptics.com',
      firstName: 'Ethan',
      lastName: 'Lopez',
      password: 'merchant123'
    },
    {
      email: 'info@homeease.com',
      firstName: 'Priya',
      lastName: 'Kumar',
      password: 'merchant123'
    },
    {
      email: 'press@gameforge.com',
      firstName: 'Liam',
      lastName: 'Garcia',
      password: 'merchant123'
    }
  ]
};
