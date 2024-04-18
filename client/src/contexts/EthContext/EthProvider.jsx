import React, { useReducer, useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [tokenState, tokenDispatch] = useReducer(reducer, initialState);
  const [tokenSaleState, tokenSaleDispatch] = useReducer(reducer, initialState);
  const [kycState, kycDispatch] = useReducer(reducer, initialState);
  const [load, setLoad] = useState(false);
  const [inputItem, setInputItem] = useState({ kycAddress: "", id: "Example_1", tokenSaleAddress: "", tokenAmount: 0 });

  const init = useCallback(
    async (artifact, cont) => {
      if (artifact) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const { abi } = artifact;
        let address, contract;
        try {
          address = artifact.networks[networkID]?.address;
          contract = new web3.eth.Contract(abi, artifact.networks[networkID] && address);
        } catch (err) {
          console.error(err);
        }
        if (cont === "Token") {
          tokenDispatch({
            type: actions.init,
            data: { artifact, web3, accounts, networkID, contract }
          });
        } else if (cont === "TokenSale") {
          tokenSaleDispatch({
            type: actions.init,
            data: { artifact, web3, accounts, networkID, contract }
          });
          console.log({
            ...inputItem,
            tokenSaleAddress: address
          })
          setInputItem({
            ...inputItem,
            tokenSaleAddress: address
          })
        }
        else {
          kycDispatch({
            type: actions.init,
            data: { artifact, web3, accounts, networkID, contract }
          });
        }


      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifactMyToken = require("../../contracts/MyToken.json");
        const artifactMyTokenSale = require("../../contracts/MyTokenSale.json");
        const artifactKyc = require("../../contracts/KycContract.json");
        await init(artifactMyTokenSale, "TokenSale");
        await init(artifactMyToken, "Token");
        await init(artifactKyc, "Kyc");
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
    setLoad(true);

  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(tokenSaleState.artifact, "TokenSale");
      init(tokenState.artifact, "Token");
      init(kycState.artifact, "Kyc");
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, tokenState.artifact, tokenSaleState.artifact, kycState.artifact]);

  const handleChange = (event) => {
    const target = event.target;
    const val = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setInputItem({ ...inputItem, [name]: val });



  }

  useEffect(() => {
    // Ensure the contract is initialized before setting up the listener
    if (tokenState.contract) {
      const { contract } = tokenState;

      const eventSubscription = contract.events.Transfer()
        .on("data", function (event) {
          console.log(event);
          updateUserTokens()
          // Handle the event data here
        })
        .on("error", console.error);

      // Cleanup subscription when the component unmounts or if the contract instance changes
      return () => eventSubscription.unsubscribe();
    }
  }, [tokenState.contract]);



  const handleSubmit = async (event) => {
    const { accounts, contract } = kycState;
    console.log(accounts[0]);
    let result = await contract.methods.setKycCompleted(inputItem.kycAddress).send({ from: accounts[0] });
    console.log(result)
    alert("KYC for " + inputItem.kycAddress + " is completed")
    // setInputItem({
    //   ...inputItem,
    //  kycAddress: result.events.DeliverySteps.returnValues.itemAddress
    // })
  }

  const updateUserTokens = async () => {
    const { accounts, contract } = tokenState;
    console.log(accounts[0]);
    let result = await contract.methods.balanceOf(accounts[0]).call();
    setInputItem(prevState => ({
      ...prevState,
      tokenAmount: parseFloat(result)
    }));
  };

  useEffect(() => {
    console.log(inputItem.tokenAmount);
  }, [inputItem.tokenAmount]);

  useEffect(() => {
    // Ensure the contract is initialized before setting up the listener
    if (tokenState.contract) {
      updateUserTokens();
    }
  }, [tokenState.contract, tokenState.accounts]); // Include tokenState.accounts as a dependency

  const handleBuyToken = async () => {
    const { accounts, contract } = tokenSaleState;
    await contract.methods.buyTokens(accounts[0]).send({ from: accounts[0], value: Web3.utils.toWei("10", "wei") })
  }

  return (
    <>
      {

        load ? (<div className="App">
          <h1>Cappucino Token Sale</h1>
          <h2>Get your token today</h2>
          <p>Kyc Whitelist Address:<input type="text" name="kycAddress" value={inputItem.kycAddress} onChange={handleChange}></input>
          </p>
          <button type="button" onClick={handleSubmit}>Add to Whitelist</button>
          <br />
          <br />
          <h2>Buy Tokens</h2>
          <p>Send money(Wei) to this address:{inputItem.tokenSaleAddress}</p>
          <br />
          <br />
          <p>You currently have: {inputItem.tokenAmount}STAR tokens</p>
          <button type="button" onClick={handleBuyToken}>Buy more tokens</button>
          {/* <p>ID: <input type="text" name="id" value={inputItem.id} onChange={handleChange}></input> </p>

          <br />
          <br />
          <h2>Items Payment</h2>
          <p>Address:<input width={"200px"} type="text" name="address" value={inputItem.address} onChange={handleChange}></input>
          </p>

          <button type="button" onClick={handleSubmitPayment}>Pay for Item</button>
          <br />
          <button type="button" onClick={handleDelivery}>Deliver Item</button> */}
        </div>) : (


          <div></div>

        )
      }
    </>
  );
}

export default EthProvider;
