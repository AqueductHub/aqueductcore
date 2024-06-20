import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";

import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import { TextInputField } from "components/atoms/TextInputField";

test("normal text input field", async () => {
    const { getByTitle } = render(
        <AppContextAQDMock>
            <TextInputField
                title="text_field"
                field="text_field"
                description="Description of textInputField"
                defaultValue="abc123"
            />
        </AppContextAQDMock>
    );

    const textInputTitle = await getByTitle("text_field");
    expect(textInputTitle).toBeInTheDocument();

    const textInputField = textInputTitle.children[0].children[0];
    await userEvent.type(textInputField, "4@£$5.qtkis6cjas")
    expect(textInputField).toHaveValue("abc1234@£$5.qtkis6cjas"); 
});
