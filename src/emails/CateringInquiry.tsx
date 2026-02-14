import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Preview,
} from "@react-email/components";

interface CateringInquiryEmailProps {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: string;
  message?: string;
}

export default function CateringInquiryEmail({
  name,
  email,
  phone,
  eventDate,
  guestCount,
  message,
}: CateringInquiryEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Catering inquiry from {name}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>New Catering Inquiry</Heading>
          <Hr style={hrStyle} />
          <Section>
            <Text style={labelStyle}>Name</Text>
            <Text style={valueStyle}>{name}</Text>

            <Text style={labelStyle}>Email</Text>
            <Text style={valueStyle}>{email}</Text>

            <Text style={labelStyle}>Phone</Text>
            <Text style={valueStyle}>{phone}</Text>

            <Text style={labelStyle}>Event Date</Text>
            <Text style={valueStyle}>{eventDate}</Text>

            <Text style={labelStyle}>Guest Count</Text>
            <Text style={valueStyle}>{guestCount}</Text>

            {message && (
              <>
                <Text style={labelStyle}>Message</Text>
                <Text style={valueStyle}>{message}</Text>
              </>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle = {
  backgroundColor: "#FAF9F6",
  fontFamily: "'DM Sans', sans-serif",
};

const containerStyle = {
  margin: "0 auto",
  padding: "32px 24px",
  maxWidth: "560px",
};

const headingStyle = {
  fontSize: "24px",
  fontWeight: "700" as const,
  color: "#1E3A8A",
  margin: "0 0 16px",
};

const hrStyle = {
  borderColor: "#E5E2DD",
  margin: "16px 0",
};

const labelStyle = {
  fontSize: "12px",
  fontWeight: "600" as const,
  color: "#78716C",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "16px 0 4px",
};

const valueStyle = {
  fontSize: "16px",
  color: "#1C1917",
  margin: "0",
};
