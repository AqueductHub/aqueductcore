import DescriptionIcon from '@mui/icons-material/Description';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";
import ScienceIcon from "@mui/icons-material/Science";
import { Link, useLocation } from "react-router-dom";
import { PropsWithChildren, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/system";
import {
  AppBar,
  Badge,
  BadgeProps,
  Collapse,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  styled,
  useTheme,
} from "@mui/material";

import { AqueductLogo } from "components/atoms/AqueductLogo";
import { WithOptional } from "types/globalTypes";

export const drawerWidth = 264;
export const drawerTopOffset = 100;
export const mainPadding = 24;

interface GroupDrawerItem {
  alpha?: boolean;
  text: string;
  icon?: JSX.Element;
  url: string;
  openInNewTab?: boolean;
}
interface DrawerItem extends GroupDrawerItem {
  isGroup?: false;
}
interface DrawerItemWithSubitems extends WithOptional<GroupDrawerItem, "url"> {
  isGroup: true;
  subItems?: GroupDrawerItem[] | [] | null;
}

type DrawerItemsType = DrawerItem | DrawerItemWithSubitems;

export const drawerItems: DrawerItemsType[] = [
  {
    text: "Experiment Records",
    icon: <ScienceIcon />,
    isGroup: true,
    subItems: [
      { text: "Recents", url: "/aqd/experiments" },
      { text: "Favourites", url: "/aqd/experiments/favourites" },
      { text: "Archived", url: "/aqd/experiments/archived" },
    ],
  },
  { text: "Documentation", icon: <DescriptionIcon />, url: `${process.env.REACT_APP_DOCUMENTATION_LINK}`, openInNewTab: true},
  { text: "Settings", icon: <SettingsIcon />, url: "/settings" },
];

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -8,
    top: 28,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    fontSize: "0.5rem",
  },
}));

const LogoContainer = styled(Box)`
  display: flex;
  justify-content: flex-start;
  margin-top: ${(props) => props.theme.spacing(3)};
  margin-left: ${(props) => props.theme.spacing(2)};
`;

function DrawerLayout(props: PropsWithChildren) {
  const location = useLocation();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  const drawer = (
    <div>
      {/****** Logo *******/}
      <LogoContainer>
        <AqueductLogo theme={theme.palette.mode} />
      </LogoContainer>
      {/****** List *******/}
      <List>
        {drawerItems.map((item) =>
          item.isGroup && item.subItems?.length ? (
            <Box key={item.text}>
              <ListItemButton
                onClick={handleClick}
                key={item.text}
                sx={{
                  minHeight: 48,
                  justifyContent: "initial",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 3,
                    marginRight: 1.75,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <Link
                      to={subItem.url ?? ""}
                      key={subItem.text}
                      style={{
                        textDecoration: "none",
                        color: theme.palette.text.primary,
                      }}
                    >
                      <ListItemButton sx={{ pl: 4 }} selected={location.pathname === subItem.url}>
                        {subItem.icon && (
                          <ListItemIcon>
                            {item.alpha ? (
                              <StyledBadge badgeContent="alpha" color="secondary">
                                {subItem.icon}
                              </StyledBadge>
                            ) : (
                              subItem.icon
                            )}
                          </ListItemIcon>
                        )}
                        <ListItemText
                          primary={subItem.text}
                          sx={{
                            marginLeft: 4,
                          }}
                        />
                      </ListItemButton>
                    </Link>
                  ))}
                </List>
              </Collapse>
            </Box>
          ) : (
            <ListItem disablePadding sx={{ display: "block" }} key={item.text}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: "initial",
                  px: 2.5,
                }}
                selected={location.pathname === item.url}
                to={item.url ?? ""}
                target={item.openInNewTab ? "_blank" : ""}
                component={Link}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 3,
                    marginRight: 1.75,
                    justifyContent: "center",
                  }}
                >
                  {item.alpha ? (
                    <StyledBadge badgeContent="alpha" color="secondary">
                      {item.icon}
                    </StyledBadge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText primary={item.text} />
                {item.openInNewTab && <ListItemIcon
                  sx={{
                    mr: -4.5,
                    alignItems: "flex-end"
                  }}
                >
                  <OpenInNewIcon sx={{fontSize: '1rem'}} />
                </ListItemIcon>}
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </div>
  );

  return (
    <Grid container justifyContent="flex-end">
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar sx={{ display: { sm: "none" } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
            <Typography variant="h6" noWrap component="div" sx={{ ml: 2 }}>
              Aqueduct
            </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: mainPadding / 8, // because of base pixel unit of MUI
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: `${drawerTopOffset}px`,
        }}
      >
        {props.children}
      </Box>
    </Grid>
  );
}
export default DrawerLayout;
