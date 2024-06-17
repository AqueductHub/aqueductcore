import { ExperimentAllFieldsDataType, TagType } from "types/globalTypes";
import { ARCHIVED, FAVOURITE } from "constants/constants";

export const tagOptions: TagType[] = [
  "rabi",
  "ibm",
  "qubit",
  "logic",
  "gates",
  "super",
  "speed",
  "bit",
  "code",
  "data",
  "entro",
  "error",
  "fermi",
  "phase",
  "helix",
  "moore",
  "noise",
  "power",
  "state",
  "tunnel",
  "higgs",
  "qutip",
  "tensor",
  "unit",
  "wave",
  "pulse",
  "rnges",
  "blink",
  "xor",
  "zeno",
  "bell",
];

export const ExperimentsDataMock: ExperimentAllFieldsDataType[] = [
  {
    uuid: "010bbd7f-43a8-4f4e-996b-1cdaebc398cc",
    eid: "20221111-01",
    title: "EXP_rabi_20mk",
    description:
      "Had to recalibrate the main trap due to ion loss earlier, which led to a delay in our experiment timeline.",
    tags: ["rabi", ARCHIVED],
    createdAt: "2022-11-11T00:00:00+00:00",
    createdBy: "admin",
    files: [
      {
        name: "aqueduct_intro.pdf",
        path: "/api/files/95dc350e-10cf-4fb8-b356-050ccc6536b3",
        modifiedAt: "2023-11-22T15:43:17",
      },
      {
        name: "image_code.png",
        path: "/api/files/95dc350e-10cf-4fb8-b356-050ccc6536b3",
        modifiedAt: "2023-08-11T11:31:59",
      },
      {
        name: "image_quantum.jpg",
        path: "/api/files/95dc350e-10cf-4fb8-b356-050ccc6536b3",
        modifiedAt: "2023-08-29T18:18:50",
      },
      {
        name: "test.json",
        path: "/api/files/95dc350e-10cf-4fb8-b356-050ccc6536b3",
        modifiedAt: "2023-12-04T14:32:29",
      },
      {
        name: "test1.json",
        path: "/api/files/95dc350e-10cf-4fb8-b356-050ccc6536b3",
        modifiedAt: "2023-12-04T14:33:10",
      },
      {
        name: "test2.json",
        path: "/api/files/95dc350e-10cf-4fb8-b356-050ccc6536b3",
        modifiedAt: "2023-12-04T14:33:27",
      },
    ],
  },

  {
    uuid: "020bbd7f-43a8-4f4e-996b-1cdaebc398cc",
    eid: "20221111-02",
    title: "EXP_rabi_20mk",
    description:
      "Had to recalibrate the main trap due to ion loss earlier, which led to a delay in our experiment timeline.",
    tags: ["rabi", FAVOURITE],
    createdAt: "2022-11-11T00:00:00+00:00",
    createdBy: "admin",
    files: [],
  },

  {
    uuid: "030bbd7f-43a8-4f4e-996b-1cdaebc398cc",
    eid: "20221111-03",
    title: "EXP_rabi_20mk",
    description:
      "Had to recalibrate the main trap due to ion loss earlier, which led to a delay in our experiment timeline.",
    tags: ["rabi"],
    createdAt: "2022-11-11T00:00:00+00:00",
    createdBy: "admin",
    files: [],
  },

  {
    uuid: "040bbd7f-43a8-4f4e-996b-1cdaebc398cc",
    eid: "20221113-04",
    title: "EXP_rabi_10mk",
    description: "Achieved higher precision with the modified laser setup! ",
    tags: ["rabi"],
    createdAt: "2022-11-13T00:00:00+00:00",
    createdBy: "admin",
    files: [],
  },
  {
    uuid: "050bbd7f-43a8-4f4e-996b-1cdaebc398cc",
    eid: "20221113-05",
    title: "EXP_rabi_10mk",
    description: "Achieved higher precision with the modified laser setup! ",
    tags: ["rabi"],
    createdAt: "2022-11-13T00:00:00+00:00",
    createdBy: "admin",
    files: [],
  },

  {
    uuid: "060bbd7f-43a8-4f4e-996b-1cdaebc398cc",
    eid: "20221113-06",
    title: "EXP_rabi_10mk",
    description: "Achieved higher precision with the modified laser setup! ",
    tags: ["rabi"],
    createdAt: "2022-11-13T00:00:00+00:00",
    createdBy: "admin",
    files: [],
  },

  {
    uuid: "070bbd7f-43a8-4f4e-996b-1cdaebc398cc",
    eid: "20221113-07",
    title: "EXP_rabi_10mk",
    description: "Achieved higher precision with the modified laser setup! ",
    tags: ["rabi"],
    createdAt: "2022-11-13T00:00:00+00:00",
    createdBy: "admin",
    files: [],
  },

  {
    uuid: "080bbd7f-43a8-4f4e-996b-1cdaebc398cc",
    eid: "20221113-08",
    title: "Scanning 1D",
    description: "Increased cooling time resulted in reduce measurement error.",
    tags: ["scanning", "1D"],
    createdAt: "2022-11-13T00:00:00+00:00",
    createdBy: "admin",
    files: [],
  },

  {
    uuid: "090bbd7f-43a8-4f4e-996b-1cdaebc398cc",
    eid: "20221113-09",
    title: "Scanning 1D",
    description: "Increased cooling time resulted in reduce measurement error.",
    tags: ["scanning", "1D"],
    createdAt: "2022-11-13T00:00:00+00:00",
    createdBy: "admin",
    files: [],
  },

  {
    uuid: "100bbd7f-43a8-4f4e-996b-1cdaebc398cc",
    eid: "20221113-10",
    title: "Scanning 1D",
    description: "Increased cooling time resulted in reduce measurement error.",
    tags: ["scanning", "1D"],
    createdAt: "2022-11-13T00:00:00+00:00",
    createdBy: "admin",
    files: [],
  },

  {
    uuid: "110bbd7f-43a8-4f4e-996b-1cdaebc398cc",
    eid: "20221123-11",
    title: "Scanning 1D",
    description: "Increased cooling time resulted in reduce measurement error.",
    tags: ["scanning", "1D"],
    createdAt: "2022-11-23T00:00:00+00:00",
    createdBy: "admin",
    files: [],
  },

  {
    uuid: "120bbd7f-43a8-4f4e-996b-1cdaebc398cc",
    eid: "20221123-12",
    title: "Scanning 2D",
    description: "Experiment repeated for consistency; results consistent with prior run.",
    tags: ["scanning", "1D", "2D", "three", "else", "things"],
    createdAt: "2022-11-23T00:00:00+00:00",
    createdBy: "admin",
    files: [],
  },

  {
    uuid: "130bbd7f-43a8-4f4e-996b-1cdaebc398cc",
    eid: "20221122-13",
    title: "Scanning 2D",
    description: "Experiment repeated for consistency; results consistent with prior run.",
    tags: ["scanning", "1D", "2D", "three", "else", "things"],
    createdAt: "2022-11-22T00:00:00+00:00",
    createdBy: "admin",
    files: [],
  },

  {
    uuid: "140bbd7f-43a8-4f4e-996b-1cdaebc398cc",
    eid: "20221122-14",
    title: "Scanning 2D",
    description: "Experiment repeated for consistency; results consistent with prior run.",
    tags: ["scanning", "1D", "2D", "three", "else", "things"],
    createdAt: "2022-11-22T00:00:00+00:00",
    createdBy: "admin",
    files: [],
  },

  {
    uuid: "150bbd7f-43a8-4f4e-996b-1cdaebc398cc",
    eid: "20221123-15",
    title: "Scanning 2D",
    description: "Experiment repeated for consistency; results consistent with prior run.",
    tags: ["scanning", "1D", "2D", "three", "else", "things"],
    createdAt: "2022-11-23T00:00:00+00:00",
    createdBy: "admin",
    files: [],
  },
];

export const sample_eid = ExperimentsDataMock[0].eid;
