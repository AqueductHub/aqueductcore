import { actionInExtensionsType } from "types/componentTypes";
import { Tags } from "types/graphql/__GENERATED__/graphql";
import { ARCHIVED, FAVOURITE } from "constants/constants";
import { ExperimentDataType } from "types/globalTypes";
import { AQD_FILE_URI } from "constants/api";

export const dateFormatter = (date: Date) => {
  const localDate = date.toLocaleDateString();
  const localTime = date.toLocaleTimeString("en-GB", { hour12: false });
  return `${localDate} - ${localTime}`;
};

export function processExperimentTableData(experimentList: ExperimentDataType[]) {
  return experimentList.map((experiment) => {
    const { uuid, eid, title, description, tags, createdAt, createdBy } = experiment;

    // star
    let star = false;
    if (isFavourite(tags)) {
      star = true;
    }

    //tags
    const pattern = /^__\w+__$/;
    const filteredTags = tags.filter((tag) => !pattern.test(tag));

    return { uuid, eid, title, description, tags: filteredTags, createdAt, createdBy, star };
  });
}

export const removeFavouriteAndArchivedTag = (tags: Tags["tagsData"]) =>
  tags.filter((tag) => tag !== FAVOURITE && tag !== ARCHIVED);
export const isFavourite = (tags: Tags["tagsData"]) => tags.includes(FAVOURITE);
export const isArchived = (tags: Tags["tagsData"]) => tags.includes(ARCHIVED);

export function isValidUrl(string: string | URL) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

export function mdUrlTransformer(url: string, experimentUuid: ExperimentDataType['uuid']) {
  // Logic to modify links in the MD file lives here
  if (isValidUrl(url)) return url
  return `${AQD_FILE_URI}/api/files/${experimentUuid}/${url}`
}

export function formatExtensionParameters(params?: actionInExtensionsType[]) {
  return params?.map(item => ([item.name, item.value]))
}
