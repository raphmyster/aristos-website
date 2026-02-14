import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

const TAG_MAP: Record<string, string[]> = {
  siteSettings: ["siteSettings"],
  menuItem: ["menuItem"],
  menuCategory: ["menuCategory"],
  location: ["location"],
  cateringPackage: ["cateringPackage"],
  jobListing: ["jobListing"],
  pageContent: ["pageContent"],
};

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{
      _type: string;
    }>(req, process.env.SANITY_REVALIDATE_SECRET);

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 },
      );
    }

    if (!body?._type) {
      return NextResponse.json(
        { message: "Bad request" },
        { status: 400 },
      );
    }

    const tags = TAG_MAP[body._type];

    if (!tags) {
      return NextResponse.json({
        message: `No tags mapped for type "${body._type}"`,
        revalidated: false,
      });
    }

    for (const tag of tags) {
      revalidateTag(tag, "max");
    }

    return NextResponse.json({
      revalidated: true,
      tags,
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
