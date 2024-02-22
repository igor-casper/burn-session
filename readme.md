CSPR Burn Session
============

This project builds Casper Network session WASM that effectively purges
the purse of the caller and reduces the total supply of tokens circulating
in the network.

In order to build, use ``make build``. This assumes you have a basic Rust
setup including the wasm target. Additionally, wasm-strip is used to reduce
the size of the built wasm. It's recommended you install wabt before building
this project.

I advise against testing this on the mainnet, unless you know what you're
doing.