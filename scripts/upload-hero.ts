/**
 * Upload hero image to Sanity and set it on siteSettings.
 * Run: npx tsx scripts/upload-hero.ts <path-to-image>
 */

import { createClient } from "@sanity/client";
import { createReadStream } from "fs";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const imagePath = process.argv[2];
if (!imagePath) {
  console.error("Usage: npx tsx scripts/upload-hero.ts <path-to-image>");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

async function run() {
  console.log(`Uploading ${imagePath}...`);

  const asset = await client.assets.upload("image", createReadStream(imagePath), {
    filename: "hero-image.png",
  });

  console.log(`  ✓ Uploaded as ${asset._id}`);

  await client
    .patch("siteSettings")
    .set({
      heroImage: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
    })
    .commit();

  console.log("  ✓ Set as hero image on siteSettings");
}

run().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
