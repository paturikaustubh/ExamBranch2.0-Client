import { ReactNode } from "react";
import { RevalParams } from "../../misc/Helper Details/Revaluation/Parameters";
import { RevalProcedure } from "../../misc/Helper Details/Revaluation/Procedure";
import { RevalOverview } from "../../misc/Helper Details/Revaluation/Overview";
import { RevalExceptions } from "../../misc/Helper Details/Revaluation/Exceptions";
import { SuppleOverview } from "../../misc/Helper Details/Supplementary/Overview";
import { SuppleParams } from "../../misc/Helper Details/Supplementary/Parameters";

export const HelperContents: {
  [key in Pages]: {
    overview: ReactNode;
    parameters: ReactNode;
    procedure: ReactNode;
    exceptions?: ReactNode;
  };
} = {
  revaluation: {
    overview: <RevalOverview />,
    parameters: <RevalParams />,
    procedure: <RevalProcedure />,
    exceptions: <RevalExceptions />,
  },
  supplementary: {
    overview: <SuppleOverview />,
    parameters: <SuppleParams />,
    procedure: "Nee ishtam bro",
  },
  "written-test": {
    overview: "This is just an overview lol",
    parameters: "Em le bro...",
    procedure: "Nee ishtam bro",
  },
  upload: {
    overview: "This is just an overview lol",
    parameters: "Em le bro...",
    procedure: "Nee ishtam bro",
  },
  download: {
    overview: "This is just an overview lol",
    parameters: "Em le bro...",
    procedure: "Nee ishtam bro",
  },
  "backup-and-restore": {
    overview: "This is just an overview lol",
    parameters: "Em le bro...",
    procedure: "Nee ishtam bro",
  },
  "manage-costs": {
    overview: "This is just an overview lol",
    parameters: "Em le bro...",
    procedure: "Nee ishtam bro",
  },
  "manage-database": {
    overview: "This is just an overview lol",
    parameters: "Em le bro...",
    procedure: "Nee ishtam bro",
  },
  "manage-users": {
    overview: "This is just an overview lol",
    parameters: "Em le bro...",
    procedure: "Nee ishtam bro",
  },
  test: {
    overview: "This is just an overview lol",
    parameters: "Em le bro...",
    procedure: "Nee ishtam bro",
  },
};
