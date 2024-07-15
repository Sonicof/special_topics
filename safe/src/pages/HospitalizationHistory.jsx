import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import contract from "../contracts/contract.json";
import { useCookies } from "react-cookie";
import { create } from 'ipfs-http-client';

const HospitalizationHistory = () => {
  const [cookies, setCookie] = useCookies();
  const web3 = new Web3(window.ethereum);
  const mycontract = new web3.eth.Contract(contract["abi"], contract["address"]);
  const [hospHistory, setHospHistory] = useState([]);

  useEffect(() => {
    const all = [];
    async function getHospHistory() {
      await mycontract.methods
        .getPatient()
        .call()
        .then(async (res) => {
          for (let i = res.length - 1; i >= 0; i--) {
            if (res[i] === cookies['hash']) {
              const data = await (await fetch(`http://localhost:8080/ipfs/${res[i]}`)).json();
              if (data.hasOwnProperty('hospitalizationhistory')) {
                for (let j = 0; j < data['hospitalizationhistory'].length; j++) {
                  if (data['hospitalizationhistory'][j].hasOwnProperty('datefrom')) {
                    all.push(data['hospitalizationhistory'][j]);
                  }
                }
              }
              break;
            }
          }
        });
      setHospHistory(all);
    }
    getHospHistory();
  }, [hospHistory.length, cookies]);

  const [addFormData, setAddFormData] = useState({
    datefrom: "",
    dateto: "",
    reason: "",
    surgery: "",
  });

  const handleAddFormChange = (event) => {
    const newFormData = { ...addFormData };
    newFormData[event.target.name] = event.target.value;
    setAddFormData(newFormData);
  };

  async function submit() {
    var accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    var currentaddress = accounts[0];

    mycontract.methods
      .getPatient()
      .call()
      .then(async (res) => {
        for (let i = res.length - 1; i >= 0; i--) {
          if (res[i] === cookies['hash']) {
            const data = await (await fetch(`http://localhost:8080/ipfs/${res[i]}`)).json();
            data["hospitalizationhistory"].push(addFormData);

            let client = create();
            client = create(new URL('http://127.0.0.1:5001'));
            const { cid } = await client.add(JSON.stringify(data));
            const hash = cid['_baseCache'].get('z');

            await mycontract.methods.addPatient(hash).send({ from: currentaddress }).then(() => {
              setCookie('hash', hash);
              alert("Hospitalization History Saved");
              window.location.reload();
            }).catch((err) => {
              console.log(err);
            });
            break;
          }
        }
      });
  }

  return (
    <div className="flex relative dark:bg-main-dark-bg">
      <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
        <Sidebar />
      </div>

      <div className="dark:bg-main-dark-bg bg-main-bg min-h-screen ml-72 w-full">
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
          <Navbar />
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: "4rem", justifyContent: "center", alignItems: "flex-end", gap: "4rem" }}>
          <form style={{ width: "100%" }}>
            <table style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Admitted On</th>
                  <th>Discharged On</th>
                  <th>Reason</th>
                  <th>Surgery</th>
                </tr>
              </thead>
              <tbody>
                {hospHistory.map((mh, index) => (
                  <tr key={index}>
                    <td>{mh.datefrom}</td>
                    <td>{mh.dateto}</td>
                    <td>{mh.reason}</td>
                    <td>{mh.surgery}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </form>

          <form style={{
            display: 'flex', flexDirection: 'column', gap: '1rem',
            backgroundColor: 'rgb(3, 201, 215)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
            borderRadius: '20px',
          }}>
            <h2>Add your Hospitalization History</h2>
            <input
              type="text"
              name="datefrom"
              required="required"
              placeholder="Admitted On"
              onChange={handleAddFormChange}
            />
            <input
              type="text"
              name="dateto"
              required="required"
              placeholder="Discharged On"
              onChange={handleAddFormChange}
            />
            <input
              type="text"
              name="reason"
              required="required"
              placeholder="Reason"
              onChange={handleAddFormChange}
            />
            <input
              type="text"
              name="surgery"
              required="required"
              placeholder="Surgery, if any?"
              onChange={handleAddFormChange}
            />
            <input type="button" value="Save" onClick={submit} />
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default HospitalizationHistory;
