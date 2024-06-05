import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";

import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import { IntegerField } from "components/atoms/IntegerField";

test("only support integer values in integer field", async () => {
    const { getByTitle } = render(
        <AppContextAQDMock>
            <IntegerField
                title="integer_field"
                field="integer_field"
                description="Description of integer field"
                defaultValue="123"
            />
        </AppContextAQDMock>
    );

    const integerField = await getByTitle("integer_field");
    expect(integerField).toBeInTheDocument();

    const inputField = integerField.children[0].children[0];
    await userEvent.type(inputField, "4@£$5.qtkis6cjas")
    expect(inputField).toHaveValue(123456); 
});
