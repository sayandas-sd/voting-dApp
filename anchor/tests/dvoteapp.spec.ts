import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Dvoteapp} from '../target/types/dvoteapp'
import { BankrunProvider, startAnchor } from "anchor-bankrun";

const IDL = require('../target/idl/dvoteapp.json');

const votingAddress = new PublicKey("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

describe('Dvoteapp', () => {
 
 
  it('Initialize Poll', async () => {
    const context =  await startAnchor("", [{name: "dvoteapp", programId: votingAddress}], []);
    const provider = new BankrunProvider(context);

    const votingProgram = new Program<Dvoteapp>(
      IDL,
      provider,
    );


    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "what is your peanut butter?",
      new anchor.BN(0), 
      new anchor.BN(1830217343),
    ).rpc();

    
    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingAddress
    )

    const poll = await votingProgram.account.poll.fetch(pollAddress);

    console.log(poll);

  })
})
