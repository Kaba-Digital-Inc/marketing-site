# Rive scenes

`engagement/` is the progress rail under the four Hairline figures in "How an engagement runs" on the homepage. It is authored with the Rive CLI
(`~/.rive/bin/rive`) as plain files, not in the Rive editor.

- `generate.py` writes `engagement/scene.rml` (the scene, animations, state machine, and the `step` view model).
- The built file the site loads is `public/rive/engagement.riv`. The Rive web runtime's wasm is `public/rive/rive.wasm`
  (copied from `node_modules/@rive-app/canvas/rive.wasm`, so no third-party CDN is used).

Rebuild after editing the generator or images:

```bash
export PATH="$HOME/.rive/bin:$PATH"
python3 rive/generate.py
rive rive/engagement --verify          # compile check
rive rive/engagement                   # live preview window
rive rive/engagement --once            # writes rive/engagement/build/engagement.riv
cp rive/engagement/build/engagement.riv public/rive/engagement.riv
```

Draw order in Rive is front-to-back: the first sibling is on top (the generator builds back-to-front, then reverses).
The scene reads one number, `step` (0 to 3). `src/components/EngagementJourney.tsx` writes it from the step buttons and
reads it back when a node inside the scene is clicked.
