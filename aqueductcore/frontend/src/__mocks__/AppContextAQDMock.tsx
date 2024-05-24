import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import { BrowserRouter, MemoryRouter, MemoryRouterProps } from "react-router-dom";
import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
import { MockedProvider } from "@apollo/client/testing";
import CssBaseline from "@mui/material/CssBaseline";
import { PropsWithChildren } from "react";

import { getAllExperimentsWithNameFilter_mock } from "__mocks__/queries/getAllExperimentsWithNameFilterMock";
import { getAllExperimentsWithTagFilter_mock } from "__mocks__/queries/getAllExperimentsWithTagFilterMock";
import { getAllExperimentsWithStartTime_mock } from "__mocks__/queries/getAllExperimentsWithStartTimeMock";
import { getAllExperimentsWithEndTime_mock } from "__mocks__/queries/getAllExperimentsWithEndTimeMock";
import { getExperimentFiles_mock } from "__mocks__/queries/getExperimentFilesById";
import { getAllExtensionNames_mock } from "__mocks__/queries/getAllExtensionsMock";
import { getAllExperiments_mock } from "__mocks__/queries/getAllExperimentsMock";
import { updateExperiment_mock } from "__mocks__/mutations/updateExperimentMock";
import { removeExperiment_mock } from "__mocks__/mutations/removeExperimentMock";
import { getUserInformation_mock } from "__mocks__/queries/getUserInformation";
import { getExperiment_mock } from "__mocks__/queries/getExperimentByIdMock";
import { getAllTags_mock } from "__mocks__/queries/getAllTagsMock";
import { Toaster } from "react-hot-toast";
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
  removeExperiment_mockMockMode?: keyof typeof removeExperiment_mock;
  getExperimentFiles_mockMockMode?: keyof typeof getExperimentFiles_mock;
  getUserInformation_mockMockMode?: keyof typeof getUserInformation_mock;
  getExperiment_mockMockMode?: keyof typeof getExperiment_mock;
  getAllExtensionNames_mockMockMode?: keyof typeof getAllExtensionNames_mock;
  browserRouter?: boolean;
  memoryRouterProps?: MemoryRouterProps
}

function AppContextAQDMock({
  getAllTags_mockMockMode = "success",
  getAllExperiments_mockMockMode = "success",
  getAllExperimentsWithNameFilter_mockMockMode = "success",
  getAllExperimentsWithTagFilter_mockMockMode = "success",
  getAllExperimentsWithStartTime_mockMockMode = "success",
  getAllExperimentsWithEndTime_mockMockMode = "success",
  updateExperiment_mockMockMode = "success",
  removeExperiment_mockMockMode = "success",
  getExperimentFiles_mockMockMode = "success",
  getUserInformation_mockMockMode = "success",
  getExperiment_mockMockMode = "success",
  getAllExtensionNames_mockMockMode = "success",
  memoryRouterProps,
  browserRouter,
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

  // from https://stackoverflow.com/questions/48828759/unit-test-raises-error-because-of-getcontext-is-not-implemented
  HTMLCanvasElement.prototype.getContext = jest.fn();

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
    ...removeExperiment_mock[removeExperiment_mockMockMode],
    ...getUserInformation_mock[getUserInformation_mockMockMode],
    ...getAllExtensionNames_mock[getAllExtensionNames_mockMockMode],
    getExperiment_mock[getExperiment_mockMockMode],
  ];

  const App =
    <>
      <CssBaseline />
      {children}
      <Toaster />
    </>
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <CssVarsProvider theme={themeConfig}>
        {browserRouter ?
          <BrowserRouter>
            {App}
          </BrowserRouter> :
          <MemoryRouter {...memoryRouterProps}>
            {App}
          </MemoryRouter>
        }
      </CssVarsProvider>
    </MockedProvider>
  );
}

export default AppContextAQDMock;
