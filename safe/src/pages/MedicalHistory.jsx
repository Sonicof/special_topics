import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import contract from "../contracts/contract.json";
import { useCookies } from "react-cookie";
import { create } from 'ipfs-http-client';

const MedicalHistory = () => {
    const web3 = new Web3(window.ethereum);
    const mycontract = new web3.eth.Contract(contract["abi"], contract["address"]);
    const [cookies, setCookie] = useCookies();
    const [medHistory, setMedHistory] = useState([]);
    
    useEffect(() => {
        const histories = [];
        async function getMedHistory() {
            await mycontract.methods.getPatient().call().then(async (res) => {
                for (let i = res.length - 1; i >= 0; i--) {
                    if (res[i] === cookies['hash']) {
                        const data = await (await fetch(`http://localhost:8080/ipfs/${res[i]}`)).json();
                        histories.push(...data.medicalhistory);
                        break;
                    }
                }
            });
            setMedHistory(histories);
        }
        getMedHistory();
    }, [medHistory.length]);

    const [addFormData, setAddFormData] = useState({
        disease: "",
        time: "",
        solved: "",
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
                    const histories = data.medicalhistory || [];
                    histories.push(addFormData);

                    data.medicalhistory = histories;
                    let client = create(new URL('http://127.0.0.1:5001'));
                    const { cid } = await client.add(JSON.stringify(data));
                    const hash = cid['_baseCache'].get('z');

                    await mycontract.methods.addPatient(hash).send({ from: currentaddress }).then(() => {
                        setCookie('hash', hash);
                        alert("Medical History Added");
                        window.location.reload();
                    }).catch((err) => {
                        console.log(err);
                    });
                    break;
                }
            }
        });
    }

    async function del(disease) {
        var accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        var currentaddress = accounts[0];

        mycontract.methods.getPatient().call().then(async (res) => {
            for (let i = res.length - 1; i >= 0; i--) {
                if (res[i] === cookies['hash']) {
                    const data = await (await fetch(`http://localhost:8080/ipfs/${res[i]}`)).json();
                    const histories = data.medicalhistory || [];
                    const newList = histories.filter(history => history.disease !== disease);

                    data.medicalhistory = newList;
                    let client = create(new URL('http://127.0.0.1:5001'));
                    const { cid } = await client.add(JSON.stringify(data));
                    const hash = cid['_baseCache'].get('z');

                    await mycontract.methods.addPatient(hash).send({ from: currentaddress }).then(() => {
                        setCookie('hash', hash);
                        alert("Deleted");
                        window.location.reload();
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            }
        });
    }

    function showMedHistories() {
        if (medHistory.length > 0) {
            return medHistory.map((data, index) => (
                <tr key={index}>
                    <td>{data.disease}</td>
                    <td>{data.time}</td>
                    <td>{data.solved}</td>
                    <td>
                        <input type="button" value="Delete" onClick={() => del(data.disease)} />
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
            <div className={"dark:bg-main-dark-bg  bg-main-bg min-h-screen ml-72 w-full"}>
                <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
                    <Navbar />
                </div>
                <div style={{ display: "flex", flexDirection: "column", padding: "4rem", justifyContent: "center", alignItems: "flex-end", gap: "4rem" }}>
                    <form style={{ width: "100%" }}>
                        <table style={{ borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th className="">Disease</th>
                                    <th className="">Diagnosed Date</th>
                                    <th className="">Status</th>
                                    <th className="">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {showMedHistories()}
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
                        <h2>Add your Medical History</h2>
                        <input
                            type="text"
                            name="disease"
                            required="required"
                            placeholder="Disease"
                            onChange={handleAddFormChange}
                        />
                        <input
                            type="text"
                            name="time"
                            required="required"
                            placeholder="Diagnosed Date"
                            onChange={handleAddFormChange}
                        />
                        <input
                            type="text"
                            name="solved"
                            required="required"
                            placeholder="Treated/Ongoing"
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

export default MedicalHistory;
