'use client'

import {getDvoteappProgram, getDvoteappProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function useDvoteappProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getDvoteappProgramId(cluster.network as Cluster), [cluster])
  const program = getDvoteappProgram(provider)

  const accounts = useQuery({
    queryKey: ['dvoteapp', 'all', { cluster }],
    queryFn: () => program.account.dvoteapp.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['dvoteapp', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ dvoteapp: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useDvoteappProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useDvoteappProgram()

  const accountQuery = useQuery({
    queryKey: ['dvoteapp', 'fetch', { cluster, account }],
    queryFn: () => program.account.dvoteapp.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['dvoteapp', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ dvoteapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['dvoteapp', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ dvoteapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['dvoteapp', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ dvoteapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['dvoteapp', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ dvoteapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
