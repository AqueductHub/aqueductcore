from datetime import datetime, timezone
from uuid import UUID, uuid4

from aqueductcore.backend.models import orm

from aqueductcore.backend.models.experiment import ExperimentCreate, TagCreate
from aqueductcore.backend.models.task import (
    ExtensionParameterBase, SupportedTypes, TaskCreate, TaskParamList, TaskParam
)

user_uuid = uuid4()
experiment_data = [
    ExperimentCreate(
        uuid=UUID("b7038e5a-c93d-4cac-8d3d-b5a95ead0963"),
        title="Entangling Possibilities: Quantum Computing Explorations",
        description="Description for entangling possibilities: quantum computing explorations experiment",
        tags=[
            TagCreate(key="tag1", name="Tag1"),
            TagCreate(key="tag2", name="Tag2"),
            TagCreate(key="tag3", name="Tag3"),
        ],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-1",
    ),
    ExperimentCreate(
        uuid=UUID("94d7d1a5-0840-481c-8f46-d9873f5fafa4"),
        title="Shifting Realities: Quantum Computing Challenges",
        description="Description for shifting realities: quantum computing challenges experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-2",
    ),
    ExperimentCreate(
        uuid=UUID("852b81bb-ced4-4c8d-8176-9c7184206638"),
        title="Beyond Bits: Quantum Computing Frontier",
        description="Description for beyond bits: quantum computing frontier experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-3",
    ),
    ExperimentCreate(
        uuid=UUID("763d3911-18ec-471d-a5ab-ff87c45dbc53"),
        title="Quantum Computing Odyssey: Unveiling New Realms",
        description="Description for quantum computing odyssey: unveiling new realms experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-4",
    ),
    ExperimentCreate(
        uuid=UUID("2d37f5c8-c318-4d2a-8f20-4d905adad3ff"),
        title="Harnessing Qubits: Quantum Computing Adventures",
        description="Description for harnessing qubits: quantum computing adventures experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-5",
    ),
    ExperimentCreate(
        uuid=UUID("65c5589b-e42a-48f5-b208-263221a04046"),
        title="Dancing with Superposition: Quantum Computing Feats",
        description="Description for dancing with superposition: quantum computing feats experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-6",
    ),
    ExperimentCreate(
        uuid=UUID("8018059d-f910-49ac-8bd3-892fc841cab0"),
        title="Quantum Leap: Pioneering Computing Frontiers",
        description="Description for quantum leap: pioneering computing frontiers experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-7",
    ),
    ExperimentCreate(
        uuid=UUID("877a14dd-124c-4c43-bcc2-2cf2ce9aa991"),
        title="Nanoworld Wonders: Quantum Computing Enigma",
        description="Description for nanoworld wonders: quantum computing enigma experiment",
        tags=[
            TagCreate(key="laser", name="laser"),
            TagCreate(key="fridge", name="fridge"),
        ],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-8",
    ),
    ExperimentCreate(
        uuid=UUID("a299d4af-0d14-4436-98db-8fc20af3684d"),
        title="Spinning Qubits: Quantum Computing Quests",
        description="Description for spinning qubits: quantum computing quests experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-9",
    ),
    ExperimentCreate(
        uuid=UUID("4f4758b3-3594-4099-90dc-198b33b22cee"),
        title="Einstein's Legacy: Quantum Computing Journeys",
        description="Description for einstein's legacy: quantum computing journeys experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-10",
    ),
    ExperimentCreate(
        uuid=UUID("1adb18c4-3adf-40cf-bcc7-4b32d1d22be7"),
        title="Entangling Possibilities: Quantum Computing Explorations",
        description="Description for entangling possibilities: quantum computing explorations experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-11",
    ),
    ExperimentCreate(
        uuid=UUID("95def0bb-e9f2-4e3b-aab5-4c388746c69b"),
        title="Quantum Enigmas Unraveled: Computing Marvels",
        description="Description for quantum enigmas unraveled: computing marvels experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-12",
    ),
    ExperimentCreate(
        uuid=UUID("21e4e718-a228-44ed-9e3c-ebbf498de4fd"),
        title="Qubit Chronicles: Quantum Computing Escapades",
        description="Description for qubit chronicles: quantum computing escapades experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-13",
    ),
    ExperimentCreate(
        uuid=UUID("b2c8ab96-35b1-4b2b-a265-72c50a55eb70"),
        title="Quantum Horizons: Computing Beyond Imagination",
        description="Description for quantum horizons: computing beyond imagination experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-14",
    ),
    ExperimentCreate(
        uuid=UUID("8258681b-6e39-4582-a3c4-e50d5248ae2d"),
        title="Quantum Pioneers: Computing Challenges Ahead",
        description="Description for quantum pioneers: computing challenges ahead experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-15",
    ),
    ExperimentCreate(
        uuid=UUID("f313d64b-d86d-4612-8ef9-bc5db16fe411"),
        title="Journey to Quantum Supremacy: Computing Marvels",
        description="Description for journey to quantum supremacy: computing marvels experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-16",
    ),
    ExperimentCreate(
        uuid=UUID("d40a4f1d-3fdc-407a-907d-16fae3326b7e"),
        title="In the Quantum Lab: Computing Experiments",
        description="Description for in the quantum lab: computing experiments experiment",
        tags=[TagCreate(key="diraq", name="diraq")],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-17",
    ),
    ExperimentCreate(
        uuid=UUID("8aa0077a-4fe4-4108-a975-648d2a15ff46"),
        title="Breaking the Classical Barrier: Quantum Computing",
        description="Description for breaking the classical barrier: quantum computing experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-18",
    ),
    ExperimentCreate(
        uuid=UUID("fb7eeb96-31da-4bfe-9364-12e8e54eaae8"),
        title="Quantum Quest: Computing on the Edge",
        description="Description for quantum quest: computing on the edge experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-19",
    ),
    ExperimentCreate(
        uuid=UUID("deb25566-1d18-4d0f-9d8e-91a7045bf8da"),
        title="Taming Quantum Chaos: Computing Marvels",
        description="Description for taming quantum chaos: computing marvels experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-20",
    ),
    ExperimentCreate(
        uuid=UUID("fcfc2b77-4637-48b8-8cc3-7ce0348b3d60"),
        title="Dive into the Quantum Realm: Computing Odyssey",
        description="Description for dive into the quantum realm: computing odyssey experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-21",
    ),
    ExperimentCreate(
        uuid=UUID("6d5df827-8da2-4df4-b294-16718f905121"),
        title="Uncharted Quantum Territory: Computing Explorations",
        description="Description for uncharted quantum territory: computing explorations experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-22",
    ),
    ExperimentCreate(
        uuid=UUID("d60fcc1b-a8a0-4f0b-a5ae-3e120fe92c73"),
        title="Quantum Mechanics in Silicon: Computing Frontiers",
        description="Description for quantum mechanics in silicon: computing frontiers experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-23",
    ),
    ExperimentCreate(
        uuid=UUID("af7af6f0-49d6-4381-8485-e6a0092f4891"),
        title="Quantum Computing Riddles: Unveiling the Future",
        description="Description for quantum computing riddles: unveiling the future experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-24",
    ),
    ExperimentCreate(
        uuid=UUID("8ef9348e-c51f-4f56-9d3d-11926967cc2c"),
        title="Beyond Binary: Quantum Computing Wonders",
        description="Description for beyond binary: quantum computing wonders experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-25",
    ),
    ExperimentCreate(
        uuid=UUID("e839fdb5-6a6c-47e1-b327-385055eebbf7"),
        title="Quantum Voyage: Computing the Unseen",
        description="Description for quantum voyage: computing the unseen experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-26",
    ),
    ExperimentCreate(
        uuid=UUID("d2dfcb36-91f6-46fe-a9b4-99f20509908b"),
        title="Adventures in Quantum Computing: The Next Frontier",
        description="Description for adventures in quantum computing: the next frontier experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-27",
    ),
    ExperimentCreate(
        uuid=UUID("a9263fdb-3867-4adb-9354-3c1e7b870863"),
        title="Decoding Quantum Mysteries: Computing Marvels",
        description="Description for decoding quantum mysteries: computing marvels experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-28",
    ),
    ExperimentCreate(
        uuid=UUID("7dcad510-349d-4245-a8cb-7752b8a7e985"),
        title="Quantum Puzzles: Computing Beyond Limits",
        description="Description for quantum puzzles: computing beyond limits experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-29",
    ),
    ExperimentCreate(
        uuid=UUID("6df6d881-b5ca-4e75-9cc3-b12a9e888e49"),
        title="Riding the Quantum Wave: Computing Challenges",
        description="Description for riding the quantum wave: computing challenges experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-30",
    ),
    ExperimentCreate(
        uuid=UUID("0dffb19d-4a69-46bd-99d2-933435171bc7"),
        title="Quantum Expeditions: Computing Marvels",
        description="Description for quantum expeditions: computing marvels experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-31",
    ),
    ExperimentCreate(
        uuid=UUID("87e3b50d-7117-41d9-b2a1-18c145815e63"),
        title="Exploring Quantum Superposition: Computing Feats",
        description="Description for exploring quantum superposition: computing feats experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-32",
    ),
    ExperimentCreate(
        uuid=UUID("47250d33-051c-44f7-ae32-cb01bf9905c0"),
        title="Quantum Quandaries Unveiled: Computing Enigma",
        description="Description for quantum quandaries unveiled: computing enigma experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-33",
    ),
    ExperimentCreate(
        uuid=UUID("2f313090-4abd-4eac-b893-84d487ac395b"),
        title="Into the Quantum Void: Computing Odyssey",
        description="Description for into the quantum void: computing odyssey experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-34",
    ),
    ExperimentCreate(
        uuid=UUID("400ab061-2a59-406f-96bd-c331015a05f6"),
        title="Quantum Leap into Computing: Bold Experiments",
        description="Description for quantum leap into computing: bold experiments experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-35",
    ),
    ExperimentCreate(
        uuid=UUID("54d17d8f-fcc8-49ab-bc01-dc12ea6736db"),
        title="Quantum Computing Chronicles: Unveiling the Future",
        description="Description for quantum computing chronicles: unveiling the future experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-36",
    ),
    ExperimentCreate(
        uuid=UUID("e7df2b1d-fd13-40ba-8ce7-68002910c8b4"),
        title="Navigating Quantum Realms: Computing Quests",
        description="Description for navigating quantum realms: computing quests experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-37",
    ),
    ExperimentCreate(
        uuid=UUID("ee30df31-8855-4a59-8656-5a94dfe8490d"),
        title="Quantum Complexity Unraveled: Computing Marvels",
        description="Description for quantum complexity unraveled: computing marvels experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-38",
    ),
    ExperimentCreate(
        uuid=UUID("1430c8f2-b2a2-4ab4-9740-d68bdf75d0b3"),
        title="Quantum Computation Alchemy: Adventures Await",
        description="Description for quantum computation alchemy: adventures await experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-39",
    ),
    ExperimentCreate(
        uuid=UUID("53f8d93b-d4a5-4c20-8744-cda31659b436"),
        title="The Quantum Computing Revolution: Challenges Ahead",
        description="Description for the quantum computing revolution: challenges ahead experiment",
        tags=[],
        eid=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-40",
    ),
]

