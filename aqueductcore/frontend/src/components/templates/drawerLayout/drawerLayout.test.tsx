/* eslint-disable @typescript-eslint/no-empty-function */
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { render } from "@testing-library/react";
import StarIcon from "@mui/icons-material/Star";

import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import DrawerLayout, { drawerItems } from ".";

const DrawerComponent = () => {
  return (
    <AppContextAQDMock>
      <DrawerLayout>
        <Routes>
          <Route path="/" element={<div>Recents</div>} />
          <Route path="/aqd/experiments" element={<div>Recents</div>} />
          <Route path="/aqd/experiments/favourites" element={<div>Favourites</div>} />
          <Route path="/aqd/experiments/archived" element={<div>Archived</div>} />
        </Routes>
      </DrawerLayout>
    </AppContextAQDMock>
  );
};

test("Aqueduct Logo be visible in the drawer", async () => {
  const { getAllByTitle } = render(<DrawerComponent />);

  const pageLogo = getAllByTitle("aqueduct logo");
  expect(pageLogo[0]).toBeInTheDocument();
});

test("Aqueduct title be visible in the drawer", () => {
  const { getAllByText } = render(<DrawerComponent />);

  const pageTitle = getAllByText("Aqueduct");
  expect(pageTitle[0]).toBeInTheDocument();
});

test("Recent experiments are visible on clicking on recents", async () => {
  const { findAllByText, getAllByText } = render(<DrawerComponent />);

  if ("subItems" in drawerItems[0] && drawerItems[0].isGroup) {
    const subItems = drawerItems[0].subItems;
    if (subItems) {
      const recentExperimentsLink = getAllByText(subItems[0].text)[0];
      await userEvent.click(recentExperimentsLink);

      const recentExperimentsPage = await findAllByText("Recents");
      expect(recentExperimentsPage[0]).toBeInTheDocument();

      expect(subItems[0].url).toBe("/aqd/experiments");
    }
  }
});

test("Favourite experiments are visible on clicking on favourites", async () => {
  const { findAllByText, getAllByText } = render(<DrawerComponent />);

  if ("subItems" in drawerItems[0] && drawerItems[0].isGroup) {
    const subItems = drawerItems[0].subItems;
    if (subItems) {
      const favouriteExperimentsLink = getAllByText(subItems[1].text)[0];
      await userEvent.click(favouriteExperimentsLink);

      const favouriteExperimentsPage = await findAllByText("Favourites");
      expect(favouriteExperimentsPage[0]).toBeInTheDocument();

      expect(subItems[1].url).toBe("/aqd/experiments/favourites");
    }
  }
});

test("Favourite experiments are visible on clicking on favourites", async () => {
  const { findAllByText, getAllByText } = render(<DrawerComponent />);

  if ("subItems" in drawerItems[0] && drawerItems[0].isGroup) {
    const subItems = drawerItems[0].subItems;
    if (subItems) {
      const archivedExperimentsLink = getAllByText(subItems[2].text)[0];
      await userEvent.click(archivedExperimentsLink);

      const archivedExperimentsPage = await findAllByText("Favourites");
      expect(archivedExperimentsPage[0]).toBeInTheDocument();

      expect(subItems[2].url).toBe("/aqd/experiments/archived");
    }
  }
});
