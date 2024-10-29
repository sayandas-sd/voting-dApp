#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod dvoteapp {
    use super::*;

  pub fn close(_ctx: Context<CloseDvoteapp>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.dvoteapp.count = ctx.accounts.dvoteapp.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.dvoteapp.count = ctx.accounts.dvoteapp.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeDvoteapp>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.dvoteapp.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeDvoteapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Dvoteapp::INIT_SPACE,
  payer = payer
  )]
  pub dvoteapp: Account<'info, Dvoteapp>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseDvoteapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub dvoteapp: Account<'info, Dvoteapp>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub dvoteapp: Account<'info, Dvoteapp>,
}

#[account]
#[derive(InitSpace)]
pub struct Dvoteapp {
  count: u8,
}
