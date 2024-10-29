import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Dvoteapp} from '../target/types/dvoteapp'

describe('dvoteapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Dvoteapp as Program<Dvoteapp>

  const dvoteappKeypair = Keypair.generate()

  it('Initialize Dvoteapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        dvoteapp: dvoteappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([dvoteappKeypair])
      .rpc()

    const currentCount = await program.account.dvoteapp.fetch(dvoteappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Dvoteapp', async () => {
    await program.methods.increment().accounts({ dvoteapp: dvoteappKeypair.publicKey }).rpc()

    const currentCount = await program.account.dvoteapp.fetch(dvoteappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Dvoteapp Again', async () => {
    await program.methods.increment().accounts({ dvoteapp: dvoteappKeypair.publicKey }).rpc()

    const currentCount = await program.account.dvoteapp.fetch(dvoteappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Dvoteapp', async () => {
    await program.methods.decrement().accounts({ dvoteapp: dvoteappKeypair.publicKey }).rpc()

    const currentCount = await program.account.dvoteapp.fetch(dvoteappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set dvoteapp value', async () => {
    await program.methods.set(42).accounts({ dvoteapp: dvoteappKeypair.publicKey }).rpc()

    const currentCount = await program.account.dvoteapp.fetch(dvoteappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the dvoteapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        dvoteapp: dvoteappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.dvoteapp.fetchNullable(dvoteappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
