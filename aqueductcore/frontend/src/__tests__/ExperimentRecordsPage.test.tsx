import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { filterByThisTitle } from "__mocks__/queries/getAllExperimentsWithNameFilterMock";
import { filterByThisTag } from "__mocks__/queries/getAllExperimentsWithTagFilterMock";
import { ARCHIVED, experimentRecordsRowsPerPageOptions } from "constants/constants";
import { ExperimentRecordsColumns } from "pages/ExperimentRecordsPage";
import { ExperimentDataMock } from "__mocks__/ExperimentDataMock";
import ExperimentRecordsPage from "pages/ExperimentRecordsPage";
import AppContextAQDMock from "__mocks__/AppContextAQDMock";

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

test("experiment table next page click", async () => {
  const { findByTitle, findByText } = render(
    <AppContextAQDMock>
      <ExperimentRecordsPage category="all" />
    </AppContextAQDMock>
  );

  // 0- Just page loaded. ex: 1–10 of 14
  const length_of_all_active_experiments = ExperimentDataMock.filter((item) => !item.tags.includes(ARCHIVED)).length
  const firstNumberInPaginationRange = 1
  const secondNumberInPaginationRange = Math.min(length_of_all_active_experiments, experimentRecordsRowsPerPageOptions[0])
  const paginationString = `${firstNumberInPaginationRange}–${secondNumberInPaginationRange} of ${length_of_all_active_experiments}`
  const pageInfo = await findByText(paginationString);
  expect(pageInfo).toBeInTheDocument()

  // 1- Click next page >
  const nextPageIconButton = await findByTitle("Go to next page");
  await act(async () => {
    await userEvent.click(nextPageIconButton);
  });

  // 2- What we expect in the next page. ex: 11-14 of 14
  const firstNumberInPaginationRangeAfterClick = experimentRecordsRowsPerPageOptions[0] + 1
  const secondNumberInPaginationRangeAfterClick = Math.min(length_of_all_active_experiments, 2 * experimentRecordsRowsPerPageOptions[0])
  const paginationStringAfterClick = `${firstNumberInPaginationRangeAfterClick}–${secondNumberInPaginationRangeAfterClick} of ${length_of_all_active_experiments}`
  const pageInfoAfterClick = await findByText(paginationStringAfterClick);

  expect(pageInfoAfterClick).toBeInTheDocument()

});

test("experiment table remembering the previous state", async () => {
  render(
    <AppContextAQDMock browserRouter={true}>
      <ExperimentRecordsPage category="all" />
    </AppContextAQDMock>
  );
});