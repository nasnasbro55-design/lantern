// Owner: Kevin. Signed readings in a hash-chained log (simulated, not a real distributed ledger).
export interface Entry { prevHash: string; hash: string; payload: string; signature: string }

export async function append(log: Entry[], payload: string): Promise<Entry[]> {
  // TODO: sign with WebCrypto Ed25519, hash payload + prevHash, append
  void payload;
  return log;
}

export async function verify(log: Entry[]): Promise<boolean> {
  // TODO: recompute hashes and check signatures
  void log;
  return true;
}