user_data = [
    orm.User(uuid=UUID(int=0), username="admin"),
    orm.User(uuid=UUID(int=1), username="manager"),
    orm.User(uuid=UUID(int=2), username="user"),
]

task_data = [
    TaskCreate(
        task_id=str(UUID(int=1000 + i)),
        experiment_uuid=experiment.uuid,
        action_name="dummy action",
        extension_name="dummy extension",
        parameters=TaskParamList(
            params=[
                TaskParam(
                    value=str(experiment.uuid),
                    metadata=ExtensionParameterBase(
                        name="experiment",
                        description="123",
                        data_type=SupportedTypes.EXPERIMENT,
                    )
                )
            ]
        ),
        result_code=0,
        status="SUCCESS",
        received_at=datetime.now(),
        ended_at=datetime.now(),
        created_by=user_data[i % len(user_data)].uuid,
        created_at=datetime.now(),
    )
    for i, experiment in enumerate(experiment_data)
] + [
     TaskCreate(
        task_id=str(UUID(int=1100 + i)),
        experiment_uuid=experiment.uuid,
        action_name="dummy action",
        extension_name="dummy extension",
        parameters=TaskParamList(
            params=[
                TaskParam(
                    value=str(experiment.uuid),
                    metadata=ExtensionParameterBase(
                        name="experiment",
                        description="123",
                        data_type=SupportedTypes.EXPERIMENT,
                    )
                )
            ]
        ),
        result_code=0,
        status="SUCCESS",
        received_at=datetime.now(),
        ended_at=datetime.now(),
        created_by=user_data[(3 - i) % len(user_data)].uuid,
        created_at=datetime.now(),
    )
    for i, experiment in enumerate(experiment_data)
]
