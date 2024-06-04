import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";

import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import { CheckboxField } from "components/atoms/CheckboxField";

test('renders checkbox field with correct props', () => {
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

test('clicking on the checkbox makes it checked', () => {
    const { getByTitle } = render(
        <CheckboxField
            title="Test Checkbox"
            field="testField"
            description="Test Description"
            checkboxFieldProps={{
                checked: true
            }}
        />
    );

    const checkbox = getByTitle('testField').children[0];
    expect(checkbox).toBeChecked();

    userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
});
