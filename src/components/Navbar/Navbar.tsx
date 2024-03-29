import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  ArticleOutlined,
  BackupOutlined,
  CurrencyRupeeOutlined,
  DriveFileRenameOutlineOutlined,
  FileDownloadOutlined,
  FileUploadOutlined,
  Menu,
  PeopleAltOutlined,
  PlagiarismOutlined,
  StorageOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  Tooltip,
  Typography,
} from "@mui/material";
import { CustDialog } from "../Custom/CustDialog";

export default function Navbar({
  user,
  setGoAhead,
}: {
  user: string;
  setGoAhead: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // ANCHOR STATES && VARS  ||========================================================================
  const { pathname } = useLocation();
  const pageLocation = pathname.split("/").filter((path) => path !== "")[0];

  const [openSideMenu, setOpenSideMenu] = useState(false);

  const adminNavLinks: NavLinkProps[] = [
    { name: "Written Test", icon: <DriveFileRenameOutlineOutlined /> },
    { name: "Revaluation", icon: <PlagiarismOutlined /> },
    { name: "Supplementary", icon: <ArticleOutlined /> },
    { name: "Download", icon: <FileDownloadOutlined /> },
    { name: "Upload", icon: <FileUploadOutlined /> },
  ];

  const nonAdminNavLinks: NavLinkProps[] = [
    { name: "Written Test", icon: <DriveFileRenameOutlineOutlined /> },
    { name: "Revaluation", icon: <PlagiarismOutlined /> },
    { name: "Supplementary", icon: <ArticleOutlined /> },
    { name: "Manage Database", icon: <StorageOutlined /> },
    { name: "Manage Users", icon: <PeopleAltOutlined /> },
  ];

  const miscLinks: NavLinkProps[] = [
    {
      name: "Backup and Restore",
      icon: <BackupOutlined />,
    },
    { name: "Manage Costs", icon: <CurrencyRupeeOutlined /> },
    { name: "Manage Database", icon: <StorageOutlined /> },
    { name: "Manage Users", icon: <PeopleAltOutlined /> },
  ];

  // ANCHOR EFFECTS  ||========================================================================
  useEffect(() => {
    sessionStorage.setItem("lastPage", pageLocation);
    document.title = pageLocation
      ? pageLocation
          .split("/")
          .filter((path) => path !== "")[0]
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "Exam Branch Portal";
  }, [pathname]);

  return (
    <>
      <nav
        className="sticky flex items-center justify-between top-0 w-full text-white px-5 py-3 z-50 no-print"
        style={{
          backgroundColor: "rgba(0 0 0 / 0.8)",
          backdropFilter: "blur(3px)",
        }}
      >
        <div className="flex justify-start items-center gap-4">
          <button
            onClick={() => setOpenSideMenu(true)}
            className={`rounded-full ${
              user === "admin" ? "inlin-block" : "lg:hidden inline-block"
            }`}
          >
            <Menu fontSize="medium" />
          </button>
          {user === "admin"
            ? adminNavLinks.map(({ name, icon }, indx) => {
                const activePage = name.toLowerCase().split(" ").join("-");

                return (
                  <Link
                    key={indx}
                    to={activePage}
                    className={`nav-link relative ${
                      activePage === pageLocation ? "active" : ""
                    } lg:flex hidden items-center gap-2 rounded-t-sm px-3 py-2 hover:bg-zinc-800 duration-300`}
                  >
                    {icon}
                    {name}
                  </Link>
                );
              })
            : nonAdminNavLinks.map(({ name, icon }, indx) => {
                const activePage = name.toLowerCase().split(" ").join("-");

                return (
                  <Link
                    key={indx}
                    to={activePage}
                    className={`nav-link relative ${
                      activePage === pageLocation ? "active" : ""
                    } lg:flex hidden items-center gap-2 rounded-t-sm px-3 py-2 hover:bg-zinc-800 duration-300`}
                  >
                    {icon}
                    {name}
                  </Link>
                );
              })}
        </div>
        <Logout setGoAhead={setGoAhead} />
      </nav>
      <SideMenu
        user={user}
        openSideMenu={openSideMenu}
        setOpenSideMenu={setOpenSideMenu}
        adminNavLinks={adminNavLinks}
        nonAdminNavLinks={nonAdminNavLinks}
        miscLinks={miscLinks}
        pageLocation={pageLocation}
      />
    </>
  );
}

// ANCHOR SIDE MENU DRAWER  ||========================================================================
function SideMenu({
  openSideMenu,
  setOpenSideMenu,
  user,
  adminNavLinks,
  nonAdminNavLinks,
  miscLinks,
  pageLocation,
}: {
  openSideMenu: boolean;
  setOpenSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
  user: string;
  adminNavLinks: NavLinkProps[];
  nonAdminNavLinks: NavLinkProps[];
  miscLinks: NavLinkProps[];
  pageLocation: string;
}) {
  // ANCHOR FUNCTIONS  ||========================================================================
  const handleLinkClick = () => {
    setOpenSideMenu(false);
  };

  // ANCHOR JSX  ||========================================================================
  return (
    <Drawer
      anchor="left"
      open={openSideMenu}
      onClose={() => setOpenSideMenu(false)}
      sx={{
        backdropFilter: "blur(2px)",
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          minWidth: 300,
        },
      }}
    >
      <div className="flex flex-col lg:hidden text-black gap-y-2">
        <Typography variant="h6" p={2} fontWeight={"bold"}>
          Pages
        </Typography>
        <Divider />
        {user === "admin"
          ? adminNavLinks.map(({ name, icon }, indx) => {
              const activePage = name.toLowerCase().split(" ").join("-");

              return (
                <Link
                  key={indx}
                  to={activePage}
                  className={`flex items-center gap-2 rounded-sm p-4 hover:bg-zinc-300 duration-300 ${
                    activePage === pageLocation ? "text-blue-500" : ""
                  }`}
                  onClick={handleLinkClick}
                >
                  {icon}
                  {name}
                </Link>
              );
            })
          : nonAdminNavLinks.map(({ name, icon }, indx) => {
              const activePage = name.toLowerCase().split(" ").join("-");

              return (
                <Link
                  key={indx}
                  to={activePage}
                  className={`flex items-center gap-2 rounded-sm p-4 hover:bg-zinc-300 duration-300 ${
                    activePage === pageLocation ? "text-blue-500" : ""
                  }`}
                  onClick={handleLinkClick}
                >
                  {icon}
                  {name}
                </Link>
              );
            })}
      </div>

      <div
        className={`${user === "admin" ? "flex flex-col gap-y-2" : "hidden"}`}
      >
        <Typography variant="h6" p={2} fontWeight={"bold"}>
          Misc
        </Typography>
        <Divider />
        {miscLinks.map(({ name, icon }, indx) => {
          const activePage = name.toLowerCase().split(" ").join("-");

          return (
            <Link
              key={indx}
              to={activePage}
              className={`flex items-center gap-2 rounded-sm p-4 hover:bg-zinc-300 duration-300 ${
                activePage === pageLocation ? "text-blue-500" : ""
              }`}
              onClick={handleLinkClick}
            >
              {icon}
              {name}
            </Link>
          );
        })}
      </div>
    </Drawer>
  );
}

// ANCHOR LOGOUT DIALOG  ||========================================================================
function Logout({
  setGoAhead,
}: {
  setGoAhead: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tooltip title={sessionStorage.getItem("displayName")}>
        <button
          className="text-lg font-semibold tracking-wider bg-zinc-300 text-black flex justify-center items-center rounded-full size-10"
          onClick={() => setOpen(true)}
        >
          {(sessionStorage.getItem("displayName") as string)
            ?.split(" ")
            .map((word) => word[0].toUpperCase())
            .join("")}
        </button>
      </Tooltip>
      <CustDialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{ backdropFilter: "blur(2px)" }}
      >
        <DialogTitle component={"div"}>
          <Typography variant="h4" color={"error.main"} fontWeight={600}>
            Logout
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout from{" "}
            <Typography
              variant="h5"
              color={"primary.main"}
              fontWeight={500}
              component="span"
            >
              {sessionStorage.getItem("username")}
            </Typography>
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button className="red-button-sm" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button
            className="blue-button-sm"
            onClick={() => {
              sessionStorage.clear();
              setGoAhead(false);
            }}
          >
            Logout
          </button>
        </DialogActions>
      </CustDialog>
    </>
  );
}
