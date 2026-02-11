export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* AnnouncementBar + Navbar will go here */}
      <main>{children}</main>
      {/* Footer will go here */}
    </>
  );
}
