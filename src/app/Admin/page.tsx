import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

import React from "react";

function Admin() {
  return (
    <div className="">
      <Topbar />
      <div className="p-3">Admin</div>
    </div>
  );
}

const Topbar = () => {
  return (
    <div className="w-full py-[14px] px-4 flex justify-between items-center border-b border-[#202020]">
      <h4 className="text-md font-semibold">Model Search</h4>

      <div className="flex items-center gap-3 ">
        <Menubar className="border-none w-[150px] p-0">
          <MenubarMenu>
            <MenubarTrigger className="text-sm w-full justify-between py-3.5 px-2.5">
              ChatGPT 4o
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="white"
                className="h-4 w-4   "
              >
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
              </svg>
            </MenubarTrigger>
            {/* <MenubarContent className="border-none w-[250px]">
              <MenubarItem>Model one</MenubarItem>
              <MenubarItem>Model two</MenubarItem>
            </MenubarContent> */}
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
};

export default Admin;
