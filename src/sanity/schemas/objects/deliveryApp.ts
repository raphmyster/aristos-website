import { defineField, defineType } from "sanity";

export const deliveryApp = defineType({
  name: "deliveryApp",
  title: "Delivery App",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "e.g. Uber Eats, DoorDash, Grubhub",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Order URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "url", media: "logo" },
  },
});
