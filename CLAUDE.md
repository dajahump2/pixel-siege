# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository

Browser games built with pure HTML5 Canvas + vanilla JavaScript. No build step, no dependencies, no package manager. Each game is a single self-contained `.html` file.

**GitHub:** https://github.com/dajahump2/pixel-siege  
**Branch:** `master`

## Running the Games

Open directly in a browser — no server needed:
```
start shooter.html
start tictactoe.html
```

After any completed task, commit the changed files and push:
```
git add <changed files>
git commit -m "descriptive message"
git push origin master
```

## Architecture: shooter.html (Pixel Siege)

Everything lives in one `<script>` block, organized in declaration order:

| Section | Purpose |
|---|---|
| `const C = {...}` | All magic numbers and colors — edit here first before touching logic |
| `Input` object | Keyboard (`keys` map) + mouse state; call `Input.flush()` at end of each frame to reset `justClicked` |
| `Particles` object | Unified particle pool; `spawnDeath()` and `spawnMuzzleFlash()` are the two entry points |
| `Bullet` class | Stores a 6-position trail array for the fading yellow streak effect |
| `Enemy` base class + `EnemyGrunt / EnemyCharger / EnemyTank` | All share `hit()`, `isDone()`, `deathTimer` lifecycle; override `update()` and `draw()` |
| `Player` class | `update()` handles movement, aim, and firing in one pass |
| `LEVELS` array + `WaveManager` object | `LEVELS` defines wave counts/spawn rates; `WaveManager` drives spawning and calls `transitionTo(STATE.LEVEL_CLEAR)` when done |
| `transitionTo(state)` | Single function for all state changes; handles side effects (HP restore, score snapshot, etc.) |
| `buildBg()` | Pre-renders the checkerboard floor to an offscreen canvas once; `draw()` stamps it with `drawImage` |
| `update(dt, now)` | Dispatches by `gameState`; runs bullets → enemies → collision → particles in PLAYING mode |
| `draw()` | Dispatches by `gameState`; always redraws from background up, scanlines last |
| `gameLoop(timestamp)` | Fixed-timestep accumulator (16.67 ms steps, 100 ms delta cap) |

**State machine:** `MENU → PLAYING → LEVEL_CLEAR → PLAYING` (loop) or `PLAYING → GAME_OVER → MENU`

**Adding a new enemy type:** subclass `Enemy`, override `update(dt, px, py)` and `draw(ctx)`, add to `spawnEnemy()` probability block.

**Adding a new level:** append an entry to the `LEVELS` array. Beyond index 3, `WaveManager` auto-scales spawn rate by `×0.85` per extra clear.

**Mouse coordinate correction:** `Input` applies a `(C.W / rect.width)` scale factor so mouse aim stays accurate when the canvas is CSS-scaled on smaller screens.

## Architecture: tictactoe.html

Simple standalone — `<style>`, a 3×3 grid of `.cell` divs, and an inline `<script>` with a flat `board[]` array, a `checkWin()` loop over the 8 win patterns, and a score object. No classes.
