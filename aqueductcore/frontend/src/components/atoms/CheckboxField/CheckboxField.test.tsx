import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";

import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import { CheckboxField } from "components/atoms/CheckboxField";

test('renders checkbox field with correct props', async () => {
    const title = 'Checkbox Title';
    const field = 'Checkbox Field';
    const description = 'Checkbox Description';

    const { getByText, getByRole } = render(
        <AppContextAQDMock>
            <CheckboxField
                title={title}
                field={field}
                description={description}
                checkboxFieldProps={{
                    defaultChecked: true
                }}
            />
        </AppContextAQDMock>
    );

    const titleElement = getByText(title);
    expect(titleElement).toBeInTheDocument();

    const fieldElement = getByText(field);
    expect(fieldElement).toBeInTheDocument();

    const descriptionElement = getByText(description);
    expect(descriptionElement).toBeInTheDocument();

    const checkboxElement = getByRole('checkbox');
    expect(checkboxElement).toBeChecked();
});

test('clicking on the checkbox makes it checked', async () => {
    const { getByTitle } = render(
        <CheckboxField
            title="Test Checkbox"
            field="testField"
            description="Test Description"
            checkboxFieldProps={{
                defaultChecked: true
            }}
        />
    );

    const checkbox = getByTitle('testField').children[0];
    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();    
});
