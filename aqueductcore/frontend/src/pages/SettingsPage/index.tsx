import React, { ReactNode, useState } from "react";
import { Grid, styled } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import ColorMode from "components/molecules/ColorMode";

export type settingItemType = {
  id: string
  title: string
  component: ReactNode
}

export const settingItems: settingItemType[] = [
  {
    id: 'Appearance',
    title: "Appearance",
    component: <ColorMode />
  }
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Container = styled("div")`
  border-radius: 5px;
`;

export function tabPanelMaker(settingItems: settingItemType[]) {
  const [value, setValue] = useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "90%", margin: "0 auto" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs variant="fullWidth" value={value} onChange={handleChangeTab}>
          {settingItems.map((item) => (
            <Tab
              key={item.title}
              label={item.title}
            />
          ))}
        </Tabs>
      </Box>
      <Container>
        {settingItems.map((item, index) => (
          <TabPanel value={value} index={index} key={item.id}>
            <Grid
              container
              justifyContent="center"
              direction="column"
              sx={{ boxShadow: 1, borderRadius: "4px", backgroundColor: "background.paper", mb: 2 }}
            >
              <Grid item sx={{ minHeight: "60vh", position: "relative" }}>
                {item.component}
              </Grid>
            </Grid>
          </TabPanel>
        ))}
      </Container>
    </Box>
  );
}

function SettingsPage() {
  return tabPanelMaker(settingItems)
}

export default SettingsPage;
