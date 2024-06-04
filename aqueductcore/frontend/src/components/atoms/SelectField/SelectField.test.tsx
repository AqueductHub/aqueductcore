import userEvent from "@testing-library/user-event";
import { render, waitFor } from "@testing-library/react";

import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import { SelectField } from "components/atoms/SelectField";

test('renders without crashing', async () => {
    const { findByText } = render(
        <AppContextAQDMock>
            <SelectField
                title="Test Title"
                field="Test Field"
                description="Test Description"
                options={["freezer", "laser", "thermometer"]}
                selectFieldProps={{
                    defaultValue: "freezer"
                }}
            />
        </AppContextAQDMock>
    );

    const title = await findByText('Test Title');
    expect(title).toBeInTheDocument();

    const field = await findByText('Test Field');
    expect(field).toBeInTheDocument();

    const description = await findByText('Test Description');
    expect(description).toBeInTheDocument();
  });

  test('renders the dropdown and options correctly', async () => {
    const { findByRole, findByText } = render(
        <AppContextAQDMock>
            <SelectField
                title="test_title"
                field="test_title"
                description="Test Description"
                options={["freezer", "laser", "thermometer"]}
                selectFieldProps={{
                    defaultValue: "freezer"
                }}
            />
        </AppContextAQDMock>
    );
    
    const dropdown = await findByRole('combobox');
    expect(dropdown).toBeInTheDocument();
    userEvent.click(dropdown);

    const option1 = await findByText('freezer');
    const option2 = await findByText('laser');
    const option3 = await findByText('thermometer');

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
    expect(option3).toBeInTheDocument();
  });

  test('passes selectFieldProps correctly', async () => {
    const { findByRole } = render(
        <AppContextAQDMock>
            <SelectField
                title="select_field"
                field="select_field"
                description="Description of select field"
                options={["freezer", "laser", "thermometer"]}
                selectFieldProps={{
                    defaultValue: "freezer"
                }}
            />
        </AppContextAQDMock>
    );

    const dropdown = await findByRole('combobox');
    expect(dropdown).toHaveTextContent('freezer');
  });

  test('handles selection correctly', async () => {
    const { findByRole, findByText } = render(
        <AppContextAQDMock>
            <SelectField
                title="select_field"
                field="select_field"
                description="Description of select field"
                options={["freezer", "laser", "thermometer"]}
                selectFieldProps={{
                    defaultValue: "freezer"
                }}
            />
        </AppContextAQDMock>
    );

    const dropdown = await findByRole('combobox');
    userEvent.click(dropdown);
    
    const option2 = await findByText('laser');
    expect(option2).toBeInTheDocument();
    userEvent.click(option2);

    await waitFor(() => {
        expect(dropdown).toHaveTextContent('laser');
    });
  });
