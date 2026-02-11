import { defineField, defineType } from "sanity";

export const jobListing = defineType({
  name: "jobListing",
  title: "Job Listing",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g. Downtown, All Locations",
    }),
    defineField({
      name: "type",
      title: "Employment Type",
      type: "string",
      options: {
        list: [
          { title: "Full-Time", value: "full-time" },
          { title: "Part-Time", value: "part-time" },
          { title: "Seasonal", value: "seasonal" },
        ],
      },
    }),
    defineField({
      name: "applyUrl",
      title: "Apply URL",
      type: "url",
      description: "External application link",
    }),
    defineField({
      name: "applyEmail",
      title: "Apply Email",
      type: "string",
      description: "Email for applications (used if no URL)",
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "postedDate",
      title: "Posted Date",
      type: "date",
    }),
  ],
  preview: {
    select: {
      title: "title",
      type: "type",
      isActive: "isActive",
    },
    prepare({ title, type, isActive }) {
      return {
        title,
        subtitle: `${type ?? ""}${isActive ? "" : " (Inactive)"}`,
      };
    },
  },
});
