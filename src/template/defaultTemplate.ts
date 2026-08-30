import { TemplateModel } from '../types/template';

export const DEFAULT_TEMPLATE: TemplateModel = {
  id: 'template_lumina_coffee_roastery',
  version: '1.0.0',
  title: 'Lumina Artisanal Indian Single-Origin Roasters',
  description: 'A modern, responsive landing page for an artisanal specialty coffee roastery sourcing from heritage estates in India.',
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
        buttonText: 'Order Fresh Roasts',
        items: ['Our Indian Estates', 'Origins', 'Brew Guides', 'Coffee Journal'],
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
        badge: '✨ 100% Indian Shade-Grown Harvest 2026',
        title: 'Freshly Roasted Single-Origin Specialty Coffee from the Western Ghats.',
        subtitle: 'Handcrafted in micro-batches from third-generation family estates across Chikmagalur, Coorg, and Araku Valley for rich aroma and taste.',
        buttonText: 'Explore Single-Origin Coffees ➔',
        buttonLink: '#products',
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80',
        imageAlt: 'Steaming cup of freshly brewed Indian artisanal specialty coffee',
      },
      overrides: {
        mobile: {
          styles: {
            padding: '2.5rem 1rem',
            margin: '0.75rem auto',
            fontSize: '15px',
          },
          content: {
            title: 'Freshly Roasted Single-Origin Coffee from Western Ghats.',
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
        title: 'Why Coffee Lovers Across India Choose Lumina',
        subtitle: 'Our promise of ethical estate sourcing, artisanal roasting, and delivery within 24 hours of roasting.',
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
      name: 'Feature Card 1: Direct Estate Sourcing',
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
        badge: '🌱 100% Direct Estate Trade',
        title: 'Ethical Planter Partnerships',
        text: 'We pay premium prices directly to generational coffee planters in Chikmagalur, Coorg, and Biligirirangana Hills.',
        imageUrl: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&w=600&q=80',
        imageAlt: 'Harvested ripe specialty coffee cherries at origin',
      },
      overrides: {},
    },

    elem_card_feature_2: {
      id: 'elem_card_feature_2',
      type: 'card',
      parentId: 'elem_features_grid',
      name: 'Feature Card 2: Small-Batch Roasting',
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
        badge: '🔥 Micro-Batch Drum Roasting',
        title: 'Precision Temperature Curves',
        text: 'Roasted in small 5kg batches in Bengaluru using customized heat profiles to bring out natural chocolate and caramel notes.',
        imageUrl: 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=600&q=80',
        imageAlt: 'Specialty coffee roasting drum with golden flame',
      },
      overrides: {},
    },

    elem_card_feature_3: {
      id: 'elem_card_feature_3',
      type: 'card',
      parentId: 'elem_features_grid',
      name: 'Feature Card 3: Fresh Delivery Across India',
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
        badge: '📦 Roasted & Dispatched in 24h',
        title: 'Guaranteed Peak Freshness',
        text: 'Packed in nitrogen-flushed, eco-friendly valve pouches and delivered directly to your doorstep across all pin codes in India.',
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
        badge: '🌟 Curated Indian Harvests',
        title: 'Featured Single-Origin Estate Coffees',
        subtitle: 'Tasting notes of Roasted Almonds, Wild Honey, Citrus Blossom, and Dark Chocolate.',
      },
      overrides: {},
    },

    elem_product_card_1: {
      id: 'elem_product_card_1',
      type: 'card',
      parentId: 'elem_products_section',
      name: 'Product Card: Chikmagalur Heritage Arabica',
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
        title: 'Chikmagalur Heritage Arabica',
        tagline: 'Washed Process • 1,400m Altitude • Baba Budan Giri',
        price: '₹550 / 250g',
        text: 'Sweet caramel aroma, smooth dark chocolate body, and a crisp citrus blossom finish. Ideal for South Indian Filter, Pour-over, and French Press.',
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
      name: 'Product Card: Araku Valley Tribal Micro-Lot',
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
        badge: '🏆 Master Roaster’s Pick',
        title: 'Araku Valley Tribal Micro-Lot',
        tagline: 'Natural Sun-Dried • 1,200m Altitude • Eastern Ghats',
        price: '₹620 / 250g',
        text: 'Rich wild honey, ripe forest berries, toasted hazelnuts, and a velvety crema. Award-winning organic harvest cultivated by tribal farmers.',
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
      name: 'Customer Testimonial',
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
        badge: '★★★★★ 4.9/5 from 3,500+ Indian Coffee Brewers',
        title: '“The freshest, most aromatic single-estate roast I have brewed in India. The Chikmagalur filter roast is absolute perfection every morning.”',
        subtitle: '— Rohan Malhotra, Certified Coffee Connoisseur & Home Brewer, Bengaluru',
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
        title: 'Get Freshly Roasted Coffee Delivered Across India',
        subtitle: 'Subscribe to our monthly Roastery Plan and get 15% off plus a complimentary brass coffee measuring spoon with your first order.',
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
        text: '© 2026 Lumina Artisanal Coffee Roasters Pvt Ltd. Roasted with pride in Bengaluru, Karnataka. Sourced ethically from Western & Eastern Ghats.',
        items: ['Privacy Policy', 'Terms of Service', 'Estate Partnerships', 'Wholesale & Café Enquiries'],
      },
      overrides: {},
    },
  },
};
