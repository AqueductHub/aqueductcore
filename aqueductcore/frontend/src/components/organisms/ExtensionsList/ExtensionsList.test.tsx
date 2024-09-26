import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";

import { ExtensionsDataMock } from "__mocks__/ExtensionsDataMock";
import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import ExtensionsList from ".";

test("renders ExtensionsList", () => {
    render(
        <AppContextAQDMock>
            <ExtensionsList />
        </AppContextAQDMock>);
});

test("open extension list", async () => {
    const { getByText, findByText } = render(
        <AppContextAQDMock>
            <ExtensionsList />
        </AppContextAQDMock>);

    const extensions_button = getByText('New Task')
    await userEvent.click(extensions_button)
    const extension_1 = await findByText(ExtensionsDataMock[0].name)
    const extension_2 = await findByText(ExtensionsDataMock[1].name)
    expect(extension_1).toBeInTheDocument()
    expect(extension_2).toBeInTheDocument()
});
