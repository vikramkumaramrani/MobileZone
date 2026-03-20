
import React from 'react';
import { Product, User } from './types';

export const INITIAL_USER: User = {
  id: 'admin-1',
  email: 'sagar@gmail.com',
  name: 'sagar Admin',
  role: 'admin'
};

export const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Zeeshan Ahmed',
    location: 'Karachi',
    comment: 'Ordered a Samsung S24 Ultra and received the packaging video within 2 hours! The phone is 100% genuine and the delivery was incredibly fast.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?u=zeeshan'
  },
  {
    id: 't2',
    name: 'Maria Khan',
    location: 'Lahore',
    comment: 'The Anker cables are original and much cheaper than other stores. Love the 4-day checking warranty, it gives so much peace of mind!',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?u=maria'
  },
  {
    id: 't3',
    name: 'Usman Malik',
    location: 'Islamabad',
    comment: 'Best place for mobile parts. I replaced my iPhone screen from here and the quality is indistinguishable from the original. Highly recommended!',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?u=usman'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'm1',
    name: 'Vivo V29 5G',
    category: 'Mobiles',
    brand: 'Vivo',
    description: 'Aura Screen Light, 50MP AF Group Selfie, 80W Fast Charge.',
    price: 154999,
    originalPrice: 159999,
    isHot: true,
    stock: 12,
    image: 'https://picsum.photos/seed/vivo/400/400',
    hoverImage: 'https://picsum.photos/seed/vivo-back/400/400',
    reviews: [
      { id: 'r1', userId: 'u1', userName: 'Ahmed Khan', rating: 5, comment: 'Great camera quality and very fast charging!', date: 'Jan 12, 2024' }
    ]
  },
  {
    id: 'm2',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Mobiles',
    brand: 'Samsung',
    description: 'Snapdragon 8 Gen 3, 200MP Camera, S Pen included.',
    price: 389999,
    originalPrice: 399999,
    isHot: true,
    stock: 5,
    image: 'https://picsum.photos/seed/samsung/400/400',
    hoverImage: 'https://picsum.photos/seed/samsung-detail/400/400',
    reviews: [
      { id: 'r2', userId: 'u2', userName: 'Sara Ali', rating: 5, comment: 'The best display I have ever seen on a phone.', date: 'Feb 05, 2024' }
    ]
  },
  {
    id: 'c1',
    name: 'Anker PowerLine+ II (Lightning)',
    category: 'Cables',
    brand: 'Anker',
    description: 'Apple MFi Certified, Braided Fast Charging USB to Lightning Cable for iPhones.',
    price: 2999,
    originalPrice: 3500,
    stock: 50,
    image: 'https://picsum.photos/seed/cable-lightning/400/400',
    hoverImage: 'https://picsum.photos/seed/cable-lightning-alt/400/400'
  },
  {
    id: 'c2',
    name: 'Mi 100W Type-C Braided Cable',
    category: 'Cables',
    brand: 'Xiaomi',
    description: 'Ultra-fast 100W charging support, durable braided design for modern Android phones and laptops.',
    price: 1800,
    originalPrice: 2200,
    stock: 45,
    image: 'https://picsum.photos/seed/cable-typec/400/400',
    hoverImage: 'https://picsum.photos/seed/cable-typec-alt/400/400'
  },
  {
    id: 'c3',
    name: 'Baseus Micro-USB Fast Cable',
    category: 'Cables',
    brand: 'Baseus',
    description: 'Reliable charging and data sync for older devices and accessories.',
    price: 999,
    originalPrice: 1200,
    stock: 30,
    image: 'https://picsum.photos/seed/cable-micro/400/400',
    hoverImage: 'https://picsum.photos/seed/cable-micro-alt/400/400'
  },
  {
    id: 'p1',
    name: 'iPhone 13 OLED Replacement Screen',
    category: 'Mobile Parts',
    brand: 'Apple (Grade A)',
    description: 'Premium quality OLED panel with True Tone support. Perfect for screen repairs.',
    price: 45000,
    stock: 3,
    image: 'https://picsum.photos/seed/part-screen/400/400',
    hoverImage: 'https://picsum.photos/seed/part-screen-back/400/400'
  },
  {
    id: 'p2',
    name: 'Samsung S22 Ultra Original Battery',
    category: 'Mobile Parts',
    brand: 'Samsung',
    description: 'Original 5000mAh replacement battery for Galaxy S22 Ultra. Guaranteed longevity.',
    price: 12500,
    stock: 7,
    image: 'https://picsum.photos/seed/part-battery/400/400',
    hoverImage: 'https://picsum.photos/seed/part-battery-back/400/400'
  },
  {
    id: 'e1',
    name: 'Apple AirPods Pro (2nd Gen)',
    category: 'Earbuds',
    brand: 'Apple',
    description: 'Active Noise Cancellation, Transparency Mode.',
    price: 61999,
    originalPrice: 65000,
    stock: 8,
    image: 'https://picsum.photos/seed/airpods/400/400',
    hoverImage: 'https://picsum.photos/seed/airpods-case/400/400'
  },
  {
    id: 'a1',
    name: 'Baseus 20000mAh Power Bank',
    category: 'Accessories',
    brand: 'Baseus',
    description: '22.5W Fast Charging, Digital Display.',
    price: 7999,
    originalPrice: 8500,
    stock: 15,
    image: 'https://picsum.photos/seed/powerbank/400/400',
    hoverImage: 'https://picsum.photos/seed/powerbank-ports/400/400'
  }
];

// Added props: any to allow spreading of attributes like className
export const Icons = {
  Cart: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  User: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Search: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Logout: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  Dashboard: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Plus: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  Trash: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Edit: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  ArrowUp: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  ),
  Email: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Tag: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  Star: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ),
  StarOutline: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  Truck: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125V11.25a9 9 0 00-1.5-4.5h-4.5V14.25h1.5m-1.5 4.5H12m4.5-4.5V4.125a.375.375 0 00-.375-.375H1.875a.375.375 0 00-.375.375v13.125c0 .621.504 1.125 1.125 1.125H5.625" />
    </svg>
  ),
  Video: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  Clock: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Shield: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.956 11.956 0 0112 2.714z" />
    </svg>
  ),
  Share: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  ),
  Fire: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.99 7.99 0 0120 13a7.99 7.99 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14l2.879 2.121z" />
    </svg>
  ),
  Eye: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
};
