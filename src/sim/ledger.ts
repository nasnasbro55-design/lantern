export interface Entry { prevHash: string; hash: string; payload: string; signature: string }

const genesis = '0'.repeat(64);
const encoder = new TextEncoder();
let signingKey: Promise<CryptoKeyPair> | undefined;

export async function append(log: Entry[], payload: string): Promise<Entry[]> {
  const snapshot = log.map(entry => ({ ...entry }));
  const keys = await getSigningKey();
  const prevHash = snapshot.at(-1)?.hash ?? genesis;
  const hash = await entryHash(prevHash, payload);
  const signature = toHex(await crypto.subtle.sign('Ed25519', keys.privateKey, encoder.encode(hash)));
  return [...snapshot, { prevHash, hash, payload, signature }];
}

export async function verify(log: Entry[]): Promise<boolean> {
  if (!log.length) return true;
  const keys = await getSigningKey();
  let previous = genesis;
  for (const entry of log) {
    if (entry.prevHash !== previous || !/^[0-9a-f]{128}$/.test(entry.signature)) return false;
    const hash = await entryHash(previous, entry.payload);
    if (entry.hash !== hash) return false;
    const signature = Uint8Array.from(entry.signature.match(/../g)!, byte => parseInt(byte, 16));
    if (!await crypto.subtle.verify('Ed25519', keys.publicKey, signature, encoder.encode(hash))) return false;
    previous = hash;
  }
  return true;
}

function getSigningKey(): Promise<CryptoKeyPair> {
  // The simulated sensor has one signing identity per running session.
  signingKey ??= crypto.subtle.generateKey('Ed25519', false, ['sign', 'verify']);
  return signingKey;
}

async function entryHash(previous: string, payload: string): Promise<string> {
  const bytes = encoder.encode(JSON.stringify([previous, payload]));
  return toHex(await crypto.subtle.digest('SHA-256', bytes));
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), byte => byte.toString(16).padStart(2, '0')).join('');
}
