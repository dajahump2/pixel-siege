/**
 * Generate PokOracleV1 voiceover — ElevenLabs TTS
 *
 * ⚠️  VOICE ID — update VOICE_ID below once you have the Michael Scott voice ID:
 *     1. Open elevenlabs.io → Voice Library → find your Michael Scott voice
 *     2. Click the voice → copy the voice_id from the URL or the "API" tab
 *     3. Replace the string below and re-run this script
 *
 *  Run with:  node scripts/generate-pokoracle-vo.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// ─── CONFIG ──────────────────────────────────────────────────────────────────

// ⚠️  SWAP THIS to the Michael Scott voice_id from your ElevenLabs account
const VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // placeholder: Adam (warm, clear narrator)

const MODEL = 'eleven_multilingual_v2';
const OUTPUT_FORMAT = 'mp3_44100_128'; // 128kbps — standard tier compatible

const VOICE_SETTINGS = {
  stability: 0.50,
  similarity_boost: 0.75,
  style: 0.20,               // style_exaggeration
  use_speaker_boost: true,
};

const FPS = 30;
const LEAD_IN = 15;          // 0.5s breath before VO starts in each scene
const HOLD_END = 20;         // 0.67s visual hold after VO ends
const MIN_SCENE_FRAMES = 90; // 3s minimum per scene
const TRANSITION_FRAMES = 12;

// ─── SCENE SCRIPTS ───────────────────────────────────────────────────────────
// Scene 1 (Hook) has no voiceover — just a 3-second title hold.
// NOTE: The opening paragraph ("Most recreational poker players have the same leak...")
// is not assigned to a specific scene in the sync map. You can add it to a
// separate intro segment or let Scene 1 run silent as specified.

const SCENES = [
  {
    id: 1,
    key: 'scene1',
    audio: null, // no voiceover — 3-second logo/title hold
  },
  {
    id: 2,
    key: 'scene2',
    audio: `Here's what that looks like at the table.

You're on the button. UTG raises. Two players in middle position call. The action gets to you and you look down at jack-nine suited. You think — I've got position, I've got a decent hand, I'll see a flop. So you call.`,
  },
  {
    id: 3,
    key: 'scene3',
    audio: `That decision felt fine. But it was the wrong question that got you there.

The question you asked was: do I like my hand?

The question you should have asked was: is my hand strong enough to play against what they're likely to have?`,
  },
  {
    id: 4,
    key: 'scene4',
    audio: `Think about what just happened before the action reached you.

UTG raised. Under the gun is the earliest position at the table — a player who chose to raise knowing every other player acts after them. That range is strong. Premium pairs. Ace-king. Ace-queen. Strong broadway hands. They are not doing this with jack-nine suited. Or worse.

Then two middle position players called. They have something too — not strong enough to raise, but strong enough to put chips in against an early position raiser. Pairs. Suited connectors. Strong aces.

Now there are three players in this pot ahead of you — with collectively strong ranges — and you're considering calling with jack-nine suited.

Your hand didn't get worse. But it got a lot less impressive the moment you started thinking about what they could have.`,
  },
  {
    id: 5,
    key: 'scene5',
    audio: `This is the root cause of playing too many hands. Rec players evaluate their cards in isolation. Jack-nine suited looks like a reasonable hand — until you consider who you're up against. If you flop a jack, someone with ace-jack or king-jack has you dominated. If you flop a nine, you could be drawing thin against a higher pocket pair. Even your flush draw might be second best if someone else holds a higher flush draw. Your hand isn't just behind — it's behind in ways that are hard to see and expensive to learn.

And here's another question worth asking before you call: what are you actually hoping to flop? With jack-nine suited against an early position raiser and two callers, you need something close to perfect — a straight draw on a board like seven-eight-ten, or a flush draw with the right cards. Top pair, second pair, even two pair — none of those are comfortable. You could be winning and still be losing.

And it gets worse. Even if the flop comes out low — say two-five-eight — and nobody seems to have hit anything, you're still likely behind. At least one of your opponents is probably holding an ace, a king, or a queen. Your jack-nine might be live, but you'll never feel confident that you're winning. So your only option will be to bluff.`,
  },
  {
    id: 6,
    key: 'scene6',
    audio: `Jack-nine suited on the button felt like a reasonable call. Against that field, it never was. And the only reason it felt fine is because you were asking the wrong question.

Here's the shift.

You don't need to put anyone on an exact hand. That's not the goal. The goal is to ask — what hands make sense given their position and how they've acted? UTG raising tells you something. Middle position calling tells you something. Every action is information. Your job is to use it.

When you start asking that question — before you call, before you bet, before you fold — you stop guessing and start making informed decisions.

That one shift will help you fold more marginal hands preflop than memorizing any hand chart ever will. Not because of a rule. But because you understand why.`,
  },
  {
    id: 7,
    key: 'scene7',
    audio: `Before you call — ask: is my hand strong enough to play against what they're likely to have? And if the answer is yes — if you genuinely believe your hand is strong enough — then ask yourself one more question: why aren't you raising? But that's a lesson for another video.

That's it. One question. Take it to your next session.

If this changed how you think about the game, subscribe. Every video in this series gives you one concept that makes you a harder player to beat.`,
  },
];

// ─── MP3 DURATION PARSER ─────────────────────────────────────────────────────
// CBR 192kbps: file_size / (192000 / 8) = file_size / 24000
// VBR: look for Xing header, fall back to CBR estimate
function getMp3Duration(buffer) {
  let offset = 0;

  // Skip ID3v2 tag if present
  if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) {
    const flags = buffer[5];
    const hasFooter = (flags & 0x10) !== 0;
    const id3Size =
      ((buffer[6] & 0x7F) << 21) |
      ((buffer[7] & 0x7F) << 14) |
      ((buffer[8] & 0x7F) << 7) |
      (buffer[9] & 0x7F);
    offset = 10 + id3Size + (hasFooter ? 10 : 0);
  }

  // Scan for first valid sync word
  const sampleRateTable = [[44100, 48000, 32000], [22050, 24000, 16000], [11025, 12000, 8000]];
  const bitrateTableV1L3 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320];

  while (offset < buffer.length - 4) {
    if (buffer[offset] === 0xFF && (buffer[offset + 1] & 0xE0) === 0xE0) {
      const b1 = buffer[offset + 1];
      const b2 = buffer[offset + 2];

      const versionBits = (b1 >> 3) & 0x3; // 3 = MPEG1
      const layerBits = (b1 >> 1) & 0x3;   // 1 = Layer 3
      const bitrateBits = (b2 >> 4) & 0xF;
      const sampleBits = (b2 >> 2) & 0x3;

      if (versionBits === 3 && layerBits === 1 && bitrateBits > 0 && bitrateBits < 15 && sampleBits < 3) {
        const bitrate = bitrateTableV1L3[bitrateBits] * 1000; // bps
        const sampleRate = sampleRateTable[0][sampleBits];    // MPEG1

        // Check for Xing/Info VBR header (sits after 32-byte side info for MPEG1 stereo)
        const xingOff = offset + 4 + 32;
        const tag = buffer.slice(xingOff, xingOff + 4).toString('ascii');
        if ((tag === 'Xing' || tag === 'Info') && buffer.length > xingOff + 12) {
          const flags = (buffer[xingOff + 4] << 24) | (buffer[xingOff + 5] << 16) | (buffer[xingOff + 6] << 8) | buffer[xingOff + 7];
          if (flags & 0x1) {
            const frameCount = (buffer[xingOff + 8] << 24) | (buffer[xingOff + 9] << 16) | (buffer[xingOff + 10] << 8) | buffer[xingOff + 11];
            return (frameCount * 1152) / sampleRate;
          }
        }

        // CBR fallback: (file_size - offset) / bytes_per_second
        const bytesPerSec = bitrate / 8;
        return (buffer.length - offset) / bytesPerSec;
      }
    }
    offset++;
  }

  // Last resort: assume 128kbps
  return buffer.length / 16000;
}

// ─── API ─────────────────────────────────────────────────────────────────────
const envContent = fs.readFileSync(path.join(ROOT, '.env'), 'utf-8');
const API_KEY = envContent.match(/ELEVENLABS_API_KEY=([^\r\n]+)/)?.[1]?.trim();
if (!API_KEY) throw new Error('ELEVENLABS_API_KEY not found in .env');

const OUT_DIR = path.join(ROOT, 'public', 'pokoracle');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function generateScene(scene) {
  const outPath = path.join(OUT_DIR, `vo-${scene.key}.mp3`);

  // Skip if already exists (re-run idempotency)
  if (fs.existsSync(outPath)) {
    const buf = fs.readFileSync(outPath);
    const dur = getMp3Duration(buf);
    process.stdout.write(`  scene${scene.id}  ✓ cached  (${dur.toFixed(1)}s, ${Math.round(buf.length/1024)}KB)\n`);
    return dur;
  }

  process.stdout.write(`  scene${scene.id}  generating... `);

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=${OUTPUT_FORMAT}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: scene.audio,
      model_id: MODEL,
      voice_settings: VOICE_SETTINGS,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs ${res.status}: ${err}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);

  const dur = getMp3Duration(buf);
  process.stdout.write(`${dur.toFixed(1)}s  (${Math.round(buf.length/1024)}KB)\n`);
  return dur;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
console.log('\n🎙  PokOracleV1 voiceover generation\n');
console.log(`   Voice ID   : ${VOICE_ID}`);
console.log(`   Model      : ${MODEL}`);
console.log(`   Format     : ${OUTPUT_FORMAT}\n`);
if (VOICE_ID === 'pNInz6obpgDQGcFmaJgB') {
  console.log('   ⚠️  Using Adam placeholder voice. Update VOICE_ID with the Michael Scott voice_id.\n');
}

const sceneDurSecs = [];
for (const scene of SCENES) {
  if (!scene.audio) {
    // Scene 1: no audio, fixed 3-second hold
    sceneDurSecs.push(null);
    console.log(`  scene1  (no audio — 3s title hold)`);
    continue;
  }
  // Throttle: 700ms between calls to avoid rate limit
  if (scene.id > 2) await new Promise(r => setTimeout(r, 700));
  const dur = await generateScene(scene);
  sceneDurSecs.push(dur);
}

// ─── COMPUTE FRAME TIMINGS ───────────────────────────────────────────────────
const sceneDurationFrames = SCENES.map((s, i) => {
  if (!s.audio) return MIN_SCENE_FRAMES; // Scene 1: 90 frames (3s)
  const audioFrames = Math.ceil(sceneDurSecs[i] * FPS);
  return Math.max(MIN_SCENE_FRAMES, audioFrames + LEAD_IN + HOLD_END);
});

// Absolute start frames in composition timeline (with transition overlap)
const sceneStartFrames = [0];
for (let i = 1; i < sceneDurationFrames.length; i++) {
  sceneStartFrames.push(sceneStartFrames[i - 1] + sceneDurationFrames[i - 1] - TRANSITION_FRAMES);
}

const totalFrames = sceneStartFrames[sceneStartFrames.length - 1] + sceneDurationFrames[sceneDurationFrames.length - 1];

// ─── WRITE voTimings.ts ───────────────────────────────────────────────────────
const durSecsStr = sceneDurSecs.map(d => d === null ? 'null' : d.toFixed(2)).join(', ');
const ts = `// Auto-generated by scripts/generate-pokoracle-vo.mjs — do not edit manually.
// Voice ID used: ${VOICE_ID}
export const FPS = ${FPS};
export const SCENE_DURATIONS_S: (number | null)[] = [${durSecsStr}];
export const SCENE_DURATION_FRAMES: number[] = [${sceneDurationFrames.join(', ')}];
export const SCENE_START_FRAMES: number[] = [${sceneStartFrames.join(', ')}];
export const TOTAL_FRAMES = ${totalFrames};
`;

const timingsPath = path.join(ROOT, 'src', 'PokOracleV1', 'voTimings.ts');
fs.writeFileSync(timingsPath, ts);

// ─── SUMMARY ─────────────────────────────────────────────────────────────────
console.log('\n--- Scene durations ---');
SCENES.forEach((s, i) => {
  const dur = sceneDurSecs[i];
  const frames = sceneDurationFrames[i];
  const start = sceneStartFrames[i];
  const label = dur === null ? `3.0s (no audio)` : `${dur.toFixed(1)}s audio → ${frames}f (${(frames/FPS).toFixed(1)}s scene)`;
  console.log(`  Scene ${s.id}  start=${start}f  ${label}`);
});
console.log(`\n  Total: ${totalFrames}f = ${(totalFrames/FPS).toFixed(1)}s\n`);
console.log('✓  public/pokoracle/ MP3s written');
console.log('✓  src/PokOracleV1/voTimings.ts written\n');
