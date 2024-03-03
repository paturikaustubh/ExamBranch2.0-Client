import {Typography } from "@mui/material";
export default function Title({
  title,
}: {
  title: string;
}) {
  return <div className="flex justify-center mb-4 no-print">
  <Typography
    variant="h3"
    component="span"
    fontWeight="600"
    color="info.main"
  >
    {title}
  </Typography>
  </div>
}
