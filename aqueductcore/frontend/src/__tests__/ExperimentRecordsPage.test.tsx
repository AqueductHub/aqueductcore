import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ExperimentRecordsColumns } from "pages/ExperimentRecordsPage";
import ExperimentRecordsPage from "pages/ExperimentRecordsPage";
import { filterByThisTitle } from "__mocks__/queries/getAllExperimentsWithNameFilterMock";
import { filterByThisTag } from "__mocks__/queries/getAllExperimentsWithTagFilterMock";
import { ExperimentDataMock } from "__mocks__/ExperimentDataMock";
import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import { ARCHIVED, experimentRecordsRowsPerPageOptions } from "constants/constants";

// Experiment table
test("render page with no error", () => {
  render(
    <AppContextAQDMock>
      <ExperimentRecordsPage category="all" />
    </AppContextAQDMock>
  );
});

test("render experiment table columns", async () => {
  const { findByText } = render(
    <AppContextAQDMock>
      <ExperimentRecordsPage category="all" />
    </AppContextAQDMock>
  );
  // All column names should exist
  for (const item of ExperimentRecordsColumns) {
    if (item.label.length) {
      // some columns like star doesn't have a name
      const ColumnName = await findByText(item.label);
      expect(ColumnName).toBeInTheDocument();
    }
  }
});

test("render experiment table data", async () => {
  const { findByText, findAllByText } = render(
    <AppContextAQDMock>
      <ExperimentRecordsPage category="all" />
    </AppContextAQDMock>
  );
  // Render table with data in it, except TAGs and Date created
  for (const item of ExperimentDataMock.filter((item) => !item.tags.includes(ARCHIVED)).slice(
    0,
    1
  )) {
    const dataEID = await findByText(item.alias);
    expect(dataEID).toBeInTheDocument();

    const dataTitle = await findAllByText(item.title);
    expect(dataTitle[0]).toBeInTheDocument();

    const dataDescription = await findAllByText(item.description ?? "");
    expect(dataDescription[0]).toBeInTheDocument();
  }
});

// Filters
test("render filtered experiments based on searchBar", async () => {
  const { getByTitle, findAllByText } = render(
    <AppContextAQDMock>
      <ExperimentRecordsPage category="all" />
    </AppContextAQDMock>
  );

  const searchBar = getByTitle("Search Experiments");

  await userEvent.click(searchBar);
  await userEvent.type(searchBar, filterByThisTitle);

  const filtered = await findAllByText(new RegExp(filterByThisTitle, "i"));
  expect(filtered.length).toBe(
    ExperimentDataMock.filter(
      (item) => !item.tags.includes(ARCHIVED) && item.title.includes(filterByThisTitle)
    ).slice(0, experimentRecordsRowsPerPageOptions[0]).length
  );
});

test("render filtered experiments based on Tags", async () => {
  const { findByTitle, findByRole, findAllByRole } = render(
    <AppContextAQDMock>
      <ExperimentRecordsPage category="all" />
    </AppContextAQDMock>
  );

  const tagButton = await findByTitle("View-tags");

  await userEvent.click(tagButton);
  const tag_item = await findByRole("option", { name: filterByThisTag });
  userEvent.click(tag_item);

  const filtered = await findAllByRole("checkbox", { name: new RegExp(filterByThisTag, "i") });
  expect(filtered.length).toBe(
    ExperimentDataMock.filter(
      (item) => !item.tags.includes(ARCHIVED) && item.title.includes(filterByThisTitle)
    ).slice(0, experimentRecordsRowsPerPageOptions[0]).length
  );
});

//todo: start and end date
