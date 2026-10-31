// Generates the app's UI sounds as small mono WAV files, so they can be tuned without an audio
// editor. Run from apps/mobile: `node scripts/generate-sounds.mjs`. The output is committed.
import { Buffer } from 'node:buffer';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RATE = 22050;
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'sounds');

/** A decaying tone made of [ratio, amplitude] partials over a base frequency. */
function tone(samples, { start, freq, partials, decay, gain, glide = 0 }) {
  const offset = Math.round(start * RATE);
  for (let i = 0; offset + i < samples.length; i++) {
    const t = i / RATE;
    const f = freq * (1 - glide * Math.min(t / 0.3, 1));
    const attack = Math.min(t / 0.004, 1);
    const envelope = attack * Math.exp(-t / decay);
    let value = 0;
    for (const [ratio, amplitude] of partials) {
      value += amplitude * Math.sin(2 * Math.PI * f * ratio * t);
    }
    samples[offset + i] += gain * envelope * value;
  }
}

function render(seconds, tones) {
  const samples = new Float32Array(Math.round(seconds * RATE));
  for (const t of tones) tone(samples, t);
  // Fade the tail so no file ends on a click.
  const fade = Math.round(0.03 * RATE);
  for (let i = 0; i < fade; i++) samples[samples.length - 1 - i] *= i / fade;
  return samples;
}

function wav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) =>
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), i * 2),
  );
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

const sounds = {
  // A soft latch: two quick, close partials that read as a click without being sharp.
  link: render(0.16, [
    {
      start: 0,
      freq: 1320,
      partials: [
        [1, 0.6],
        [0.5, 0.4],
      ],
      decay: 0.025,
      gain: 0.35,
    },
    {
      start: 0.045,
      freq: 990,
      partials: [
        [1, 0.5],
        [0.5, 0.3],
      ],
      decay: 0.03,
      gain: 0.25,
    },
  ]),
  // A muted low note that sags slightly: "not quite", never an error buzzer.
  miss: render(0.45, [
    {
      start: 0,
      freq: 196,
      partials: [
        [1, 0.8],
        [2, 0.2],
      ],
      decay: 0.12,
      gain: 0.35,
      glide: 0.1,
    },
  ]),
  // A warm rising fifth with bell-like overtones for closing a case.
  solved: render(1.7, [
    {
      start: 0,
      freq: 392,
      partials: [
        [1, 0.7],
        [2, 0.2],
        [2.76, 0.08],
      ],
      decay: 0.55,
      gain: 0.3,
    },
    {
      start: 0.18,
      freq: 587.33,
      partials: [
        [1, 0.7],
        [2, 0.18],
        [2.76, 0.07],
      ],
      decay: 0.65,
      gain: 0.3,
    },
  ]),
};

mkdirSync(out, { recursive: true });
for (const [name, samples] of Object.entries(sounds)) {
  writeFileSync(join(out, `${name}.wav`), wav(samples));
  console.log(`${name}.wav  ${(samples.length / RATE).toFixed(2)}s`);
}
