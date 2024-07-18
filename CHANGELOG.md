## 0.2.0

- feat(extension): Add execution functionality in the UI by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/134
- fix(structure): mock folder structure by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/152
- fix(tags): add shouldIncludeTags in the init phase by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/156
- feat(logo): Link the main logo to the homepage by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/161
- feat(extensions): replacing extension folder with the submodule by @str-anger in https://github.com/AqueductHub/aqueductcore/pull/160
- feat(files): open log file when extension is executed by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/154
- feat(enhanced-extension): add validation and dark theme support to extension modal by @jatinriverlane in https://github.com/AqueductHub/aqueductcore/pull/153
- fix: extension stderr by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/165

## 0.1.0

- feat(plugins): merging basic backend plugin functionality into main by @str-anger in https://github.com/AqueductHub/aqueductcore/pull/113
- feat(drawer): make more exportable functions by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/114
- feat(plugin-input-fields): add input fields for plugins by @jatinriverlane in https://github.com/AqueductHub/aqueductcore/pull/115
- feat(cli): Modules to import/export metadata and experiment files into the Aqueduct instance by @samiralavi in https://github.com/AqueductHub/aqueductcore/pull/119
- feat(extension): implement extensions button and modal by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/125
- feat(cli): Aqueduct CLI application with Import/Export function by @samiralavi in https://github.com/AqueductHub/aqueductcore/pull/124
- fix(chore): restructure files by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/133
- feat(docker): Enable SSH access to the container via Azure by @samiralavi in https://github.com/AqueductHub/aqueductcore/pull/136
- feat(docs): Add documentation for Aqueduct CLI with import/export functionality by @samiralavi in https://github.com/AqueductHub/aqueductcore/pull/137
- feat(extension-modal): add view and presentation of extension modal feature by @jatinriverlane in https://github.com/AqueductHub/aqueductcore/pull/135
- feat(plugins): accumulated changes to documentation of the server application by @str-anger in https://github.com/AqueductHub/aqueductcore/pull/142
- fix(extension): hide extensions from the experiment details page by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/145
- feat(automatic-release): Automated release for aqueduct core by @jatinriverlane in https://github.com/AqueductHub/aqueductcore/pull/118
- feat(release-notes): add generateReleaseNotes boolean in release.yaml file by @jatinriverlane in https://github.com/AqueductHub/aqueductcore/pull/146
- fix(automated-release): fix saving the output from env to output by @jatinriverlane in https://github.com/AqueductHub/aqueductcore/pull/148
- feat(manual-release): enable manual dispatch of release by @jatinriverlane in https://github.com/AqueductHub/aqueductcore/pull/149
- fix(failing-automated-release): fixed the failing action of automatic release by @jatinriverlane in https://github.com/AqueductHub/aqueductcore/pull/150
- fix(permission): added contents write permission to automated_release by @jatinriverlane in https://github.com/AqueductHub/aqueductcore/pull/151

## 0.0.9

