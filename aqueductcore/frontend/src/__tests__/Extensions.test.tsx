import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { render } from "@testing-library/react";

import { selected_experiment } from "__mocks__/queries/experiment/getExperimentByIdMock";
import { ExtensionsDataMock } from "__mocks__/ExtensionsDataMock";
import { ExtensionParameterDataTypes } from "constants/constants";
import ExperimentDetailsPage from "pages/ExperimentDetailsPage";
import AppContextAQDMock from "__mocks__/AppContextAQDMock";

beforeAll(() => {
    window.addEventListener('submit', (e) => {
        e.preventDefault();
    });
});

function ExtensionIncludedComponent() {
    return (
        <AppContextAQDMock memoryRouterProps={{ initialEntries: [`/aqd/experiments/${selected_experiment.eid}`] }}>
            <Routes>
                <Route path="/aqd/experiments/:experimentIdentifier" element={<ExperimentDetailsPage />} />
            </Routes>
        </AppContextAQDMock >)
}

test("render page extensions with no error", async () => {
    render(<ExtensionIncludedComponent />)
});

test("list of extension in the dropdown when clicked", async () => {
    const { findByText } = render(<ExtensionIncludedComponent />)
    const extensionOpenModalButton = await findByText("New Task")
    await userEvent.click(extensionOpenModalButton)

    // Check extensions to be listed in the dropdown
    for (const extension of ExtensionsDataMock) {
        const extensionName = await findByText(extension.name);
        expect(extensionName).toBeInTheDocument();
    }
});

test("author's name in the modal", async () => {

    const { findByText } = render(<ExtensionIncludedComponent />)
    const extensionOpenModalButton = await findByText("New Task")
    await userEvent.click(extensionOpenModalButton)

    const first_extension = await findByText(ExtensionsDataMock[0].name);
    await userEvent.click(first_extension)

    const ExtensionAuthor = await findByText(ExtensionsDataMock[0].authors)
    expect(ExtensionAuthor).toBeInTheDocument()
});

test("list of actions in the extension", async () => {

    const { findByText } = render(<ExtensionIncludedComponent />)
    const extensionOpenModalButton = await findByText("New Task")
    await userEvent.click(extensionOpenModalButton)

    const first_extension = await findByText(ExtensionsDataMock[0].name);
    await userEvent.click(first_extension)

    // Check action names to be there
    for (const extensions_action of ExtensionsDataMock[0].actions) {
        const actionName = await findByText(extensions_action.name)
        expect(actionName).toBeInTheDocument();
    }
});

test("click the other action and params should be updated", async () => {

    const { findByText } = render(<ExtensionIncludedComponent />)
    const extensionOpenModalButton = await findByText("New Task")
    await userEvent.click(extensionOpenModalButton)

    const first_extension = await findByText(ExtensionsDataMock[0].name);
    await userEvent.click(first_extension)

    const second_action = await findByText(ExtensionsDataMock[0].actions[1].name);
    await userEvent.click(second_action)

    //TODO: fix missing cache for experiment name
    // Check params names to be there
    for (const actions_params of ExtensionsDataMock[0].actions[1].parameters
        .filter(param => param.dataType !== ExtensionParameterDataTypes.EXPERIMENT)) {
        const paramName = await findByText(actions_params.name)
        expect(paramName).toBeInTheDocument();
    }
});

test("data is persistence when switching between functions", async () => {

    const { findByText } = render(<ExtensionIncludedComponent />)
    const extensionOpenModalButton = await findByText("New Task")
    await userEvent.click(extensionOpenModalButton)

    const firstActionName = ExtensionsDataMock[0].actions[0].name
    const secondActionName = ExtensionsDataMock[0].actions[1].name

    const first_extension = await findByText(ExtensionsDataMock[0].name);
    await userEvent.click(first_extension)

    const firstInput = ExtensionsDataMock[0].actions[0].parameters[0].name;
    const inputField = (await findByText(firstInput)).nextSibling?.firstChild?.firstChild?.firstChild;
    expect(inputField).toBeInTheDocument();

    if (!(inputField instanceof Element)) throw new Error("Input field is not an element");

    await userEvent.clear(inputField);
    await userEvent.type(inputField, '321');
    expect(inputField).toHaveValue('321');

    const secondActionButton = await findByText(secondActionName);
    await userEvent.click(secondActionButton);

    const secondActionFirstInput = await findByText(ExtensionsDataMock[0].actions[1].parameters[0].name);
    expect(secondActionFirstInput).toBeInTheDocument();

    const firstActionButton = await findByText(firstActionName);
    await userEvent.click(firstActionButton);

    const firstInputAfterUpdate = ExtensionsDataMock[0].actions[0].parameters[0].name;
    const inputFieldAfterUpdate = (await findByText(firstInputAfterUpdate)).nextSibling?.firstChild?.firstChild?.firstChild;
    expect(inputFieldAfterUpdate).toHaveValue('321');
});

test.skip("submit the form and success modal", async () => {

    const { findByTitle, findByText } = render(<ExtensionIncludedComponent />)
    const extensionOpenModalButton = await findByText("New Task")
    await userEvent.click(extensionOpenModalButton)

    const first_extension = await findByText(ExtensionsDataMock[0].name);
    await userEvent.click(first_extension)

    const runButton = await findByTitle("run_extension");
    await userEvent.click(runButton)
    //TODO: This should be fixed with the Apollo Cache. As in the code we're using retriveving experimentUuid from cache.
    const successModal = await findByText("Task submitted")
    expect(successModal).toBeInTheDocument()
});

// TODO: Fix needed to allow mote tests after this (file loading API will fail)
