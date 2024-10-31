import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Dvoteapp} from '../target/types/dvoteapp'
import { BankrunProvider, startAnchor } from "anchor-bankrun";

const IDL = require('../target/idl/dvoteapp.json');

const votingAddress = new PublicKey("5bTrHzxMCi5mz3hKrcAmu81pd4gHcjWTTYHWjp2uzqvi");

describe('Dvoteapp', () => {
 
  
  let context;
  let provider;
  
  anchor.setProvider(anchor.AnchorProvider.env());

  let votingProgram = anchor.workspace.Dvoteapp as Program<Dvoteapp>;

  beforeAll(async ()=>{
    /*context =  await startAnchor("", [{name: "dvoteapp", programId: votingAddress}], []);
    provider = new BankrunProvider(context);

    votingProgram = new Program<Dvoteapp>(
      IDL,
      provider,
    );*/
  })
 
  it('Initialize Poll', async () => {


    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "what is your favorite car",
      new anchor.BN(0), 
      new anchor.BN(1830217343),
    ).rpc();

    
    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingAddress
    )

    const poll = await votingProgram.account.poll.fetch(pollAddress);

    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("what is your favorite car");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());

  })


  it('Initialize Candidate', async () => {

    await votingProgram.methods.initializeCandidate(
      "supra",
      new anchor.BN(1),
    ).rpc();

     
    await votingProgram.methods.initializeCandidate(
      "dodge",
      new anchor.BN(1),
    ).rpc();


    const [carAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("supra")],
      votingAddress
    )

    const carCandidate = await votingProgram.account.candidate.fetch(carAddress);
    console.log(carCandidate);

    if (carCandidate?.candidateVote) {
      expect(carCandidate.candidateVote.toNumber()).toEqual(0);
    } else {
      console.error('candidateVotes is undefined');
    }
  


    const [carAddressTwo] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("dodge")],
      votingAddress
    )

    const carCandidateTwo = await votingProgram.account.candidate.fetch(carAddressTwo);
    console.log(carCandidateTwo);

    if (carCandidateTwo?.candidateVote) {
      expect(carCandidateTwo.candidateVote.toNumber()).toEqual(0);
    } else {
      console.error('candidateVotes is undefined');
    }
    

  })


  it('vote', async () => {
    await votingProgram.methods
      .vote(
        "dodge",
        new anchor.BN(1),
      )
      .rpc()


      const [carAddressTwo] = PublicKey.findProgramAddressSync(
        [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("dodge")],
        votingAddress
      )
  
      const carCandidateTwo = await votingProgram.account.candidate.fetch(carAddressTwo);
      console.log(carCandidateTwo);
      
      if (carCandidateTwo?.candidateVote) {
        expect(carCandidateTwo.candidateVote.toNumber()).toEqual(1);
      } else {
        console.error('candidateVotes is undefined');
      }

  });
  
})
