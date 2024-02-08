import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { act } from "react-dom/test-utils";

import { ExperimentDataMock } from "__mocks__/ExperimentDataMock";
import useFilterExperimentsByTag from "./useFilterExperimentsByTag";
import { drawerItems } from "components/templates/drawerLayout";
import { ARCHIVED } from "constants/constants";
import { isArchived, isFavourite } from "helper/formatters";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

test("it should filter experiments based on included tags", () => {
  const { result } = renderHook(
    () => useFilterExperimentsByTag({ initialExperiments: ExperimentDataMock }),
    {
      wrapper: MemoryRouter,
    }
  );

  act(() => {
    result.current.updateFilters({ includedTags: ["rabi"] });
  });

  const experiment_with_rabi_tag = ExperimentDataMock.filter((experiment) =>
    experiment.tags.includes("rabi")
  );

  expect(result.current.experiments).toHaveLength(experiment_with_rabi_tag.length);
});

test("it should filter experiments based on excluded tags", () => {
  const { result } = renderHook(
    () => useFilterExperimentsByTag({ initialExperiments: ExperimentDataMock }),
    {
      wrapper: MemoryRouter,
    }
  );

  act(() => {
    result.current.updateFilters({ excludedTags: ["rabi"] });
  });

  const experiment_without_rabi_tag = ExperimentDataMock.filter(
    (experiment) => !experiment.tags.includes("rabi")
  );

  expect(result.current.experiments).toHaveLength(experiment_without_rabi_tag.length);
});

test("it should give priority to the excluded experiment tags", () => {
  const { result } = renderHook(
    () => useFilterExperimentsByTag({ initialExperiments: ExperimentDataMock }),
    {
      wrapper: MemoryRouter,
    }
  );

  act(() => {
    result.current.updateFilters({ includedTags: ["rabi"], excludedTags: [ARCHIVED] });
  });

  const experiment_with_rabi_without_archived_tag = ExperimentDataMock.filter(
    (experiment) => experiment.tags.includes("rabi") && !isArchived(experiment.tags)
  );

  expect(result.current.experiments).toHaveLength(experiment_with_rabi_without_archived_tag.length);
});