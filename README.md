# Lantern

**A community-run truth and survival network for the Hollow, playable as a browser game.**

Built for the Life underground track at Patriot HackFest Fall 2026.

- Play: https://lantern-lemon.vercel.app
- Demo video: `TODO: video link`
- Team: Naz, Sophia, Kevin, Nashwan (see [Team and roles](#team-and-roles))

## The story

In 2087 the surface is unlivable and two billion people live in the Hollow, a network of cities stacked in old mines and tunnels. The Directorate controls the air, the network and every route between levels. Power is rationed, the water in the deep levels is making people sick, and the official numbers do not match what people see.

Lantern is what the residents build in response: sensors they own, a mesh network the Directorate cannot switch off, and an honest way to find out whether the surface is safe.

## The game

You play a community operator on level 12. The core mechanic is **fog of truth**: the map shows the Directorate's numbers ("water safe, power normal, cough rate 4") until you build a Lantern sensor in a room. Then you see what is really happening there.

Each turn of the scripted disaster you can:

1. Place sensors, mesh relays and shaft links with your build points.
2. Read early warnings, such as "power cut in about 12 hours" or "water turns unsafe in 9 hours".
3. Split scarce power, water and food between levels, using either the Directorate's top-down rule or a fair share weighted toward the hardest hit levels.
4. Keep families connected after the Directorate cuts the network. Check-in messages hop across the mesh you built.
5. Read the surface probes, then choose who goes up first.

You win if the deep levels survive and you confirm the surface. You lose if a level goes dark with no warning and no mesh path to help it.

## Problems covered

Five features on one shared data layer cover 10 of the 15 problems in the brief.

| Feature | Problems |
| --- | --- |
| Fog of truth sensors | #4 bad water, #9 real outbreak numbers |
| Early warnings | #1 blackouts, #3 heat, #4 bad water |
| Mesh and check-ins | #7 network shutdown, #8 split families |
| Fair-share allocation | #2 sharing power, water and food |
| Surface verdict and ascent | #13 prove the surface, #14 who goes first, #15 plan the move |

Not built: #5 tunnels, #6 space, #10 medicine, #11 sunlight, #12 food growing. See the roadmap.

## How it works

Everything runs in the browser. There is no backend.

- **Simulation core (`src/sim`)**: pure TypeScript, seeded and deterministic, with tests. It holds the disaster timeline, a trend forecaster, the fair-share allocator, the mesh spread, and the surface verdict.
  - **Forecaster**: fits a short linear trend to each sensor series and projects when it crosses a danger line.
  - **Fair share**: weighted max-min allocation. Everyone gets the same fraction of their need, scaled by heat and sickness, and no one gets more than they asked for.
  - **Mesh**: store-and-forward relay between nearby nodes, with shaft nodes linking levels. Each handoff can fail.
  - **Surface verdict**: takes one median per probe cluster, then a robust median across clusters, and rejects outlier clusters. A flood of fake probes from one group counts once.
  - **Signed readings**: sensor readings are signed and added to a hash-chained log, so history cannot be quietly rewritten. This is the mechanism simulated in the browser, not a real distributed ledger.
- **Game (`src/game`)**: Phaser 3 scenes for the map, residents, lights, taps, coughing and check-in sparks.
- **HUD (`src/ui`)**: plain HTML and CSS for the warning feed, the Directorate vs Lantern panel, and the allocation choice.

The game shows `official` values until a level is `sensed`, then shows `truth`.

```ts
// src/sim/types.ts
export type Kind = 'voltage' | 'temp' | 'water' | 'cough';
export interface LevelState { level: number; truth: Record<Kind, number>; official: Record<Kind, number>; sensed: boolean; powered: boolean; }
export interface Alert { level: number; kind: Kind; eta: number; severity: 'watch' | 'high' | 'critical'; }
export interface WorldState { tick: number; levels: LevelState[]; alerts: Alert[]; netUp: boolean; supply: number; }
export interface Sim { reset(seed: number): WorldState; step(): WorldState; act(a: { type: 'sensor' | 'relay' | 'shaft'; level: number; x: number }): WorldState; }
```

## Everything here is simulated

There is no real Hollow. The disaster, the sensor readings, the mesh and the surface probes are all simulated and scripted so every run tells the same story. Nothing in the game is real data.

## Run it locally

```bash
npm install
npm run dev      # start the game at http://localhost:5173
npm test         # run the simulation tests
npm run build    # production build in dist/
```

## Team and roles

| Person | Role | Owns |
| --- | --- | --- |
| Naz ([@nasnasbro55-design](https://github.com/nasnasbro55-design)) | Simulation lead and integration | `src/sim/`, `src/sim/types.ts`, tests, final submission check |
| Kevin | Game and graphics lead | `src/game/`, Phaser map, sprites, lights, taps, coughing, check-in sparks |
| Nashwan ([@nashCoder2003](https://github.com/nashCoder2003)) | HUD and UI lead | `src/ui/`, warning feed, Directorate vs Lantern panel, allocation screen, menus, win and lose flow |
| Sophia | Art, sound and presentation | `public/assets/`, palette, sprites, icons, sound, title and end screens, demo video, asset credits |

Roles are the starting split. Swap or share work as needed, but tell the owner of a folder before changing their files.

## Project structure

```text
lantern/
  README.md             this file
  TASKS.md              who does what, with checklists
  index.html            page shell with #game and #hud containers
  package.json          scripts and dependencies
  tsconfig.json         TypeScript config
  public/
    assets/             art and sound files (Sophia)
      CREDITS.md        source and license for every asset (Sophia)
  src/
    main.ts             starts the Phaser game (Naz)
    sim/                simulation core, no Phaser imports (Naz and Kevin)
      types.ts          shared data contract: Kind, LevelState, Alert, WorldState, Sim (Naz)
      index.ts          public exports
      world.ts          scripted disaster timeline, truth vs official values (Naz)
      forecaster.ts     trend forecaster and early warnings (Kevin)
      allocator.ts      fair-share vs Directorate allocation (Kevin)
      mesh.ts           mesh relays, shaft links, check-ins (Kevin)
      verdict.ts        surface probe verdict (Kevin)
      ledger.ts         signed readings and hash-chained log (Kevin)
      *.test.ts         Vitest tests next to each file (Kevin)
    game/               Phaser scenes (Naz)
      MapScene.ts       Hollow map scene
    ui/                 HTML and CSS HUD (Nashwan and Sophia)
      WarningFeed.ts    early warning feed (Nashwan)
      DirectoratePanel.ts  Directorate vs Lantern panel (Nashwan)
      AllocationScreen.ts  allocation choice screen (Nashwan)
      EndScreens.ts     win and lose flow (Nashwan logic, Sophia look)
      hud.css           HUD styling (Sophia)
```

Most files are stubs with a TODO comment and the function signature to fill in. Open your files and start there. See `TASKS.md` for the checklist.

The game reads state only through the `Sim` interface in `src/sim/types.ts`. If you need a new field, ask Naz first so the sim and the UI stay in step.

## Working together

- Pull before you start and before you push: `git pull`.
- Work on a short branch (`git checkout -b yourname/feature`) and merge to `main` when it runs. `main` must always build.
- Run `npm run build` and `npm test` before pushing.
- Never commit `.env` files or API keys.
- Deadline: building ends Fri Nov 20 at 11 PM. No edits after submission.

## Stack

TypeScript, Vite, Phaser 3, Vitest, WebCrypto Ed25519 for signed readings. Deployed as a static site.

## Status

- [ ] Hollow map with 12 levels, fog of truth, sensor placement
- [ ] Scripted disaster timeline and warning feed
- [ ] Win and lose screen
- [ ] Mesh building, network cut and check-in sparks
- [ ] Fair-share vs Directorate allocation choice
- [ ] Lights, brown taps and coughing animation
- [ ] Surface probe verdict and ascent choice
- [ ] Sound and polish

## Roadmap

Problems not covered yet: tunnel safety and flooding, crowding and shared space, medicine and remote care, sunlight and sleep tracking, and neighborhood food growing. A leaderboard, saved runs, shareable scenario links, and a real multi-device mesh demo are possible next steps.

## Credits

- Art and sound: `TODO: list asset sources and licenses`
- Built with help from AI tools, which the event rules allow.
- Patriot HackFest is run by PatriotHacks, the Computer Science Club and HackOverflow at George Mason University.
