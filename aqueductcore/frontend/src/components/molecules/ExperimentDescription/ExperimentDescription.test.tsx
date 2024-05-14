import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";

import ExperimentDetails from "components/organisms/ExperimentDetails";
import { ExperimentDataMock } from "__mocks__/ExperimentDataMock";
import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import { updatedDescription } from "__mocks__/constants";

function ExperimentDetailsWithinComponent() {
  return (
    <ExperimentDetails experimentDetails={ExperimentDataMock[0]} />
  );
}

test("clicking on edit button converts text to field", async () => {
  const { findByTitle, findByText } = render(
    <AppContextAQDMock>
      <ExperimentDetailsWithinComponent />
    </AppContextAQDMock>
  );

  const descriptionTextInitial = await findByTitle("Experiment description");
  expect(descriptionTextInitial).toBeInTheDocument();

  const editButton = await findByTitle("Edit description");
  expect(editButton).toBeInTheDocument();
  await userEvent.click(editButton);

  const editField = await findByTitle("Edit experiment description");
  expect(editField).toBeInTheDocument();
  await userEvent.clear(editField);
  await userEvent.type(editField, updatedDescription);

  const descriptionText = await findByText("Description");
  expect(descriptionText).toBeInTheDocument();
  await userEvent.click(descriptionText);

  const descriptionTextFinal = await findByTitle("Experiment description");
  expect(descriptionTextFinal).toBeInTheDocument();
  expect(descriptionTextFinal).toHaveTextContent(updatedDescription);
});
