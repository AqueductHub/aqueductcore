import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FilterExperiments from "components/organisms/FilterExperiments";
import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import { experimentsSearchString } from "__mocks__/constants";

test("enter a value in the search field change input field", async () => {
  const { findByPlaceholderText } = render(
    <AppContextAQDMock>
      <FilterExperiments />
    </AppContextAQDMock>
  );

  const searchField = await findByPlaceholderText("Search by EID and Name");
  expect(searchField).toBeInTheDocument();

  await userEvent.type(searchField, `${experimentsSearchString}`);
  expect(searchField).toHaveValue(`${experimentsSearchString}`);
});
