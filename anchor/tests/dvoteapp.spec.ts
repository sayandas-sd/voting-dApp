import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Dvoteapp} from '../target/types/dvoteapp'
import { BankrunProvider, startAnchor } from "anchor-bankrun";

const IDL = require('../target/idl/dvoteapp.json');

const votingAddress = new PublicKey("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

describe('Dvoteapp', () => {
 
  
  let context;
  let provider;
  let votingProgram:any;

  beforeAll(async ()=>{
    context =  await startAnchor("", [{name: "dvoteapp", programId: votingAddress}], []);
    provider = new BankrunProvider(context);

    votingProgram = new Program<Dvoteapp>(
      IDL,
      provider,
    );
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
      "chevrolet corvett c6",
      new anchor.BN(1),
    ).rpc();


    const [carAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("supra")],
      votingAddress
    )

    const carCandidate = await votingProgram.account.candidate.fetch(carAddress);
    console.log(carCandidate);

    if (carCandidate?.candidateVotes) {
      expect(carCandidate.candidateVotes.toNumber()).toEqual(0);
    } else {
      console.error('candidateVotes is undefined');
    }
  


    const [carAddressTwo] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("chevrolet corvett c6")],
      votingAddress
    )

    const carCandidateTwo = await votingProgram.account.candidate.fetch(carAddressTwo);
    console.log(carCandidateTwo);

    if (carCandidateTwo?.candidateVotes) {
      expect(carCandidateTwo.candidateVotes.toNumber()).toEqual(0);
    } else {
      console.error('candidateVotes is undefined');
    }
    

  })


  it('vote', async () => {
    await votingProgram.methods
      .vote(
        "chevrolet corvett c6",
        new anchor.BN(1),
      )
      .rpc()


      const [carAddressTwo] = PublicKey.findProgramAddressSync(
        [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("chevrolet corvett c6")],
        votingAddress
      )
  
      const carCandidateTwo = await votingProgram.account.candidate.fetch(carAddressTwo);
      console.log(carCandidateTwo);
      
      if (carCandidateTwo?.candidateVotes) {
        expect(carCandidateTwo.candidateVotes.toNumber()).toEqual(1);
      } else {
        console.error('candidateVotes is undefined');
      }

  });
  
})
