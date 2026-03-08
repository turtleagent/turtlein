# Security Verification Evidence

Captured on 2026-03-08 from commit `710e4f2561af66a526ffc8ca9c69200d48fc67f1`.

## Environment
- Timestamp (UTC): `2026-03-08T19:00:13Z`
- Node: `v25.2.1`
- npm: `11.6.2`

## Commands Executed
1. `npm run test:security:authz`
2. `CI=true npm test -- --watchAll=false`
3. `npm run build`

## Results
| Command | Result | Key evidence |
| --- | --- | --- |
| `npm run test:security:authz` | Pass | `8` authz regression tests passed; `0` failed. |
| `CI=true npm test -- --watchAll=false` | Pass | `1` Jest suite passed; `1` test passed; `0` failed. |
| `npm run build` | Pass | React production build compiled successfully. |

## Artifact Files
- [run-metadata.txt](/Users/Richard.Mladek/Documents/projects/turtlein/.subturtles/security-verification/artifacts/run-metadata.txt)
- [test-security-authz.log](/Users/Richard.Mladek/Documents/projects/turtlein/.subturtles/security-verification/artifacts/test-security-authz.log)
- [test-jest.log](/Users/Richard.Mladek/Documents/projects/turtlein/.subturtles/security-verification/artifacts/test-jest.log)
- [build.log](/Users/Richard.Mladek/Documents/projects/turtlein/.subturtles/security-verification/artifacts/build.log)

## Non-Blocking Warnings Observed
- `npm run test:security:authz`: Node emitted `ExperimentalWarning` for `--experimental-transform-types` and a `MODULE_TYPELESS_PACKAGE_JSON` warning while loading `.ts` modules as ES modules.
- `CI=true npm test -- --watchAll=false`: React 18 test-time warning for `ReactDOM.render`, a Material-UI v4 deprecation warning for `createMuiTheme`, and React Router future-flag warnings.
- `npm run build`: Browserslist reported an outdated `caniuse-lite` database before the build completed successfully.
