import ExperimentDetails from "components/organisms/ExperimentDetails";
import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import { ExperimentDataType } from "types/globalTypes";
import { title } from "__mocks__/constants";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

  return <ExperimentDetails experimentDetails={experimentData} />;
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
  await userEvent.type(editField, title);

  const descriptionText = await findByText("Description");
  expect(descriptionText).toBeInTheDocument();
  await userEvent.click(descriptionText);

  const titleTextFinal = await findByTitle("Experiment title");
  expect(titleTextFinal).toBeInTheDocument();
  expect(titleTextFinal).toHaveTextContent(title);
});
