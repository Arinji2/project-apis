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

export const AddedToQueue = ({ isPrem }: { isPrem: boolean }) => (
  <Html>
    <Head />
    <Preview>Your Convert Request Has Been Added to the Queue.</Preview>
    <Body style={main}>
      <Tailwind>
        <Container style={container}>
          <Section style={box}>
            <Hr style={hr} />
            <Text className="font-bold text-black text-3xl text-center">
              Your Convert Request Has Been Added to the Queue.
            </Text>

            <Hr style={hr} />
            <Text
              className="text-black text-opacity-80 text-lg"
              style={paragraph}
            >
              We will require a few hours to process your request. Once your
              playlists have been converted, you will be sent a mail with
              further instructions.
            </Text>
            <Text
              className="text-black text-opacity-80 text-lg"
              style={paragraph}
            >
              While you wait, try out our other products.
            </Text>
            <Container className="w-full h-full flex flex-col items-start justify-center">
              <Text className="w-full h-full text-black text-left text-base">
                1. Compare Playlists
              </Text>
              <Text className="w-full h-full text-black text-left text-base">
                2. Showcase Playlists
              </Text>
            </Container>
            <Container
              className="w-full h-full flex flex-col items-start justify-center bg-[#812929] p-2 "
              style={brutalismBorder}
            >
              <Text className="text-[#D9D9D9]" style={paragraph}>
                {isPrem
                  ? `Please note, on your task being completed, 1 of your 10 paid convert requests per week will be used. We thankyou for supporting us and are happy to increase your limit if needed by just sending us a mail.`
                  : `Please note, on your task being completed, 1 of your 5
                free convert requests per week will be used. Consider donating
                to become a paid member and get 10 convert requests per week
                with 400 songs.`}
              </Text>
            </Container>
            <Text style={paragraph}>
              <Link style={anchor} href="mailto:help@vibeify.xyz">
                Feel free to mail us to get support.
              </Link>
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

export default AddedToQueue;

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
