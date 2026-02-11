import type { SchemaTypeDefinition } from "sanity";

// Objects
import { dayHours } from "./objects/dayHours";
import { socialLink } from "./objects/socialLink";
import { deliveryApp } from "./objects/deliveryApp";

// Documents
import { siteSettings } from "./documents/siteSettings";
import { menuCategory } from "./documents/menuCategory";
import { menuItem } from "./documents/menuItem";
import { location } from "./documents/location";
import { cateringPackage } from "./documents/cateringPackage";
import { jobListing } from "./documents/jobListing";
import { pageContent } from "./documents/pageContent";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  dayHours,
  socialLink,
  deliveryApp,
  // Documents
  siteSettings,
  menuCategory,
  menuItem,
  location,
  cateringPackage,
  jobListing,
  pageContent,
];
