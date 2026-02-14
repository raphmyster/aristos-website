import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import type { StructureBuilder } from "sanity/structure";
import { projectId, dataset, apiVersion } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemas";

// Singleton document types that should not allow creation of new documents
const singletonTypes = new Set(["siteSettings"]);

// Custom studio structure
const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      // Site Settings — direct edit link (singleton)
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings")
        ),
      S.divider(),

      // Menu
      S.listItem()
        .title("Menu")
        .child(
          S.list()
            .title("Menu")
            .items([
              S.documentTypeListItem("menuCategory").title("Categories"),
              S.documentTypeListItem("menuItem").title("Items"),
            ])
        ),

      // Locations
      S.documentTypeListItem("location").title("Locations"),

      // Catering
      S.documentTypeListItem("cateringPackage").title("Catering Packages"),

      // Jobs
      S.documentTypeListItem("jobListing").title("Job Listings"),

      S.divider(),

      // Pages
      S.documentTypeListItem("pageContent").title("Pages"),
    ]);

export default defineConfig({
  name: "aristos",
  title: "Aristos",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    // Prevent creation of new singleton documents from the "new document" menu
    templates: (templates) =>
      templates.filter(
        ({ schemaType }) => !singletonTypes.has(schemaType)
      ),
  },
  document: {
    // For singletons, only allow publish and discard actions (no delete/duplicate)
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(
            ({ action }) =>
              action && ["publish", "discardChanges", "restore"].includes(action)
          )
        : input,
  },
});
