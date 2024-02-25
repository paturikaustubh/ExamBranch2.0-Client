import { useState } from "react";
import { useLocation } from "react-router-dom";

import {
  ArticleOutlined,
  DriveFileRenameOutlineOutlined,
  Menu,
  PlagiarismOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Divider, Drawer, List, Typography } from "@mui/material";

export default function Navbar({ user }: { user: string }) {
  // ANCHOR STATES && VARS  ||========================================================================

  const { pathname } = useLocation();
  const pageLocation = pathname.split("/").filter((path) => path !== "")[0];

  const [openSideMenu, setOpenSideMenu] = useState(false);
  const navLinks = [
    {
      name: "CBT",
      icon: <DriveFileRenameOutlineOutlined />,
    },
    {
      name: "Revaluation",
      icon: <ArticleOutlined />,
    },
    {
      name: "Supplementary",
      icon: <PlagiarismOutlined />,
    },
  ];

  return (
    <nav
      className="sticky top-0 w-full text-white px-5 py-4"
      style={{
        backgroundColor: "rgba(0 0 0 / 0.8)",
        backdropFilter: "blur(3px)",
      }}
    >
      <div className="flex justify-start items-center gap-2">
        <button
          onClick={() => setOpenSideMenu(true)}
          className={`rounded-full ${
            user === "admin" ? "inlin-block" : "hidden"
          }`}
        >
          <Menu fontSize="medium" />
        </button>
        {navLinks.map(({ name, icon }, indx) => {
          const activePage = name.toLowerCase().split(" ").join("-");

          return (
            <Link
              key={indx}
              to={activePage}
              className={`flex items-center gap-2 rounded-sm px-4 py-2 hover:bg-[rgba(92,92,255,0.1)] duration-300 ${
                activePage === pageLocation ? "text-blue-500" : ""
              }`}
            >
              {icon}
              {name}
            </Link>
          );
        })}
      </div>
      <SideMenu
        user={user}
        openSideMenu={openSideMenu}
        setOpenSideMenu={setOpenSideMenu}
      />
    </nav>
  );
}

function SideMenu({
  openSideMenu,
  setOpenSideMenu,
  user,
}: {
  openSideMenu: boolean;
  setOpenSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
  user: string;
}) {
  return (
    <Drawer
      anchor="left"
      open={openSideMenu}
      onClose={() => setOpenSideMenu(false)}
      sx={{
        backdropFilter: "blur(3px)",
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          minWidth: 300,
        },
      }}
    >
      <List
        sx={{
          display: { xs: "flex", md: "none" },
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" p={2} fontWeight={"bold"}>
          Pages
        </Typography>
        <Divider />
      </List>
      <List sx={{ ...(user !== "admin" && { display: "none" }) }}>
        <Typography variant="h6" p={2} fontWeight={"bold"}>
          Misc
        </Typography>

        <Divider />
      </List>
    </Drawer>
  );
}
