// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import DvoteappIDL from '../target/idl/dvoteapp.json'
import type { Dvoteapp } from '../target/types/dvoteapp'

// Re-export the generated IDL and type
export { Dvoteapp, DvoteappIDL }

// The programId is imported from the program IDL.
export const DVOTEAPP_PROGRAM_ID = new PublicKey(DvoteappIDL.address)

// This is a helper function to get the Dvoteapp Anchor program.
export function getDvoteappProgram(provider: AnchorProvider) {
  return new Program(DvoteappIDL as Dvoteapp, provider)
}

// This is a helper function to get the program ID for the Dvoteapp program depending on the cluster.
export function getDvoteappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Dvoteapp program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return DVOTEAPP_PROGRAM_ID
  }
}
