import { Container } from "@mui/material";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Container maxWidth={"xl"}>{children}</Container>;
}
