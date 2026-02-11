import { groq } from "next-sanity";

// ── Site Settings ──
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    name,
    tagline,
    logo,
    phone,
    email,
    socialLinks,
    heroImage,
    heroHeadline,
    heroSubheadline,
    primaryCtaText,
    primaryCtaLink,
    secondaryCtaText,
    secondaryCtaLink,
    menuSectionHeading,
    locationSectionHeading,
    orderButtonText,
    viewMenuText,
    announcementEnabled,
    announcementText,
    announcementLink,
    announcementStyle,
    deliveryApps,
    enableCatering,
    enableCareers,
    enableAllergens,
    seoTitle,
    seoDescription,
    seoImage
  }
`;

// ── Menu ──
export const menuCategoriesQuery = groq`
  *[_type == "menuCategory"] | order(sortOrder asc){
    _id,
    name,
    slug,
    description
  }
`;

export const menuItemsQuery = groq`
  *[_type == "menuItem" && isAvailable == true] | order(category->sortOrder asc, name asc){
    _id,
    name,
    slug,
    description,
    price,
    photo,
    category->{_id, name, slug},
    dietaryTags,
    allergens,
    isFeatured
  }
`;

export const featuredMenuItemsQuery = groq`
  *[_type == "menuItem" && isFeatured == true && isAvailable == true][0...4]{
    _id,
    name,
    slug,
    description,
    price,
    photo,
    category->{_id, name, slug},
    dietaryTags
  }
`;

export const menuItemsByCategoryQuery = groq`
  *[_type == "menuItem" && isAvailable == true && category->slug.current == $slug] | order(name asc){
    _id,
    name,
    slug,
    description,
    price,
    photo,
    category->{_id, name, slug},
    dietaryTags,
    allergens
  }
`;

// ── Locations ──
export const locationsQuery = groq`
  *[_type == "location"] | order(sortOrder asc){
    _id,
    name,
    address,
    phone,
    googleMapsEmbed,
    googleMapsLink,
    hours,
    isPrimary
  }
`;

export const primaryLocationQuery = groq`
  *[_type == "location" && isPrimary == true][0]{
    _id,
    name,
    address,
    phone,
    googleMapsEmbed,
    googleMapsLink,
    hours
  }
`;

// ── Catering ──
export const cateringPackagesQuery = groq`
  *[_type == "cateringPackage"] | order(sortOrder asc){
    _id,
    name,
    description,
    priceRange,
    image
  }
`;

// ── Jobs ──
export const jobListingsQuery = groq`
  *[_type == "jobListing" && isActive == true] | order(postedDate desc){
    _id,
    title,
    description,
    location,
    type,
    applyUrl,
    applyEmail,
    postedDate
  }
`;

// ── Pages ──
export const pageContentQuery = groq`
  *[_type == "pageContent" && slug.current == $slug][0]{
    title,
    slug,
    body
  }
`;

// ── Allergens (menu items with allergens) ──
export const menuItemsWithAllergensQuery = groq`
  *[_type == "menuItem" && isAvailable == true && defined(allergens) && length(allergens) > 0] | order(category->sortOrder asc, name asc){
    _id,
    name,
    category->{name},
    allergens,
    dietaryTags
  }
`;
