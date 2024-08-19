import { render } from "@testing-library/react";

import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import JobHistoryPage from "pages/JobHistoryPage";

test("render job history page with no error", async () => {
    render(
        <AppContextAQDMock>
            <JobHistoryPage />
        </AppContextAQDMock>
    )
});
