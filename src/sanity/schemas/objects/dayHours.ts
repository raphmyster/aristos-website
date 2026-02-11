import { defineField, defineType } from "sanity";

export const dayHours = defineType({
  name: "dayHours",
  title: "Day Hours",
  type: "object",
  fields: [
    defineField({
      name: "day",
      title: "Day",
      type: "string",
      options: {
        list: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "openTime",
      title: "Open Time",
      type: "string",
      description: "e.g. 11:00 AM",
      hidden: ({ parent }) => parent?.isClosed,
    }),
    defineField({
      name: "closeTime",
      title: "Close Time",
      type: "string",
      description: "e.g. 10:00 PM",
      hidden: ({ parent }) => parent?.isClosed,
    }),
    defineField({
      name: "isClosed",
      title: "Closed",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      day: "day",
      openTime: "openTime",
      closeTime: "closeTime",
      isClosed: "isClosed",
    },
    prepare({ day, openTime, closeTime, isClosed }) {
      return {
        title: day,
        subtitle: isClosed ? "Closed" : `${openTime} – ${closeTime}`,
      };
    },
  },
});
