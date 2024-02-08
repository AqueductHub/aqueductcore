import { findByDisplayValue, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FilterExperiments from "components/organisms/FilterExperiments";
import AppContextAQDMock from "__mocks__/AppContextAQDMock";

test("clicking on tags fields opens tag options", async () => {
  const { findByTitle, findByPlaceholderText } = render(
    <AppContextAQDMock>
      <FilterExperiments />
    </AppContextAQDMock>
  );

  const tagsButton = await findByTitle("View-tags");
  expect(tagsButton).toBeInTheDocument();

  await userEvent.click(tagsButton);

  const tagsDropdown = await findByPlaceholderText("Search tag");
  expect(tagsDropdown).toBeInTheDocument();

  const searchField = await findByPlaceholderText("Search by EID and Name");
  expect(searchField).toBeInTheDocument();

  await userEvent.click(searchField);
  expect(tagsDropdown).not.toBeInTheDocument();
});
