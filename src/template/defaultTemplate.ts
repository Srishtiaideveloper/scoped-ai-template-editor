import { TemplateModel } from '../types/template';

export const DEFAULT_TEMPLATE: TemplateModel = {
  id: 'template_lumina_coffee_roastery',
  version: '1.0.0',
  title: 'Lumina Artisanal Coffee & Roastery',
  description: 'A modern, responsive one-page landing page for an artisanal specialty coffee roaster.',
  revision: 1,
  lastModified: new Date().toISOString(),
  globalSettings: {
    fontFamily: 'Inter, sans-serif',
    primaryColor: '#c59132',
    accentColor: '#d4aa4f',
    backgroundColor: '#090d16',
  },
  rootElementIds: [
    'elem_navbar',
    'elem_hero',
    'elem_features_grid',
    'elem_products_section',
    'elem_testimonial',
    'elem_cta_banner',
    'elem_footer',
  ],
  elements: {
    // 1. Navigation Bar
    elem_navbar: {
      id: 'elem_navbar',
      type: 'navbar',
      parentId: null,
      name: 'Navigation Header',
      revision: 1,
      updatedAt: new Date().toISOString(),
      baseStyles: {
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        textColor: '#f8fafc',
        padding: '1.25rem 2rem',
        borderRadius: '0px',
        border: '0px solid transparent',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backdropBlur: '12px',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.3)',
      },
      baseContent: {
        title: '☕ LUMINA ROASTERS',
        buttonText: 'Order Subscription',
        items: ['Our Roasts', 'Origins', 'Brew Guides', 'Journal'],
      },
      overrides: {},
    },

    // 2. Hero Section
    elem_hero: {
      id: 'elem_hero',
      type: 'hero',
      parentId: null,
      name: 'Hero Section',
      revision: 1,
      updatedAt: new Date().toISOString(),
      baseStyles: {
        backgroundColor: '#0b1120',
        textColor: '#f8fafc',
        padding: '4.5rem 2rem',
        textAlign: 'center',
        borderRadius: '1.5rem',
        margin: '1.5rem auto',
        maxWidth: '1200px',
        border: '1px solid rgba(212, 170, 79, 0.25)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
      },
      baseContent: {
        badge: '✨ Single-Origin Harvest 2026',
        title: 'Precision-Crafted Specialty Coffee, Roasted to Pure Perfection.',
        subtitle: 'We source micro-lots directly from high-altitude regenerative farms and roast in small batches for extraordinary aromatic clarity.',
        buttonText: 'Explore Coffee Collection ➔',
        buttonLink: '#products',
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80',
        imageAlt: 'Steaming cup of artisanal specialty coffee with latte art',
      },
      overrides: {
        mobile: {
          styles: {
            padding: '2.5rem 1rem',
            margin: '0.75rem auto',
            fontSize: '15px',
          },
          content: {
            title: 'Precision-Crafted Specialty Coffee.',
          }
        }
      },
    },

    // 3. Features Grid
    elem_features_grid: {
      id: 'elem_features_grid',
      type: 'grid',
      parentId: null,
      name: 'Value Proposition Grid',
      revision: 1,
      updatedAt: new Date().toISOString(),
      baseStyles: {
        backgroundColor: 'transparent',
        textColor: '#cbd5e1',
        padding: '3rem 1rem',
        display: 'block',
        gridColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
      },
      baseContent: {
        title: 'Why Connoisseurs Choose Lumina',
        subtitle: 'Our commitment to craft and radical transparency at every step of the supply chain.',
      },
      overrides: {
        tablet: {
          styles: {
            gridColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '1rem',
            padding: '2rem 1rem',
          }
        },
        mobile: {
          styles: {
            gridColumns: 'repeat(1, minmax(0, 1fr))',
            gap: '1rem',
            padding: '1.5rem 1rem',
          }
        }
      },
    },

    elem_card_feature_1: {
      id: 'elem_card_feature_1',
      type: 'card',
      parentId: 'elem_features_grid',
      name: 'Feature Card 1: Direct Trade',
      revision: 1,
      updatedAt: new Date().toISOString(),
      baseStyles: {
        backgroundColor: '#131c31',
        textColor: '#e2e8f0',
        padding: '1.75rem',
        borderRadius: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
      },
      baseContent: {
        badge: '🌱 100% Direct Trade',
        title: 'Ethical Farmer Partnerships',
        text: 'We pay 300% above Fair Trade minimums directly to farming families in Huila, Yirgacheffe, and Antigua.',
        imageUrl: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&w=600&q=80',
        imageAlt: 'Harvested ripe specialty coffee cherries at origin',
      },
      overrides: {},
    },

    elem_card_feature_2: {
      id: 'elem_card_feature_2',
      type: 'card',
      parentId: 'elem_features_grid',
      name: 'Feature Card 2: Micro-Batch',
      revision: 1,
      updatedAt: new Date().toISOString(),
      baseStyles: {
        backgroundColor: '#131c31',
        textColor: '#e2e8f0',
        padding: '1.75rem',
        borderRadius: '1rem',
        border: '1px solid rgba(255, 255, 79, 0.15)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
      },
      baseContent: {
        badge: '🔥 Micro-Batch Roasting',
        title: 'Custom Heat Curves',
        text: 'Each lot is roasted on restored cast-iron drum roasters with real-time temperature telemetry for unmatched flavor profiles.',
        imageUrl: 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=600&q=80',
        imageAlt: 'Specialty coffee roasting drum with golden flame',
      },
      overrides: {},
    },

    elem_card_feature_3: {
      id: 'elem_card_feature_3',
      type: 'card',
      parentId: 'elem_features_grid',
      name: 'Feature Card 3: Fresh Delivery',
      revision: 1,
      updatedAt: new Date().toISOString(),
      baseStyles: {
        backgroundColor: '#131c31',
        textColor: '#e2e8f0',
        padding: '1.75rem',
        borderRadius: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
      },
      baseContent: {
        badge: '📦 Roasted & Shipped in 24h',
        title: 'Peak Degassing Window',
        text: 'Dispatched in nitrogen-flushed, 100% compostable valve pouches so coffee arrives at its sensory peak.',
        imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
        imageAlt: 'Fresh nitrogen-flushed artisan coffee beans',
      },
      overrides: {},
    },

    // 4. Products Menu Showcase Section
    elem_products_section: {
      id: 'elem_products_section',
      type: 'section',
      parentId: null,
      name: 'Product Showcase Section',
      revision: 1,
      updatedAt: new Date().toISOString(),
      baseStyles: {
        backgroundColor: '#0e1526',
        textColor: '#f8fafc',
        padding: '4rem 2rem',
        borderRadius: '1.5rem',
        maxWidth: '1200px',
        margin: '2rem auto',
        border: '1px solid rgba(212, 170, 79, 0.2)',
      },
      baseContent: {
        badge: '🌟 Curated Micro-Lots',
        title: 'Seasonal Single-Origin Offerings',
        subtitle: 'Tasting notes of Jasmine, Wild Berries, Stone Fruit, and Dark Chocolate.',
      },
      overrides: {},
    },

    elem_product_card_1: {
      id: 'elem_product_card_1',
      type: 'card',
      parentId: 'elem_products_section',
      name: 'Product Card: Ethiopian Yirgacheffe',
      revision: 1,
      updatedAt: new Date().toISOString(),
      baseStyles: {
        backgroundColor: '#162038',
        textColor: '#f8fafc',
        padding: '1.75rem',
        borderRadius: '1rem',
        border: '1px solid rgba(212, 170, 79, 0.25)',
      },
      baseContent: {
        title: 'Ethiopia Yirgacheffe G1',
        tagline: 'Washed Process • 2,100m MASL',
        price: '$22.00 / 250g',
        text: 'Bright bergamot, floral jasmine bouquet, and sweet candied lemon finish.',
        buttonText: 'Add to Bag',
        imageUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=600&q=80',
        imageAlt: 'Ethiopian Yirgacheffe roasted coffee beans package',
      },
      overrides: {},
    },

    elem_product_card_2: {
      id: 'elem_product_card_2',
      type: 'card',
      parentId: 'elem_products_section',
      name: 'Product Card: Colombian Geisha',
      revision: 1,
      updatedAt: new Date().toISOString(),
      baseStyles: {
        backgroundColor: '#162038',
        textColor: '#f8fafc',
        padding: '1.75rem',
        borderRadius: '1rem',
        border: '1px solid rgba(212, 170, 79, 0.4)',
        boxShadow: '0 0 20px -5px rgba(212, 170, 79, 0.25)',
      },
      baseContent: {
        badge: '🏆 Roaster’s Reserve',
        title: 'Colombia Huila Pink Bourbon',
        tagline: 'Anaerobic Natural • 1,950m MASL',
        price: '$26.00 / 250g',
        text: 'Tropical passionfruit, wild strawberry jam, and creamy lavender honey.',
        buttonText: 'Add to Bag',
        imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80',
        imageAlt: 'Specialty pour-over coffee carafe with rich crema',
      },
      overrides: {},
    },

    // 5. Testimonial Section
    elem_testimonial: {
      id: 'elem_testimonial',
      type: 'testimonial',
      parentId: null,
      name: 'Social Proof Testimonial',
      revision: 1,
      updatedAt: new Date().toISOString(),
      baseStyles: {
        backgroundColor: '#131b2e',
        textColor: '#e2e8f0',
        padding: '3rem 2.5rem',
        borderRadius: '1.25rem',
        maxWidth: '900px',
        margin: '2rem auto',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      },
      baseContent: {
        badge: '★★★★★ 4.9/5 from 1,200+ Coffee Lovers',
        title: '“The cleanest, most nuanced roast profile I have brewed in a decade of specialty coffee.”',
        subtitle: '— Marcus Vance, Q-Grader & Coffee Director, Portland OR',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      },
      overrides: {},
    },

    // 6. CTA Newsletter Banner
    elem_cta_banner: {
      id: 'elem_cta_banner',
      type: 'container',
      parentId: null,
      name: 'Call to Action Newsletter',
      revision: 1,
      updatedAt: new Date().toISOString(),
      baseStyles: {
        backgroundColor: '#1a1811',
        textColor: '#fef3c7',
        padding: '3.5rem 2rem',
        borderRadius: '1.5rem',
        maxWidth: '1200px',
        margin: '2rem auto',
        textAlign: 'center',
        border: '1px solid #c59132',
        boxShadow: '0 15px 35px -10px rgba(197, 145, 50, 0.25)',
      },
      baseContent: {
        title: 'Experience Fresh Roasts at Home',
        subtitle: 'Subscribe today and receive our limited-edition tasting glass plus 15% off your first 3 deliveries.',
        buttonText: 'Join the Roastery Club ➔',
      },
      overrides: {},
    },

    // 7. Footer
    elem_footer: {
      id: 'elem_footer',
      type: 'footer',
      parentId: null,
      name: 'Footer Section',
      revision: 1,
      updatedAt: new Date().toISOString(),
      baseStyles: {
        backgroundColor: '#080c14',
        textColor: '#64748b',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        borderRadius: '0px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      },
      baseContent: {
        text: '© 2026 Lumina Coffee Roastery Inc. All rights reserved. Sourced ethically worldwide.',
        items: ['Privacy Policy', 'Terms of Service', 'Wholesale Inquiries', 'Sustainability Report'],
      },
      overrides: {},
    },
  },
};
