import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";

import ExperimentDetails from "components/organisms/ExperimentDetails";
import { ExperimentDataMock } from "__mocks__/ExperimentDataMock";
import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import { updatedTitle } from "__mocks__/constants";

function ExperimentDetailsWithinComponent() {
  return <ExperimentDetails experimentDetails={ExperimentDataMock[0]} />;
}

test("clicking on pencil icon converts text to field", async () => {
  const { findByTitle, findByText } = render(
    <AppContextAQDMock>
      <ExperimentDetailsWithinComponent />
    </AppContextAQDMock>
  );

  const titleTextInitial = await findByTitle("Experiment title");
  expect(titleTextInitial).toBeInTheDocument();

  const editButton = await findByTitle("Edit title");
  expect(editButton).toBeInTheDocument();
  await userEvent.click(editButton);

  const editField = await findByTitle("Edit experiment title");
  expect(editField).toBeInTheDocument();

  await userEvent.clear(editField);
  await userEvent.type(editField, updatedTitle);

  const descriptionText = await findByText("Description");
  expect(descriptionText).toBeInTheDocument();
  await userEvent.click(descriptionText);

  const titleTextFinal = await findByTitle("Experiment title");
  expect(titleTextFinal).toBeInTheDocument();
  expect(titleTextFinal).toHaveTextContent(updatedTitle);
});
