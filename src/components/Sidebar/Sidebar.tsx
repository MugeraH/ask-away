"use client";
import React from "react";
import { ChevronsRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { SidebarItems } from "./sidebar-items";
// import { NextRouter, useRouter } from "next/router";
import Link from "next/link";
const TitleSection = ({ open }: { open: boolean }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mb-3 border-b border-[#202020] pb-3 px-2"
    >
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors ">
        <div className="flex items-center gap-2">
          <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.span
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="block text-sm font-semibold text-white"
              >
                AskAway
              </motion.span>
              <motion.span
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="block text-xs text-slate-500 "
              >
                Pro plan
              </motion.span>
            </motion.div>
          )}
        </div>

        {open && <Sparkles color="#fff" size={15} className="mr-2" />}
      </div>
    </motion.div>
  );
};

const Logo = () => {
  return (
    <motion.div
      layout
      className="grid size-10 shrink-0 place-content-center rounded-md shadow-lg"
    >
      <svg
        id="logo-35"
        width="24"
        height="auto"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
          className="ccompli1"
          fill="#007AFF"
        ></path>{" "}
        <path
          d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
          className="ccustom"
          fill="#312ECB"
        ></path>{" "}
      </svg>
    </motion.div>
  );
};

const MotionLink = motion(Link);
const NavOption = ({
  Icon,
  route,
  selected,
  setSelected,
  open,
  notifs,
}: // router,
{
  Icon: React.JSX.Element;
  route: string;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  open: boolean;
  notifs?: number;
  // router: NextRouter;
}) => {
  return (
    <MotionLink
      href={route === "Dashboard" ? "/" : route}
      layout
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
        selected === route ? "bg-[#181818] text-white" : "  text-slate-500 "
      }`}
      onClick={() => {
        setSelected(route);
      }}
    >
      <div className="grid size-10 shrink-0 place-content-center ">{Icon}</div>

      {open && (
        <motion.span
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs font-medium"
        >
          {route}
        </motion.span>
      )}

      {notifs && open && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ y: "-50%" }}
          transition={{ delay: 0.5 }}
          className="absolute right-2 top-1/2 size-4 rounded bg-[#2b2b2b] text-[10px] text-white text-center"
        >
          {notifs}
        </motion.span>
      )}
    </MotionLink>
  );
};

const ToggleClose = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t border-[#202020] transition-colors px-2"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          <ChevronsRight
            color="#fff"
            size={20}
            className={`transition-transform delay-75 ${open && "rotate-180"}`}
          />
        </motion.div>
      </div>
    </motion.button>
  );
};

function Sidebar() {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState("Dashboard");
  const sidebaridth = "240px";

  // auto close sidebar on small screen
  // React.useEffect(() => {}, []);

  return (
    <motion.nav
      layout
      className="sticky top-0 min-h-screen shrink-0 border-r border-[#202020] text-white  py-4 z-100"
      animate={{ opacity: 1, width: open ? sidebaridth : "57px" }}
      initial={{ opacity: 0 }}
      transition={{ delay: 0.1 }}
    >
      <TitleSection open={open} />
      <div className="space-y-1 px-2">
        {SidebarItems.map((navitem) => (
          <NavOption
            key={navitem.route}
            Icon={navitem.icon}
            route={navitem.route}
            selected={selected}
            setSelected={setSelected}
            open={open}
            notifs={navitem.notifs}
          />
        ))}
      </div>
      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
}

export default Sidebar;
