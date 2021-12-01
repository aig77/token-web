const { assert, AssertionError } = require("chai");
const Web3 = require('web3');

const Token = artifacts.require("MyToken");

require("chai")
    .use(require("chai-as-promised"))
    .should()

contract("Token", (accounts) => {
    let contract
    let startingSupply
    const name = "Tokenx"
    const symbol = "NFT"
    const baseURI = ""
    const unrevealedURI = "caca"
    let uris = [];
    for(let i = 0; i < 50; ++i) {
        uris.push(i.toString());
    }

    before(async () => {
        contract = await Animix.deployed()
    })
    describe("deployment", async () => {
        it("deployed successfully", async () => {
            contract = await Animix.new(
                name, 
                symbol, 
                baseURI, 
                unrevealedURI, 
                { from: accounts[0] }
            )
            const address = contract.address
            assert.notEqual(address, '')
            assert.notEqual(address, 0x0)
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
        it("has a name", async () => {
            const name = await contract.name()
            assert.equal(name, "Token")
        })
        it("has a symbol", async () => {
            const symbol = await contract.symbol()
            assert.equal(symbol, "NFT")
        })
    })
    describe("minting", async () => {
        it("creates a new token for user 0", async () => {
            const result = await contract.safeMint(1, {from: accounts[0]})
            const supply = await contract.totalSupply()
            const event = result.logs[0].args
            assert.equal(event.tokenId.toNumber(), 5, 'id is correct')
            assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
            assert.equal(event.to, accounts[0], 'to is correct')
            assert.equal(6, supply, 'total supply increases by 1')
        })
        it("creates a token for user 1", async () => {
            const cost = parseInt(await contract.getCost())
            const result = await contract.safeMint(2, { 
                from: accounts[1],
                value: (cost*2).toString(),
            })
            const event = result.logs[0].args
            // assert.equal(event.tokenId.toNumber(), 6, 'id is correct')
            // assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
            // assert.equal(event.to, accounts[1], 'to is correct')
            //assert.equal(8, supply, 'total supply increases by 2')
        })
        it("checks all the token uris (unrevealed)", async () => {
            const supply = await contract.totalSupply()
            for(let i = 0; i < supply; ++i) {
                const uri = await contract.tokenURI(i)
                assert.equal(uri, unrevealedURI, 'token uri still unrevealed')
            }
        })
    })
    describe("reveal", async () => {
        it("reveals the token metadata", async () => {
            const supply = await contract.totalSupply()
            const res = await contract.reveal(uris)
            for(let i = 0; i < supply; ++i) {
                const uri = await contract.tokenURI(i)
                assert.equal(uri, uris[i], 'matching uri')
            }
        })
    })
})