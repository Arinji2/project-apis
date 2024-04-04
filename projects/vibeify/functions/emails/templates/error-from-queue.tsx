import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export const ErrorFromQueue = ({ error }: { error: string }) => (
  <Html>
    <Head />
    <Preview>Your Convert Request Has Had An Error.</Preview>
    <Body style={main}>
      <Tailwind>
        <Container style={container}>
          <Section style={box}>
            <Hr style={hr} />
            <Text className="font-bold text-black text-3xl text-center">
              Your Convert Request Has Been Removed From the Queue due to an
              Error
            </Text>

            <Hr style={hr} />
            <Container
              className="w-full h-full flex flex-col items-center justify-center bg-[#812929] p-2 "
              style={brutalismBorder}
            >
              <Text
                className="text-white text-opacity-80 text-lg"
                style={paragraph}
              >
                {error ? error : "Invalid Spotify URL"}
              </Text>
            </Container>
            <Text
              className="text-black text-opacity-80 text-lg"
              style={paragraph}
            >
              Please note, this will not be counted towards your weekly limit.
              Rectify the error and feel free to send another request. Have a
              look at a few common fixes below
            </Text>
            <Container className="w-full h-full flex flex-col items-start justify-center">
              <Text className="w-full h-full text-black text-left text-base">
                1. Make sure your spotify playlist is valid and only has songs.
              </Text>
              <Text className="w-full h-full text-black text-left text-base">
                2. Make sure to stay in your limits, 200 songs and 5 playlists
                weekly for free users and 400 songs and 10 playlists weekly for
                premium users.
              </Text>
            </Container>

            <Text style={paragraph}>
              <Link style={anchor} href="mailto:help@vibeify.xyz">
                Feel free to mail us to get support.
              </Link>
              .
            </Text>
            <Text style={paragraph}>— The Vibeify team</Text>
            <Hr style={hr} />
            <Text style={footer}>
              Created by Arinji, with Love. © 2023 Vibeify. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Tailwind>
    </Body>
  </Html>
);

export default ErrorFromQueue;

const main = {
  padding: "10px",
  backgroundColor: "#43937F",

  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#D9D9D9",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  border: "4px solid black",
  boxShadow: "4px 4px 0 black",
};

const brutalismBorder = {
  border: "4px solid black",
  boxShadow: "4px 4px 0 black",
};

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "black",
  margin: "20px 0",
};

const paragraph = {
  color: "#525f7f",

  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const anchor = {
  color: "#43937F",
};

const button = {
  backgroundColor: "#656ee8",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
