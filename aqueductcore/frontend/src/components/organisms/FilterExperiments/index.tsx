import { useSearchParams } from "react-router-dom";
import { Grid, styled } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { DateRangePicker } from "components/molecules/DateRangePicker";
import { ExperimentFiltersType, TagType } from "types/globalTypes";
import { useGetAllTags } from "API/graphql/queries/getAllTags";
import { FilterTags } from "components/molecules/FilterTags";
import { SearchBar } from "components/molecules/SearchBar";

const GridContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    padding: `0 ${theme.spacing(1)}`,
  },
}));

interface FilterExperimentsProps {
  filters?: ExperimentFiltersType;
  setFilters?: (filters: ExperimentFiltersType) => void;
  handleResetPagination?: () => void;
}

function FilterExperiments({ filters, setFilters, handleResetPagination }: FilterExperimentsProps) {
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
    if (handleResetPagination) handleResetPagination()
    const newQueryParameters: URLSearchParams = new URLSearchParams(searchParams);
    if (value.length === 0) {
      newQueryParameters.delete('tags')
    } else {
      newQueryParameters.set('tags', JSON.stringify(value))
    }
    setSearchParams(newQueryParameters, { replace: true })
    setSelectedTags(value);
  };

  const handleSearchStringUpdate = (value: string) => {
    if (handleResetPagination) handleResetPagination()
    const newQueryParameters: URLSearchParams = new URLSearchParams(searchParams);
    if (!value) {
      newQueryParameters.delete('title')
    } else {
      newQueryParameters.set('title', value)
    }
    setSearchParams(newQueryParameters, { replace: true })
    setSearchString(value);
  };

  const handleStartDateUpdate = (value: Dayjs | null) => {
    if (handleResetPagination) handleResetPagination()
    if (value?.isValid() || value === null) {
      const newQueryParameters: URLSearchParams = new URLSearchParams(searchParams);
      if (!value) {
        newQueryParameters.delete('startDate')
      } else {
        newQueryParameters.set('startDate', (value?.toISOString()) ?? '')
      }
      setSearchParams(newQueryParameters, { replace: true })
      setStartDate(value);
    }
  };

  const handleEndDateUpdate = (value: Dayjs | null) => {
    if (handleResetPagination) handleResetPagination()
    if (value?.isValid() || value === null) {
      const newQueryParameters: URLSearchParams = new URLSearchParams(searchParams);
      if (!value) {
        newQueryParameters.delete('endDate')
      } else {
        newQueryParameters.set('endDate', (value?.toISOString()) ?? '')
      }
      setSearchParams(newQueryParameters, { replace: true })
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
