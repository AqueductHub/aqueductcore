import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { drawerItems } from "components/templates/drawerLayout";
import { ExperimentDataType } from "types/globalTypes";
import { ARCHIVED, FAVOURITE } from "constants/constants";

interface FilterOptions {
  includedTags?: string[];
  excludedTags?: string[];
}

interface FilteredData {
  experiments: ExperimentDataType[];
  updateFilters: (filters: FilterOptions) => void;
}

interface useFilterExperimentsByTagProps {
  initialExperiments?: ExperimentDataType[];
  filterByURL?: boolean;
}

function useFilterExperimentsByTag({
  initialExperiments,
  filterByURL,
}: useFilterExperimentsByTagProps): FilteredData {
  const [experiments, setExperiments] = useState(initialExperiments || []);
  const [filters, setFilters] = useState<FilterOptions>({});
  const location = useLocation();

  // Filter the experiments when filters change
  useEffect(() => {
    if (initialExperiments) {
      const filteredExperiments = initialExperiments.filter((experiment) => {
        const hasIncludedTags =
          !filters.includedTags ||
          filters.includedTags.some((tag) => experiment.tags.includes(tag));
        const hasExcludedTags = filters.excludedTags?.some((tag) => experiment.tags.includes(tag));
        return hasIncludedTags && !hasExcludedTags;
      });
      setExperiments(filteredExperiments);
    }
  }, [filters, initialExperiments]);

  // Update experiments based on filters when URL changes
  useEffect(() => {
    if (filterByURL) {
      // location?.pathname is here to support test when mocked and pathname is not provided for some renders.
      // it will just ignore next lines if there's no subItem
      if (!("subItems" in drawerItems[1] && location?.pathname)) return;
      const favouriteSubItem = drawerItems[1].subItems![1];
      const archivedSubItem = drawerItems[1].subItems![2];
      //Favourite
      if (location.pathname === favouriteSubItem.url) {
        updateFilters({ includedTags: [FAVOURITE], excludedTags: [ARCHIVED] });
      }
      //Archived
      else if (location.pathname === archivedSubItem.url) {
        updateFilters({
          includedTags: [ARCHIVED],
        });
      }
      //Recent
      else {
        updateFilters({
          excludedTags: [ARCHIVED],
        });
      }
    }
  }, [location, filterByURL, initialExperiments]);

  // Expose function to update filters
  const updateFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return { experiments, updateFilters };
}

export default useFilterExperimentsByTag;
