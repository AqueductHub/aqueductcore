import { useSearchParams } from "react-router-dom";
import { Grid, styled } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { DateRangePicker } from "components/molecules/DateRangePicker";
import { SearchBar } from "components/molecules/SearchBar";
import { useGetAllTags } from "API/graphql/queries/getAllTags";
import { ExperimentFiltersType, TagType } from "types/globalTypes";
import { FilterTags } from "components/molecules/FilterTags";

const GridContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    padding: `0 ${theme.spacing(1)}`,
  },
}));

interface FilterExperimentsProps {
  filters?: ExperimentFiltersType;
  setFilters?: (filters: ExperimentFiltersType) => void;
}

function FilterExperiments({ filters, setFilters }: FilterExperimentsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTags, setSelectedTags] = useState<TagType[]>(filters?.tags ?? []);
  const [searchString, setSearchString] = useState<string>(filters?.title ?? "");
  const [startDate, setStartDate] = useState<Dayjs | null>(
    filters?.startDate ? dayjs(filters.startDate) : null
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(
    filters?.endDate ? dayjs(filters.endDate) : null
  );

  const { data: allTags } = useGetAllTags();

  useEffect(() => {
    if (setFilters) {
      setFilters({
        ...filters,
        startDate: startDate?.isValid ? startDate?.startOf('day').toISOString() : null,
        endDate: endDate?.isValid ? endDate?.endOf('day').toISOString() : null,
        title: searchString,
        tags: selectedTags.length ? selectedTags : null,
      });
    }
  }, [selectedTags, searchString, startDate, endDate]);

  const handleTagUpdate = (value: TagType[]) => {
    const newQueryParameters: URLSearchParams = new URLSearchParams(searchParams);
    newQueryParameters.set('tags', JSON.stringify(value))
    setSearchParams(newQueryParameters)
    setSelectedTags(value);
  };

  const handleSearchStringUpdate = (value: string) => {
    const newQueryParameters: URLSearchParams = new URLSearchParams(searchParams);
    newQueryParameters.set('title', value)
    setSearchParams(newQueryParameters)
    setSearchString(value);
  };

  const handleStartDateUpdate = (value: Dayjs | null) => {
    if (value?.isValid() || value === null) {
      const newQueryParameters: URLSearchParams = new URLSearchParams(searchParams);
      newQueryParameters.set('startDate', (value?.toISOString()) ?? '')
      setSearchParams(newQueryParameters)
      setStartDate(value);
    }
  };

  const handleEndDateUpdate = (value: Dayjs | null) => {
    if (value?.isValid() || value === null) {
      const newQueryParameters: URLSearchParams = new URLSearchParams(searchParams);
      newQueryParameters.set('endDate', (value?.toISOString()) ?? '')
      setSearchParams(newQueryParameters)
      setEndDate(value);
    }
  };

  return (
    <>
      <GridContainer>
        <Grid container spacing={2}>
          <Grid item>
            <SearchBar
              searchString={searchString}
              handleSearchStringUpdate={handleSearchStringUpdate}
            />
          </Grid>
          <Grid item>
            {allTags?.tags?.tagsData && (
              <FilterTags
                tags={allTags?.tags?.tagsData}
                selectedOptions={selectedTags}
                handleTagUpdate={handleTagUpdate}
              />
            )}
          </Grid>
          <Grid item>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              handleStartDateUpdate={handleStartDateUpdate}
              handleEndDateUpdate={handleEndDateUpdate}
            />
          </Grid>
        </Grid>
      </GridContainer>
    </>
  );
}

export default FilterExperiments;
