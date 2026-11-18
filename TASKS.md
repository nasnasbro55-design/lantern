# Tasks

Building ends Fri Nov 20 at 11 PM. No edits after submission. Tick a box when your part is merged to `main` and the game still runs.

## Naz: simulation lead, game and integration
- [ ] `src/sim/world.ts`: scripted disaster timeline and truth vs official values per level
- [ ] `src/game/`: Hollow map with 12 levels, fog of truth, sensor placement
- [ ] Lights going out, brown taps, coughing, check-in sparks
- [ ] Wire the Sim into the game and the HUD (`src/main.ts`)
- [ ] Deploy and add the live URL to the README
- [ ] Final submission check: all four teammates entered, demo video linked

## Kevin: simulation engineer
- [ ] `src/sim/forecaster.ts`: linear trend and early warnings
- [ ] `src/sim/allocator.ts`: fair-share and Directorate allocation
- [ ] `src/sim/mesh.ts`: relays, shaft links, check-ins that can fail
- [ ] `src/sim/verdict.ts`: surface probe verdict with outlier rejection
- [ ] `src/sim/ledger.ts`: signed readings and hash-chained log
- [ ] A test file for each module (`*.test.ts`), `npm test` passing

## Nashwan: HUD logic
- [ ] `src/ui/WarningFeed.ts`: early warning feed
- [ ] `src/ui/DirectoratePanel.ts`: official values until sensed, then truth
- [ ] `src/ui/AllocationScreen.ts`: Directorate vs fair-share choice
- [ ] `src/ui/EndScreens.ts`: win and lose flow
- [ ] Agree class names with Sophia first

## Sophia: HUD visuals, art and sound
- [ ] Palette and art direction (post it in the group chat first)
- [ ] `src/ui/hud.css`: HUD styling
- [ ] Sprites and icons in `public/assets/`: residents, sensors, relays, level tiles
- [ ] Sound: ambience, warning, cough, spark
- [ ] Title screen and end screens
- [ ] `public/assets/CREDITS.md` filled in
- [ ] Demo video (about 3 minutes, follows the demo script in the Build Spec doc)

## Rules
- `git pull` before you start and before you push.
- Short branches, merge to `main` when it runs. `main` must always build.
- Run `npm run build` and `npm test` before pushing.
- Do not change `src/sim/types.ts` without telling Naz.
- Never commit `.env` files or API keys.
