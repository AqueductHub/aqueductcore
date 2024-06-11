import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";

import { ExperimentsDataMock } from "__mocks__/ExperimentsDataMock";
import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import { dateFormatter } from "helper/formatters";
import { headCells } from "./Explorer";
import Attachments from ".";

test("render page with no files", () => {
    render(
        <AppContextAQDMock>
            <Attachments experimentId={ExperimentsDataMock[0].id} experimentFiles={[]} />
        </AppContextAQDMock >)
});

test("render page with some files", () => {
    render(
        <AppContextAQDMock>
            <Attachments experimentId={ExperimentsDataMock[0].id} experimentFiles={ExperimentsDataMock[0].files} />
        </AppContextAQDMock >)
});

test("render page with right default modifiedAt descending order", () => {
    const { getAllByRole } = render(
        <AppContextAQDMock>
            <Attachments experimentId={ExperimentsDataMock[0].id} experimentFiles={ExperimentsDataMock[0].files} />
        </AppContextAQDMock >)
    const tableCells = getAllByRole("cell");
    const sortedFromMock = ExperimentsDataMock[0].files.sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime()).flatMap(item => [item.name, dateFormatter(new Date(item.modifiedAt))]) //Descending
    const sortedFromDOM = tableCells.map(item => item.textContent)
    expect(sortedFromDOM).toStrictEqual(sortedFromMock)
});

test("render page with right default modifiedAt acsending order", async () => {
    const { getAllByRole, getByText } = render(
        <AppContextAQDMock>
            <Attachments experimentId={ExperimentsDataMock[0].id} experimentFiles={ExperimentsDataMock[0].files} />
        </AppContextAQDMock >)

    const dateModifiedColHeader = getByText(headCells[1]['label']); // get modifiedAt HeaderCell

    await userEvent.click(dateModifiedColHeader);

    const tableCells = getAllByRole("cell");

    const sortedFromMock = ExperimentsDataMock[0].files.sort((a, b) => new Date(a.modifiedAt).getTime() - new Date(b.modifiedAt).getTime()).flatMap(item => [item.name, dateFormatter(new Date(item.modifiedAt))]) //Acsending
    const sortedFromDOM = tableCells.map(item => item.textContent)
    expect(sortedFromDOM).toStrictEqual(sortedFromMock)
});
