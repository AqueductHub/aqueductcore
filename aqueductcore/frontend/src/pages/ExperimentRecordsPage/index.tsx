import { useLocation, useSearchParams } from "react-router-dom";
import { Typography, styled } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";

import { drawerTopOffset, mainPadding } from "components/templates/drawerLayout";
import ExperimentsListTable from "components/organisms/ExperimentsListTable";
import { useGetAllExperiments } from "API/graphql/queries/getAllExperiments";
import useFilterExperimentsByTag from "hooks/useFilterExperimentsByTag";
import FilterExperiments from "components/organisms/FilterExperiments";
import { useDidUpdateEffect } from "helper/functions";
import { Error } from "components/atoms/Error";
import {
  dateFormatter,
  processExperimentTableData,
  removeFavouriteAndArchivedTag,
} from "helper/formatters";
import {
  experimentRecordsRowsPerPageOptions,
  MAX_TAGS_VISIBLE_LENGTH,
  FAVOURITE,
  ARCHIVED,
} from "constants/constants";
import {
  ExperimentRecordsColumnsType,
  ExperimentRecordsPageType,
  ExperimentFiltersType,
} from "types/globalTypes";

export const tableHeightOffset = 200;

const Container = styled(Box)`
  margin: -${mainPadding}px;
  margin-top: -${drawerTopOffset + mainPadding}px;
  padding: ${(props) => `${props.theme.spacing(2.5)}`};
`;
const Title = styled(Box)`
  width: "100%";
  margin-bottom: ${(props) => `${props.theme.spacing(2.5)}`};
  font-weight: bold;
`;

const TagBox = styled(Box)`
  background-color: ${(props) => props.theme.palette.background.default};
  padding: ${(props) => `${props.theme.spacing(0.5)} ${props.theme.spacing(1)}`};
  border-radius: ${(props) => props.theme.spacing(0.5)};
  margin-right: ${(props) => props.theme.spacing(1)};
`;

export const ExperimentRecordsColumns: readonly ExperimentRecordsColumnsType[] = [
  { id: "alias", label: "EID", minWidth: 170 },
  {
    id: "title",
    label: "Name",
    minWidth: 100,
    format: (experimentName) => (
      <strong>{typeof experimentName === "string" ? experimentName : ""}</strong>
    ),
  },
  {
    id: "description",
    label: "Description",
    minWidth: 170,
    maxWidth: 320,
    ellipsis: true,
  },
  {
    id: "tags",
    label: "Tags",
    minWidth: 170,
    format: (tags) => {
      if (!Array.isArray(tags)) return <></>;
      const justTags = removeFavouriteAndArchivedTag(tags);
      return (
        <Box>
          {justTags.slice(0, MAX_TAGS_VISIBLE_LENGTH).map((tag) => (
            <TagBox key={tag} component="span">
              {tag}
            </TagBox>
          ))}
          {justTags.length > MAX_TAGS_VISIBLE_LENGTH && (
            <Typography sx={{ mr: 1, display: "inline" }}>
              +{justTags.length - MAX_TAGS_VISIBLE_LENGTH}
            </Typography>
          )}
        </Box>
      );
    },
  },
  {
    id: "createdBy",
    label: "Created By",
    minWidth: 170,
  },
  {
    id: "createdAt",
    label: "Date Created",
    minWidth: 170,
    format: (createdAt) =>
      typeof createdAt === "string" ? dateFormatter(new Date(createdAt)) : "",
  },
];

const ExperimentRecordsColumnsWithFavColumn: readonly ExperimentRecordsColumnsType[] = [
  { id: "star", label: "", minWidth: 1, maxWidth: 36, align: "center" },
  ...ExperimentRecordsColumns,
];

function ExperimentRecordsPage({ category }: { category?: ExperimentRecordsPageType }) {
  const [searchParams,] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get('page')) || 0);
  const [rowsPerPage, setRowsPerPage] = useState(Number(searchParams.get('rowsPerPage')) || experimentRecordsRowsPerPageOptions[0]);
  const [filters, setFilters] = useState<ExperimentFiltersType>({
    startDate: searchParams.get('startDate'),
    endDate: searchParams.get('endDate'),
    tags: JSON.parse(searchParams.get('tags') ?? ''),
    title: searchParams.get('title'),
    shouldIncludeTags: null
  });
  const {
    data: AllExperiments,
    loading,
    error,
  } = useGetAllExperiments({
    variables: {
      offset: page * rowsPerPage,
      limit: rowsPerPage,
      filters,
    },
    fetchPolicy: "network-only",
  });
  const { experiments } = useFilterExperimentsByTag({
    initialExperiments: AllExperiments?.experiments?.experimentsData,
    filterByURL: true,
  });
  const processedExperimentData = experiments ? processExperimentTableData(experiments) : undefined;
  const location = useLocation();
  const pageInfo = {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    count: AllExperiments?.experiments?.totalExperimentsCount || 0,
  };

  // TODO: This needs an API change to handle favourite and archive functionality as a new field
  // handle different categories based on different <Routes /> in App.tsx
  useDidUpdateEffect(() => {
    handleResetPagination();
    switch (category) {
      case "favourites":
        setFilters({
          ...filters,
          shouldIncludeTags: [FAVOURITE],
        });
        break;
      case "archived":
        setFilters({
          ...filters,
          shouldIncludeTags: [ARCHIVED],
        });
        break;
      default:
        setFilters({
          ...filters,
          shouldIncludeTags: null,
        });
        break;
    }
  }, [category]);

  const handlePageName = (pageUrl: string) => {
    switch (pageUrl) {
      case "/aqd/experiments":
        return "All experiments";
      case "/aqd/experiments/favourites":
        return "Favourites";
      case "/aqd/experiments/archived":
        return "Archived";
      default:
        return "";
    }
  };

  const handleResetPagination = () => {
    setRowsPerPage(experimentRecordsRowsPerPageOptions[0]);
    setPage(0);
  };
  if (error) return <Error message={error.message} />;
  return (
    <Container>
      <Title>{handlePageName(location.pathname)}</Title>
      {/* //Guides would be added here */}
      <FilterExperiments filters={filters} setFilters={setFilters} />
      <Box sx={{ mt: 2 }}>
        {processedExperimentData && pageInfo.count && !loading ? (
          <ExperimentsListTable
            ExperimentRecordsColumns={
              location.pathname.includes("archived") || location.pathname.includes("favourite")
                ? ExperimentRecordsColumns
                : ExperimentRecordsColumnsWithFavColumn
            }
            experimentList={processedExperimentData}
            pageInfo={pageInfo}
            maxHeight={`calc(100vh - ${tableHeightOffset}px)`}
          />
        ) : null}
      </Box>
    </Container>
  );
}

export default ExperimentRecordsPage;
