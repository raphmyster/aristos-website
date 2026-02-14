import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import { siteSettingsQuery, jobListingsQuery } from "@/sanity/lib/queries";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import JobCard from "@/components/careers/JobCard";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the Aristos team. View current job openings.",
};

export default async function CareersPage() {
  const [settings, jobs] = await Promise.all([
    sanityFetch<any>({ query: siteSettingsQuery, tags: ["siteSettings"] }),
    sanityFetch<any[]>({ query: jobListingsQuery, tags: ["jobListing"] }),
  ]);

  if (!settings?.enableCareers) {
    notFound();
  }

  return (
    <section className="py-12 md:py-16">
      <Container>
        <SectionHeading as="h1" className="mb-8">
          Careers
        </SectionHeading>

        {jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 max-w-3xl">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                title={job.title}
                description={job.description}
                location={job.location}
                type={job.type}
                applyUrl={job.applyUrl}
                applyEmail={job.applyEmail}
                postedDate={job.postedDate}
              />
            ))}
          </div>
        ) : (
          <p className="text-secondary text-center py-12">
            No open positions right now. Check back soon.
          </p>
        )}
      </Container>
    </section>
  );
}
