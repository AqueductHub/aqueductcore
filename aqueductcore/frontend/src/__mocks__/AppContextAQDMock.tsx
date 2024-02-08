import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
import { MockedProvider } from "@apollo/client/testing";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router-dom";
import { PropsWithChildren } from "react";

import { getAllExperimentsWithNameFilter_mock } from "__mocks__/queries/getAllExperimentsWithNameFilterMock";
import { getAllExperimentsWithTagFilter_mock } from "__mocks__/queries/getAllExperimentsWithTagFilterMock";
import { getAllExperimentsWithStartTime_mock } from "__mocks__/queries/getAllExperimentsWithStartTimeMock";
import { getAllExperimentsWithEndTime_mock } from "__mocks__/queries/getAllExperimentsWithEndTimeMock";
import { getExperimentFiles_mock } from "__mocks__/queries/getExperimentFilesById";
import { getAllExperiments_mock } from "__mocks__/queries/getAllExperimentsMock";
import { updateExperiment_mock } from "__mocks__/mutations/updateExperimentMock";
import { getAllTags_mock } from "__mocks__/queries/getAllTagsMock";
import { cssVariableTheme } from "theme";

interface AppContextAQDMockProps {
  children: PropsWithChildren["children"];
  getAllTags_mockMockMode?: keyof typeof getAllTags_mock;
  getAllExperiments_mockMockMode?: keyof typeof getAllExperiments_mock;
  getAllExperimentsWithNameFilter_mockMockMode?: keyof typeof getAllExperimentsWithNameFilter_mock;
  getAllExperimentsWithTagFilter_mockMockMode?: keyof typeof getAllExperimentsWithTagFilter_mock;
  getAllExperimentsWithStartTime_mockMockMode?: keyof typeof getAllExperimentsWithStartTime_mock;
  getAllExperimentsWithEndTime_mockMockMode?: keyof typeof getAllExperimentsWithEndTime_mock;
  updateExperiment_mockMockMode?: keyof typeof updateExperiment_mock;
  getExperimentFiles_mockMockMode?: keyof typeof getExperimentFiles_mock;
}

function AppContextAQDMock({
  getAllTags_mockMockMode = "success",
  getAllExperiments_mockMockMode = "success",
  getAllExperimentsWithNameFilter_mockMockMode = "success",
  getAllExperimentsWithTagFilter_mockMockMode = "success",
  getAllExperimentsWithStartTime_mockMockMode = "success",
  getAllExperimentsWithEndTime_mockMockMode = "success",
  updateExperiment_mockMockMode = "success",
  getExperimentFiles_mockMockMode = "success",
  children,
}: AppContextAQDMockProps) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string): MediaQueryList => ({
      media: query,
      // this is the media query that @material-ui/pickers uses to determine if a device is a desktop device
      matches: query === "(pointer: fine)",
      onchange: () => {
        /**/
      },
      addEventListener: () => {
        /**/
      },
      removeEventListener: () => {
        /**/
      },
      addListener: () => {
        /**/
      },
      removeListener: () => {
        /**/
      },
      dispatchEvent: () => false,
    }),
  });

  const themeConfig = extendTheme(cssVariableTheme);
  const mocks = [
    getAllTags_mock[getAllTags_mockMockMode],
    getExperimentFiles_mock[getExperimentFiles_mockMockMode],
    ...getAllExperiments_mock[getAllExperiments_mockMockMode],
    ...getAllExperimentsWithNameFilter_mock[getAllExperimentsWithNameFilter_mockMockMode],
    ...getAllExperimentsWithTagFilter_mock[getAllExperimentsWithTagFilter_mockMockMode],
    ...getAllExperimentsWithStartTime_mock[getAllExperimentsWithStartTime_mockMockMode],
    ...getAllExperimentsWithEndTime_mock[getAllExperimentsWithEndTime_mockMockMode],
    ...updateExperiment_mock[updateExperiment_mockMockMode],
  ];
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <CssVarsProvider theme={themeConfig}>
        <BrowserRouter>
          <CssBaseline />
          {children}
        </BrowserRouter>
      </CssVarsProvider>
    </MockedProvider>
  );
}

export default AppContextAQDMock;
