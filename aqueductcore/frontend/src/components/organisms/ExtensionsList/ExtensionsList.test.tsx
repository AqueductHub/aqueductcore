import { render } from "@testing-library/react";

import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import ExtensionsList from ".";
import userEvent from "@testing-library/user-event";
import { extensions } from "__mocks__/ExtensionsDataMock";

test("renders ExtensionsList", () => {
    render(
        <AppContextAQDMock>
            <ExtensionsList />
        </AppContextAQDMock>);
});

test("open extension list", async () => {
    const { getByTitle, findByText } = render(
        <AppContextAQDMock>
            <ExtensionsList />
        </AppContextAQDMock>);

    const extensions_button = getByTitle('extensions')
    await userEvent.click(extensions_button)
    const extension_1 = await findByText(extensions[0].name)
    const extension_2 = await findByText(extensions[1].name)
    expect(extension_1).toBeInTheDocument()
    expect(extension_2).toBeInTheDocument()
});
