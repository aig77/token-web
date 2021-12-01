import React from 'react';
import '../App.css';
import MintButton from './MintButton';
import Web3 from 'web3';
import Token from '../artifacts/MyToken.json';
//const Web3 = require('web3');

declare let window: any;

interface State {
  account: string;
  contract: any;
  totalSupply: number;
  cost: number;
  amount: number;
}

class MintPage extends React.Component<{}, State> {

  constructor(props: any) {
    super(props);
    this.state = { 
      account: '',
      contract: {},
      totalSupply: 0,
      cost: 0,
      amount: 1
    };
  }

  componentDidMount = async () => {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  loadWeb3 = async () => {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({method: 'eth_requestAccounts'});
      } catch(error) {
        console.log(error);
      }
    } else if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId() as keyof typeof Token.networks;
    const networkData = Token.networks[networkId];
    if(networkData) {
      const contract = new web3.eth.Contract(Token.abi, networkData.address);
      this.setState({ contract });
      const totalSupply = await contract.methods.totalSupply().call();
      this.setState({ totalSupply });
      const cost = parseInt(await contract.methods.getCost().call());
      this.setState({ cost });
    } else {
      window.alert('Smart contract not deployed to detected network');
    }
  }

  mint = async (amount: number) => {
    if(amount > 0) {
      const contract = this.state.contract;
      contract.methods.safeMint(amount).send({
          from: this.state.account,
          value: (this.state.cost * amount).toString()
        }).once("error", (err: any) => {
          console.log(err);
        }).then((receipt: any) => {
          console.log(receipt);
        }).catch((err: any) => {
          console.log(err);
        }); 
    }
    
       
    // if(ex_tokens.length > 0) {
    //   const idx = Math.floor(Math.random() * ex_tokens.length);
    //   console.log(ex_tokens[idx]);
    //   this.state.contract.methods.safeMint().send({
    //     from: this.state.account
    //   });
    //   ex_tokens.splice(idx, 1);
    //   console.log(ex_tokens);
    // } else {
    //   console.log("no more tokens to mint");
    // }
  }

  handleAmount = (e: any) => {
    this.setState({amount: e.target.value.replace(/\D/g, "")});
  }

  render() {
    return (
      <React.Fragment>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems:"center"
          }}
          >
          <div className="form-group">
            <label htmlFor="formGroupExampleInput">Input Mint Amount</label>
            <input
              type="number"
              className="form-control"
              id="formGroupExampleInput"
              value={this.state.amount}
              onChange={this.handleAmount}
            />
          </div>
          <MintButton
            onClick={() => this.mint(this.state.amount) }
            children = "Mint"
          />
        </div>
        <h2>{this.state.account}</h2>
      </React.Fragment>
    );
  }
}

export default MintPage;
