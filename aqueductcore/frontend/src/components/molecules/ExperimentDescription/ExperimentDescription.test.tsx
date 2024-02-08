import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";

import ExperimentDetails from "components/organisms/ExperimentDetails";
import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import { ExperimentDataType } from "types/globalTypes";
import { description } from "__mocks__/constants";

function ExperimentDetailsWithinComponent() {
  const experimentId = "fffbde3b-a066-4197-bd8b-f90ff3bc04b0";
  const experimentData: ExperimentDataType = {
    id: experimentId,
    title: "Quantum experiment",
    description: "Detailed Quantum experiment",
    tags: [],
    alias: "20231010-21",
    createdAt: "",
  };

  return (
    <>
      <ExperimentDetails experimentDetails={experimentData} />
    </>
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
  await userEvent.type(editField, description);

  const descriptionText = await findByText("Description");
  expect(descriptionText).toBeInTheDocument();
  await userEvent.click(descriptionText);

  const descriptionTextFinal = await findByTitle("Experiment description");
  expect(descriptionTextFinal).toBeInTheDocument();
  expect(descriptionTextFinal).toHaveTextContent(description);
});
