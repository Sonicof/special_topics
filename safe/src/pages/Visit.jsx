import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import contract from "../contracts/contract.json";
import { useCookies } from "react-cookie";
import { create } from 'ipfs-http-client';

const Visits = () => {
  const [cookies, setCookie] = useCookies();
  const web3 = new Web3(window.ethereum);
  const mycontract = new web3.eth.Contract(contract["abi"], contract["address"]);
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    const visitRecords = [];
    async function getVisits() {
      await mycontract.methods.getPatient().call().then(async (res) => {
        for (let i = res.length - 1; i >= 0; i--) {
          if (res[i] === cookies['hash']) {
            const data = await (await fetch(`http://localhost:8080/ipfs/${res[i]}`)).json();
            visitRecords.push(...data.visit);
            break;
          }
        }
      });
      setVisits(visitRecords);
    }
    getVisits();
  }, [visits.length]);

  const [addFormData, setAddFormData] = useState({
    name: "",
    date: "",
    reason: "",
  });

  const handleAddFormChange = (event) => {
    const newFormData = { ...addFormData };
    newFormData[event.target.name] = event.target.value;
    setAddFormData(newFormData);
  };

  async function submit() {
    var accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    var currentaddress = accounts[0];

    mycontract.methods.getPatient().call().then(async (res) => {
      for (let i = res.length - 1; i >= 0; i--) {
        if (res[i] === cookies['hash']) {
          const data = await (await fetch(`http://localhost:8080/ipfs/${res[i]}`)).json();
          const visitRecords = data.visit || [];
          visitRecords.push(addFormData);

          data.visit = visitRecords;
          let client = create(new URL('http://127.0.0.1:5001'));
          const { cid } = await client.add(JSON.stringify(data));
          const hash = cid['_baseCache'].get('z');

          await mycontract.methods.addPatient(hash).send({ from: currentaddress }).then(() => {
            setCookie('hash', hash);
            alert("Visit Record Added");
            window.location.reload();
          }).catch((err) => {
            console.log(err);
          });
          break;
        }
      }
    });
  }

  async function del(name) {
    var accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    var currentaddress = accounts[0];

    mycontract.methods.getPatient().call().then(async (res) => {
      for (let i = res.length - 1; i >= 0; i--) {
        if (res[i] === cookies['hash']) {
          const data = await (await fetch(`http://localhost:8080/ipfs/${res[i]}`)).json();
          const visitRecords = data.visit || [];
          const newList = visitRecords.filter(visit => visit.name !== name);

          data.visit = newList;
          let client = create(new URL('http://127.0.0.1:5001'));
          const { cid } = await client.add(JSON.stringify(data));
          const hash = cid['_baseCache'].get('z');

          await mycontract.methods.addPatient(hash).send({ from: currentaddress }).then(() => {
            setCookie('hash', hash);
            alert("Visit Record Deleted");
            window.location.reload();
          }).catch((err) => {
            console.log(err);
          });
        }
      }
    });
  }

  function showVisitRecords() {
    if (visits.length > 0) {
      return visits.map((visit, index) => (
        <tr key={index}>
          <td>{visit.name}</td>
          <td>{visit.date}</td>
          <td>{visit.reason}</td>
          <td>
            <input type="button" value="Delete" onClick={() => del(visit.name)} />
          </td>
        </tr>
      ));
    }
  }

  return (
    <div className="flex relative dark:bg-main-dark-bg">
      <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
        <Sidebar />
      </div>
      <div className={"dark:bg-main-dark-bg bg-main-bg min-h-screen ml-72 w-full"}>
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
          <Navbar />
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: "4rem", justifyContent: "center", alignItems: "flex-end", gap: "4rem" }}>
          <form style={{ width: "100%" }}>
            <table style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th className="">Name Of Professional</th>
                  <th className="">Date Of Visit</th>
                  <th className="">Reason?</th>
                  <th className="">Actions</th>
                </tr>
              </thead>
              <tbody>
                {showVisitRecords()}
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
            <h2>Add your Visit Record</h2>
            <input
              type="text"
              name="name"
              required="required"
              placeholder="Name Of Professional"
              onChange={handleAddFormChange}
            />
            <input
              type="text"
              name="date"
              required="required"
              placeholder="Date of Visit"
              onChange={handleAddFormChange}
            />
            <input
              type="text"
              name="reason"
              required="required"
              placeholder="Reason"
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

export default Visits;
