#![no_main]
#![no_std]

extern crate alloc;

use alloc::vec;
use casper_contract::contract_api::{account, runtime, system};
use casper_types::{runtime_args, RuntimeArgs};

pub const BURN_ENTRYPOINT: &str = "burn";
pub const ARG_PURSES: &str = "purses";

#[no_mangle]
pub extern "C" fn call() {
    let caller_purse = account::get_main_purse();
    let burn_purses = vec![caller_purse];

    let _: () = runtime::call_contract(
        system::get_mint(),
        BURN_ENTRYPOINT,
        runtime_args! {
            ARG_PURSES => burn_purses
        },
    );
}