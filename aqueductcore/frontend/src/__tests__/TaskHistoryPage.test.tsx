import { render } from "@testing-library/react";

import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import TaskHistoryPage from "pages/TaskHistoryPage";

test("render task history page with no error", async () => {
    render(
        <AppContextAQDMock>
            <TaskHistoryPage />
        </AppContextAQDMock>
    )
});
