import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { useState } from "react";

import { experimentRecordsRowsPerPageOptions } from "constants/constants";
import { ExperimentRecordsColumns } from "pages/ExperimentRecordsPage";
import { ExperimentsDataMock } from "__mocks__/ExperimentsDataMock";
import { experimentTableDataFormatter } from "helper/formatters";
import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import ExperimentsListTable from ".";

export const ExperimentTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(experimentRecordsRowsPerPageOptions[0]);
  const pageInfo = {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    count: ExperimentsDataMock.length,
  };
  experimentTableDataFormatter;
  return (
    <AppContextAQDMock>
      <ExperimentsListTable
        ExperimentRecordsColumns={ExperimentRecordsColumns}
        experimentList={experimentTableDataFormatter(ExperimentsDataMock).slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )}
        pageInfo={pageInfo}
      />
    </AppContextAQDMock>
  );
};

test("renders the table with mock data", () => {
  render(<ExperimentTable />);
});

test("Check if the table has labels for each column", () => {
  const { getByText } = render(<ExperimentTable />);
  // All Column labels should be rendered in the table
  for (const experimentRecord of ExperimentRecordsColumns) {
    // some experimentRecord columns doesn't have label
    if (experimentRecord.label) {
      expect(getByText(experimentRecord.label)).toBeInTheDocument();
    }
  }
});

test("Check if the table has pagination", async () => {
  const { getByText } = render(<ExperimentTable />);

  // Check the text for pagination
  expect(getByText(/rows per page/i)).toBeInTheDocument();
});

test("Check if the table's pagination list length is dynamically changing", async () => {
  const processedExperimentTableData = experimentTableDataFormatter(ExperimentsDataMock);
  const { getByText, getAllByRole } = render(<ExperimentTable />);

  // Check if second pagination option is bigger than list's length
  const allDataOrSelectedOption =
    experimentRecordsRowsPerPageOptions[1] > processedExperimentTableData.length
      ? processedExperimentTableData.length
      : experimentRecordsRowsPerPageOptions[1];

  // 1.Check the length of experiment records list
  const experimentRecordsLength = getAllByRole("checkbox").length;
  expect(experimentRecordsLength).toBe(experimentRecordsRowsPerPageOptions[0]);

  // 2.User will change the list length
  await userEvent.click(getByText(experimentRecordsRowsPerPageOptions[0]));
  // choose the second option
  await userEvent.click(getAllByRole("option")[1]);

  // 3.Length of experiment records list should be changed into second option
  const updatedExperimentRecordsLength = getAllByRole("checkbox").length;
  expect(updatedExperimentRecordsLength).toBe(allDataOrSelectedOption);
});

test("Check if the table's pagination list next page is working", async () => {
  const processedExperimentTableData = experimentTableDataFormatter(ExperimentsDataMock);
  const { getByTitle } = render(<ExperimentTable />);
  const nextPageIconButton = getByTitle("Go to next page");
  const previousPageIconButton = getByTitle("Go to previous page");

  // 0.initial state of pagination text
  expect(
    `${1}-${experimentRecordsRowsPerPageOptions[0]} of ${processedExperimentTableData.length}`
  );

  // 1.when next page is clicked
  await userEvent.click(nextPageIconButton);
  expect(
    `${1 + Number(experimentRecordsRowsPerPageOptions[0])}-${experimentRecordsRowsPerPageOptions[0]
    } of ${processedExperimentTableData.length}`
  );

  // 2.when previous page is clicked
  await userEvent.click(previousPageIconButton);
  expect(
    `${1}-${experimentRecordsRowsPerPageOptions[0]} of ${processedExperimentTableData.length}`
  );
});
