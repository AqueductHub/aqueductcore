import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";

import { ExperimentsDataMock } from "__mocks__/ExperimentsDataMock";
import useFilterExperimentsByTag from "./useFilterExperimentsByTag";
import { ARCHIVED } from "constants/constants";
import { isArchived } from "helper/formatters";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

test("it should filter experiments based on included tags", () => {
  const { result } = renderHook(
    () => useFilterExperimentsByTag({ initialExperiments: ExperimentsDataMock }),
    {
      wrapper: MemoryRouter,
    }
  );

  act(() => {
    result.current.updateFilters({ includedTags: ["rabi"] });
  });

  const experiment_with_rabi_tag = ExperimentsDataMock.filter((experiment) =>
    experiment.tags.includes("rabi")
  );

  expect(result.current.experiments).toHaveLength(experiment_with_rabi_tag.length);
});

test("it should filter experiments based on excluded tags", () => {
  const { result } = renderHook(
    () => useFilterExperimentsByTag({ initialExperiments: ExperimentsDataMock }),
    {
      wrapper: MemoryRouter,
    }
  );

  act(() => {
    result.current.updateFilters({ excludedTags: ["rabi"] });
  });

  const experiment_without_rabi_tag = ExperimentsDataMock.filter(
    (experiment) => !experiment.tags.includes("rabi")
  );

  expect(result.current.experiments).toHaveLength(experiment_without_rabi_tag.length);
});

test("it should give priority to the excluded experiment tags", () => {
  const { result } = renderHook(
    () => useFilterExperimentsByTag({ initialExperiments: ExperimentsDataMock }),
    {
      wrapper: MemoryRouter,
    }
  );

  act(() => {
    result.current.updateFilters({ includedTags: ["rabi"], excludedTags: [ARCHIVED] });
  });

  const experiment_with_rabi_without_archived_tag = ExperimentsDataMock.filter(
    (experiment) => experiment.tags.includes("rabi") && !isArchived(experiment.tags)
  );

  expect(result.current.experiments).toHaveLength(experiment_with_rabi_without_archived_tag.length);
});
