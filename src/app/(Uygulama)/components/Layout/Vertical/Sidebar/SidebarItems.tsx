import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "@/store/hooks";
import NavItem from "./NavItem";
import NavCollapse from "./NavCollapse";
import NavGroup from "./NavGroup/NavGroup";
import { AppState } from "@/store/store";
import { toggleMobileSidebar } from "@/store/customizer/CustomizerSlice";
import { MenuitemsType } from "@/app/(Uygulama)/components/Layout/Vertical/Sidebar/MenuItems";
import { createMenuItems } from "@/app/(Uygulama)/components/Layout/Vertical/Sidebar/MenuItems";

const SidebarItems = () => {
  const pathname = usePathname();
  const pathDirect = pathname.split("/").slice(0, 2).join("/");
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf("/"));
  const user = useSelector((state: AppState) => state.userReducer);
  const customizer = useSelector((state: AppState) => state.customizer);

  const Menuitems: MenuitemsType[] = createMenuItems(user.denetimTuru || "");

  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
  const hideMenu: any = lgUp
    ? customizer.isCollapse && !customizer.isSidebarHover
    : "";
  const dispatch = useDispatch();
  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {Menuitems.map((item) => {
          // {/********SubHeader**********/}
          if (item.subheader) {
            return (
              <NavGroup item={item} hideMenu={hideMenu} key={item.subheader} />
            );

            // {/********If Sub Menu**********/}
            /* eslint no-else-return: "off" */
          } /*else if (item.children) {
            return (
              <NavCollapse
                menu={item}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                pathWithoutLastPart={pathWithoutLastPart}
                level={1}
                key={item.id}
                onClick={() => dispatch(toggleMobileSidebar())}
              />
            );*/

          // {/********If Sub No Menu**********/}
          // } else {
          return (
            <NavItem
              item={item}
              key={item.id}
              pathDirect={pathDirect}
              hideMenu={hideMenu}
              onClick={() => dispatch(toggleMobileSidebar())}
            />
          );
          //}
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
