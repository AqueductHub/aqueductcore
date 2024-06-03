import { ExperimentFileType } from "types/globalTypes";

export type InputTextType = string | number;

export type ThemeModeTypes = "dark" | "light";

export type SortOrder = 'asc' | 'desc';

export type selectedFileType = ExperimentFileType['modifiedAt'] | undefined

export type functionInExtensionsType = { name: string, value?: string | null }
