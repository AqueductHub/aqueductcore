import { Tags } from "types/graphql/__GENERATED__/graphql";
import { ExperimentDataType } from "types/globalTypes";
import { ARCHIVED, FAVOURITE } from "constants/constants";

export const dateFormatter = (date: Date) => {
  const localDate = date.toLocaleDateString();
  const localTime = date.toLocaleTimeString("en-GB", { hour12: false });
  return `${localDate} - ${localTime}`;
};

export function processExperimentTableData(experimentList: ExperimentDataType[]) {
  return experimentList.map((experiment) => {
    const { id, alias, title, description, tags, createdAt, createdBy } = experiment;

    // star
    let star = false;
    if (isFavourite(tags)) {
      star = true;
    }

    //tags
    const pattern = /^__\w+__$/;
    const filteredTags = tags.filter((tag) => !pattern.test(tag));

    return { id, alias, title, description, tags: filteredTags, createdAt, createdBy, star };
  });
}

export const removeFavouriteAndArchivedTag = (tags: Tags["tagsData"]) =>
  tags.filter((tag) => tag !== FAVOURITE && tag !== ARCHIVED);
export const isFavourite = (tags: Tags["tagsData"]) => tags.includes(FAVOURITE);
export const isArchived = (tags: Tags["tagsData"]) => tags.includes(ARCHIVED);
