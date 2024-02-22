build:
	cargo build --release --target wasm32-unknown-unknown --no-default-features
	wasm-strip target/wasm32-unknown-unknown/release/session.wasm

clean:
	cargo clean