- fix(gh-issue): add template by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/11
- fix(dependencies): update frontend packages and node versions by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/10
- fix(readme): add .env information for the frontend while development by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/12
- fix(readme): repo fix broken links. by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/17
- feat(auth): add single user login page for community version by @jatinriverlane in https://github.com/AqueductHub/aqueductcore/pull/14
- fix(docs): Reword welcome page to be more friendly by @gabrielg42 in https://github.com/AqueductHub/aqueductcore/pull/15
- fix(files): Add validation for file names to the files API by @samiralavi in https://github.com/AqueductHub/aqueductcore/pull/18
- fix(docs): fix spelling in getting-started.md by @sishtiaq in https://github.com/AqueductHub/aqueductcore/pull/19
- feat(auth): Add single user OpenID Connect token provider APIs to support implicit flow by @samiralavi in https://github.com/AqueductHub/aqueductcore/pull/21
- Update README.md by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/23
- fix(experiment)!: Change experiment generated alias format to `YYYYMMDD-[counter that resets per day]` by @samiralavi in https://github.com/AqueductHub/aqueductcore/pull/22
- fix(docs): Simplify README. by @sishtiaq in https://github.com/AqueductHub/aqueductcore/pull/24
- fix(package): update package.json and tsconfig by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/25
- fix(frontend): Disable frontend static files caching as a prerequisite for authentication by @samiralavi in https://github.com/AqueductHub/aqueductcore/pull/26
- feat(delete_experiment): add feature to delete experiment by @jatinriverlane in https://github.com/AqueductHub/aqueductcore/pull/28
- fix(docs): Fix docker hub link and update documentation links to gh-pages by @JMuff22 in https://github.com/AqueductHub/aqueductcore/pull/20
- feat(security)!: Permission based access to the API via authentication tokens by @samiralavi in https://github.com/AqueductHub/aqueductcore/pull/27
- feat: CLA documents by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/30
- feat(user): Add `UserInfo` node to the GraphQL endpoint to return username and scopes. by @samiralavi in https://github.com/AqueductHub/aqueductcore/pull/33
- feat(api): generate new Graphql API types by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/34
- feat: Added created_by field in Experiment model by @jatinriverlane in https://github.com/AqueductHub/aqueductcore/pull/32
- fix(database): Fix database session getting unusable after first commit. by @samiralavi in https://github.com/AqueductHub/aqueductcore/pull/36
- fix(eslint): keep version 8 by @jatinriverlane in https://github.com/AqueductHub/aqueductcore/pull/37
- feat(setting): Add a new optional environment variable for Keycloak URL by @samiralavi in https://github.com/AqueductHub/aqueductcore/pull/39
- fix(readme): Update README.md by @tomhartley in https://github.com/AqueductHub/aqueductcore/pull/38
- feat(graphql-field): Added `created_by` field in frontend by @jatinriverlane in https://github.com/AqueductHub/aqueductcore/pull/35
- feat(graphql-field): Client ID field as environment variable by @jatinriverlane in https://github.com/AqueductHub/aqueductcore/pull/53
- feat: Increased the value of max filter title length from 8 to 64 by @jatinriverlane in https://github.com/AqueductHub/aqueductcore/pull/55
- feat(tags): Added support for more special characters in tags by @jatinriverlane in https://github.com/AqueductHub/aqueductcore/pull/54
- feat(security): add scopes logic in the frontend by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/52
- fix(timezone): Add timezone awareness to time operations based on UTC. by @samiralavi in https://github.com/AqueductHub/aqueductcore/pull/57
- feat(documentation-link): Added link to documentation in sidebar by @jatinriverlane in https://github.com/AqueductHub/aqueductcore/pull/56
- fix(env-root-fix): Updated root of env files to project root by @jatinriverlane in https://github.com/AqueductHub/aqueductcore/pull/72
- fix(time): fix date and time to a local version by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/58
- feat(table): make file table sortable by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/73
- feat(github): Update issue templates by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/84
- feat(remove-experiment-ui): Feature to delete archived experiments in UI by @jatinriverlane in https://github.com/AqueductHub/aqueductcore/pull/70
- fix(test): remove .only by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/90
- fix(readme): Add links for `aqueductcore-dev` images on Dockerhub to README.md by @samiralavi in https://github.com/AqueductHub/aqueductcore/pull/83
- fix(ci): Fix execution of workflows on feature branches by @samiralavi in https://github.com/AqueductHub/aqueductcore/pull/81
- fix(readme): fix start script by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/93
- feat(content-type): Content-Type in headers in /api/files by @jatinriverlane in https://github.com/AqueductHub/aqueductcore/pull/92
- fix(test): test warnings cleanup by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/95
- feat: render markdown by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/88
- feat(ci): License report Github action and scripts by @samiralavi in https://github.com/AqueductHub/aqueductcore/pull/97
- feat(tags): New mutation to add multiple tags to an experiment. by @samiralavi in https://github.com/AqueductHub/aqueductcore/pull/98
- feat: keep page info in url by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/89
- fix: pagination in url by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/110
- fix(router): change category resets pagination by @safeamiiir in https://github.com/AqueductHub/aqueductcore/pull/111

## 0.0.8

- Initial release
