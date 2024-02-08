import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FilterExperiments from "components/organisms/FilterExperiments";
import AppContextAQDMock from "__mocks__/AppContextAQDMock";

test("user cannot select a date after current date", async () => {
  const { findByPlaceholderText } = render(
    <AppContextAQDMock>
      <FilterExperiments />
    </AppContextAQDMock>
  );

  const startDateField = await findByPlaceholderText("Start Date");
  expect(startDateField).toBeInTheDocument();

  await userEvent.click(startDateField);
  await userEvent.type(startDateField, "25/10/2100");

  expect(startDateField).toHaveValue("25/10/2100");

  await waitFor(async () => {
    expect(startDateField.parentElement).toHaveClass("Mui-error");
  });
});

test("user cannot select a start date after max date", async () => {
  const { findByPlaceholderText } = render(
    <AppContextAQDMock>
      <FilterExperiments />
    </AppContextAQDMock>
  );

  const endDateField = await findByPlaceholderText("End Date");
  expect(endDateField).toBeInTheDocument();

  await userEvent.click(endDateField);
  await userEvent.type(endDateField, "01/01/2022");

  const startDateField = await findByPlaceholderText("Start Date");
  expect(startDateField).toBeInTheDocument();

  await userEvent.click(startDateField);
  await userEvent.type(startDateField, "02/01/2022");

  await waitFor(async () => {
    expect(startDateField.parentElement).toHaveClass("Mui-error");
  });
});

test("user cannot select an end date before start date", async () => {
  const { findByPlaceholderText } = render(
    <AppContextAQDMock>
      <FilterExperiments />
    </AppContextAQDMock>
  );

  const startDateField = await findByPlaceholderText("Start Date");
  expect(startDateField).toBeInTheDocument();

  await userEvent.click(startDateField);
  await userEvent.type(startDateField, "02/01/2022");

  const endDateField = await findByPlaceholderText("End Date");
  expect(endDateField).toBeInTheDocument();

  await userEvent.click(endDateField);
  await userEvent.type(endDateField, "01/01/2022");

  await waitFor(async () => {
    expect(endDateField.parentElement).toHaveClass("Mui-error");
  });
});
