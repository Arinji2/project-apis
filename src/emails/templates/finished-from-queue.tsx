import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";
export type LinkProps = {
  name: string;
  url: string;
};
export const FinishedFromQueue = ({
  links,
  isPrem,
  uses,
}: {
  links: LinkProps[];
  isPrem: boolean;
  uses: number;
}) => (
  <Html>
    <Head />
    <Preview>Your Convert Request Has Been Completed Successfully.</Preview>
    <Body style={main}>
      <Tailwind>
        <Container style={container}>
          <Section style={box}>
            <Hr style={hr} />
            <Text className="font-bold text-black text-3xl text-center">
              Your Convert Request Has Been Completed Successfully.
            </Text>

            <Hr style={hr} />
            <Text
              className="text-black text-opacity-80 text-lg"
              style={paragraph}
            >
              Your playlists have been converted and are ready to be viewed.
              Please find the links listed below
            </Text>

            <Container className="w-full h-full flex flex-col items-start justify-center">
              {links ? (
                links.map((link, i) => (
                  <Text
                    className="w-full h-full text-black text-left text-base"
                    key={i}
                  >
                    <Link style={anchor} href={link.url}>
                      {i + 1}. {link.name}
                    </Link>
                  </Text>
                ))
              ) : (
                <></>
              )}
            </Container>
            <Container
              className="w-full h-full flex flex-col items-start justify-center bg-[#812929] p-2 "
              style={brutalismBorder}
            >
              <Text className="text-[#D9D9D9]" style={paragraph}>
                {isPrem
                  ? `Please note, your playlists will be removed from our spotify account in 50 hours. If you wish to keep them, please save them to your account.`
                  : `Please note, your playlists will be removed from our spotify account in 24 hours. If you wish to keep them, please save them to your account.`}
              </Text>
            </Container>

            <Container
              className="w-full h-full flex flex-col items-start justify-center bg-[#812929] p-2 mt-3"
              style={brutalismBorder}
            >
              <Text className="text-[#D9D9D9]" style={paragraph}>
                Please note, you have used {uses + 1} out of your{" "}
                {isPrem ? 10 : 5} Weekly Converts.
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

export default FinishedFromQueue;

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
