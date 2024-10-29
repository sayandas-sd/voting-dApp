#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod dvoteapp {
    use super::*;

    pub fn initialize_poll(ctx: Context<InitializePoll>, poll_id: u64) -> Result<()> {
      OK(())
    }
}


#[derive(Accounts)]

pub struct InitializePoll<'info> {
  #[account(mut)]
  pub siger: Signer<'info>,

  #[account()]
  pub poll: Account<'info, Poll>,
}

#[account]
pub struct Poll {
  pub poll_id: u64,
  pub description: String,
  pub poll_start: u64,
  pub poll_end: u64,
  pub candidate_amount: u64,
}