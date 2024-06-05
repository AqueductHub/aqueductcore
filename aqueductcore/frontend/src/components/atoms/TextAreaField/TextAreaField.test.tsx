import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";

import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import { TextAreaField } from "components/atoms/TextAreaField";

test('renders without crashing', async () => {
    const { findByText, findByRole } = render(
        <AppContextAQDMock>
            <TextAreaField
                title="Textarea Field"
                field="textarea_field"
                description="Description of textarea field"
                textareaFieldProps={{
                    defaultValue: "Default Value"
                }}
            />
        </AppContextAQDMock>
    );

    const title = await findByText('Textarea Field');
    expect(title).toBeInTheDocument();

    const field = await findByText('textarea_field');
    expect(field).toBeInTheDocument();

    const description = await findByText('Description of textarea field');
    expect(description).toBeInTheDocument();

    const textarea = await findByRole('textbox');
    expect(textarea).toHaveValue('Default Value');
});

test('renders without crashing', async () => {
    const { findByRole } = render(
        <AppContextAQDMock>
            <TextAreaField
                title="Textarea Field"
                field="textarea_field"
                description="Description of textarea field"
                textareaFieldProps={{}}
            />
        </AppContextAQDMock>
    );

    const textarea = await findByRole('textbox');
    await userEvent.type(textarea, 'Added Text');
    expect(textarea).toHaveValue('Added Text');
});
