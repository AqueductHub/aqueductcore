import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";

import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import { FloatField } from "components/atoms/FloatField";

test("only support float values in float field", async () => {
    const { getByTitle } = render(
        <AppContextAQDMock>
            <FloatField
                title="float_field"
                field="float_field"
                description="Description of float field"
                defaultValue="123"
            />
        </AppContextAQDMock>
    );

    const floatField = await getByTitle("float_field");
    expect(floatField).toBeInTheDocument();

    const inputField = floatField.children[0].children[0];
    await userEvent.type(inputField, "4@£$5.qtkis6cjas")
    expect(inputField).toHaveValue(12345.6); 
});
