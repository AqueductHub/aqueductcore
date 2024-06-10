import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { render } from "@testing-library/react";

import { selected_experiment } from "__mocks__/queries/getExperimentByIdMock";
import { ExtensionsDataMock } from "__mocks__/ExtensionsDataMock";
import { ExtensionParameterDataTypes } from "constants/constants";
import ExperimentDetailsPage from "pages/ExperimentDetailsPage";
import AppContextAQDMock from "__mocks__/AppContextAQDMock";

function ExtensionIncludedComponent() {
    return (
        <AppContextAQDMock memoryRouterProps={{ initialEntries: [`/aqd/experiments/${selected_experiment.alias}`] }}>
            <Routes>
                <Route path="/aqd/experiments/:experimentIdentifier" element={<ExperimentDetailsPage />} />
            </Routes>
        </AppContextAQDMock >)
}

test("render page extensions with no error", async () => {
    render(<ExtensionIncludedComponent />)
});

test("list of extension in the dropdown when clicked", async () => {
    const { findByTitle, findByText } = render(<ExtensionIncludedComponent />)
    const extensionOpenModalButton = await findByTitle("extensions")
    await userEvent.click(extensionOpenModalButton)

    // Check extensions to be listed in the dropdown
    for (const extension of ExtensionsDataMock) {
        const extensionName = await findByText(extension.name);
        expect(extensionName).toBeInTheDocument();
    }
});

test("author's name in the modal", async () => {

    const { findByTitle, findByText } = render(<ExtensionIncludedComponent />)
    const extensionOpenModalButton = await findByTitle("extensions")
    await userEvent.click(extensionOpenModalButton)

    const first_extension = await findByText(ExtensionsDataMock[0].name);
    await userEvent.click(first_extension)

    const ExtensionAuthor = await findByText(ExtensionsDataMock[0].authors)
    expect(ExtensionAuthor).toBeInTheDocument()
});

test("list of functions in the extension", async () => {

    const { findByTitle, findByText } = render(<ExtensionIncludedComponent />)
    const extensionOpenModalButton = await findByTitle("extensions")
    await userEvent.click(extensionOpenModalButton)

    const first_extension = await findByText(ExtensionsDataMock[0].name);
    await userEvent.click(first_extension)

    // Check function names to be there
    for (const extensions_function of ExtensionsDataMock[0].functions) {
        const functionName = await findByText(extensions_function.name)
        expect(functionName).toBeInTheDocument();
    }
});

test("click the other function and params should be updated", async () => {

    const { findByTitle, findByText } = render(<ExtensionIncludedComponent />)
    const extensionOpenModalButton = await findByTitle("extensions")
    await userEvent.click(extensionOpenModalButton)

    const first_extension = await findByText(ExtensionsDataMock[0].name);
    await userEvent.click(first_extension)

    const second_function = await findByText(ExtensionsDataMock[0].functions[1].name);
    await userEvent.click(second_function)

    //TODO: fix missing cache for experiment name
    // Check params names to be there
    for (const functions_params of ExtensionsDataMock[0].functions[1].parameters
        .filter(param => param.dataType !== ExtensionParameterDataTypes.EXPERIMENT)) {
        const paramName = await findByText(functions_params.name)
        expect(paramName).toBeInTheDocument();
    }
});

test("submit the form and success modal", async () => {

    const { findByTitle, findByText } = render(<ExtensionIncludedComponent />)
    const extensionOpenModalButton = await findByTitle("extensions")
    await userEvent.click(extensionOpenModalButton)

    const first_extension = await findByText(ExtensionsDataMock[0].name);
    await userEvent.click(first_extension)

    const runButton = await findByTitle("run_extension");
    await userEvent.click(runButton)
    const successModal = await findByText("Execution finished successfully")
    expect(successModal).toBeInTheDocument()
});
