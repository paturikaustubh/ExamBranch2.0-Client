import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";

export function AlertDetails() {
  return <AlertJSX />;
}

function AlertJSX() {
  const [openAlert, setOpenAlert] = useState(false);
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={3000}
      onClose={() => {}}
    >
      <Alert></Alert>
    </Snackbar>
  );
}
