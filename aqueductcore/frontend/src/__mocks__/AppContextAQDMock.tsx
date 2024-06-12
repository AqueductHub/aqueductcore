import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import { BrowserRouter, MemoryRouter, MemoryRouterProps } from "react-router-dom";
import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
import { MockedProvider } from "@apollo/client/testing";
import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "react-hot-toast";
import { PropsWithChildren } from "react";
import { cssVariableTheme } from "theme";

import { getAllExperimentsWithNameFilter_mock } from "__mocks__/queries/experiment/getAllExperimentsWithNameFilterMock";
import { getAllExperimentsWithTagFilter_mock } from "__mocks__/queries/experiment/getAllExperimentsWithTagFilterMock";
import { getAllExperimentsWithStartTime_mock } from "__mocks__/queries/experiment/getAllExperimentsWithStartTimeMock";
import { getAllExperimentsWithEndTime_mock } from "__mocks__/queries/experiment/getAllExperimentsWithEndTimeMock";
import { getAllExtensionNames_mock } from "__mocks__/queries/extension/getAllExtensionNamesMock";
import { getExperimentFiles_mock } from "__mocks__/queries/experiment/getExperimentFilesById";
import { getAllExperiments_mock } from "__mocks__/queries/experiment/getAllExperimentsMock";
import { removeExperiment_mock } from "__mocks__/mutations/experiment/removeExperimentMock";
import { updateExperiment_mock } from "__mocks__/mutations/experiment/updateExperimentMock";
import { getAllExtensions_mock } from "__mocks__/queries/extension/getAllExtensionsMock";
import { getExperiment_mock } from "__mocks__/queries/experiment/getExperimentByIdMock";
import { executeExtension_mock } from "__mocks__/mutations/extension/executeExtension";
import { getUserInformation_mock } from "__mocks__/queries/user/getUserInformation";
import { getAllTags_mock } from "__mocks__/queries/experiment/getAllTagsMock";

interface AppContextAQDMockProps {
  //Experiments
  getAllTags_mockMockMode?: keyof typeof getAllTags_mock;
  getAllExperiments_mockMockMode?: keyof typeof getAllExperiments_mock;
  getAllExperimentsWithNameFilter_mockMockMode?: keyof typeof getAllExperimentsWithNameFilter_mock;
  getAllExperimentsWithTagFilter_mockMockMode?: keyof typeof getAllExperimentsWithTagFilter_mock;
  getAllExperimentsWithStartTime_mockMockMode?: keyof typeof getAllExperimentsWithStartTime_mock;
  getAllExperimentsWithEndTime_mockMockMode?: keyof typeof getAllExperimentsWithEndTime_mock;
  updateExperiment_mockMockMode?: keyof typeof updateExperiment_mock;
  removeExperiment_mockMockMode?: keyof typeof removeExperiment_mock;
  getExperimentFiles_mockMockMode?: keyof typeof getExperimentFiles_mock;
  getExperiment_mockMockMode?: keyof typeof getExperiment_mock;
  //Users
  getUserInformation_mockMockMode?: keyof typeof getUserInformation_mock;
  //Extensions
  getAllExtensions_mockMockMode?: keyof typeof getAllExtensions_mock;
  getAllExtensionNames_mockMockMode?: keyof typeof getAllExtensionNames_mock;
  executeExtension_mockMockMode?: keyof typeof executeExtension_mock;
  //Others
  children: PropsWithChildren["children"];
  memoryRouterProps?: MemoryRouterProps
  browserRouter?: boolean;
}

function AppContextAQDMock({
  //Experiments
  getAllTags_mockMockMode = "success",
  getAllExperiments_mockMockMode = "success",
  getAllExperimentsWithNameFilter_mockMockMode = "success",
  getAllExperimentsWithTagFilter_mockMockMode = "success",
  getAllExperimentsWithStartTime_mockMockMode = "success",
  getAllExperimentsWithEndTime_mockMockMode = "success",
  updateExperiment_mockMockMode = "success",
  removeExperiment_mockMockMode = "success",
  getExperimentFiles_mockMockMode = "success",
  getExperiment_mockMockMode = "success",
  //Users
  getUserInformation_mockMockMode = "success",
  //Extensions
  getAllExtensions_mockMockMode = "success",
  getAllExtensionNames_mockMockMode = "success",
  executeExtension_mockMockMode = "success",
  //Others
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
    // Experiments
    getAllTags_mock[getAllTags_mockMockMode],
    ...getAllExperiments_mock[getAllExperiments_mockMockMode],
    ...getAllExperimentsWithNameFilter_mock[getAllExperimentsWithNameFilter_mockMockMode],
    ...getAllExperimentsWithTagFilter_mock[getAllExperimentsWithTagFilter_mockMockMode],
    ...getAllExperimentsWithStartTime_mock[getAllExperimentsWithStartTime_mockMockMode],
    ...getAllExperimentsWithEndTime_mock[getAllExperimentsWithEndTime_mockMockMode],
    ...updateExperiment_mock[updateExperiment_mockMockMode],
    ...removeExperiment_mock[removeExperiment_mockMockMode],
    getExperimentFiles_mock[getExperimentFiles_mockMockMode],
    ...getExperiment_mock[getExperiment_mockMockMode],
    // Users
    ...getUserInformation_mock[getUserInformation_mockMockMode],
    //Extensions
    ...getAllExtensionNames_mock[getAllExtensionNames_mockMockMode],
    ...getAllExtensions_mock[getAllExtensions_mockMockMode],
    ...executeExtension_mock[executeExtension_mockMockMode],
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
