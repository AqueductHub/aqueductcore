import { ExperimentFileType } from "types/globalTypes";

export type InputTextType = string | number;

export type ThemeModeTypes = "dark" | "light";

export type SortOrder = 'asc' | 'desc';

export type selectedFileType = ExperimentFileType['modifiedAt'] | undefined

export type actionInExtensionsType = { name: string, value?: string | null }

export type extensionActionsData = {
    [key: string]: actionInExtensionsType[]
}

export type FileSelectContextType = {
    selectedFile: string | undefined,
    setSelectedFile: React.Dispatch<React.SetStateAction<string | undefined>>
}
