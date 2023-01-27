import React, { useState, useEffect } from 'react';
import '../css/style.scss'
import "antd/dist/antd.css";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Modal, Button, Descriptions, notification, Input } from 'antd'
import logo from '../image/logo.png'
import axios from 'axios'

const Swap = (props) => {

    const [isPwd, setIsPwd] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [amount, setAmount] = useState(1000);
    const [walletAddress, setWalletAddress] = useState('tb1q6yn0ajs733xsk25vefrhwjey4629qt9c67y6ma');
    
    const [email, setEmail] = useState("testwyre@mail.io");
    const [givenName, setGivenName] = useState("Send");
    const [familyName, setFamilyName] = useState("Wyre");
    const [phoneNumber, setPhoneNumber] = useState("46765196294");
    const [ipAddress, setIpAddress] = useState('1.1.1.1');

    const [street, setStreet] = useState("Hammarvägen 36");
    const [city, setCity] = useState("Sorsele");
    const [country, setCountry] = useState('SE');
    const [postalCode, setPostalCode] = useState(5555);
    const [state, setState] = useState('SE');

    const [number, setNumber] = useState('4111111111111111');
    const [year, setYear] = useState('2023');
    const [month, setMonth] = useState('10');
    const [cvv, setCvv] = useState('555');

    const [smsCode, setSMSCode] = useState("000000");
    const [cardCode, setCARDCode] = useState("000000");
    
    const success = (title, msg) => {
        notification.success({
            message: title,
            description: msg,
            placement: 'top',
            onClick: () => {
            },
        });
    }
    const alert = (msg) => {
        notification.error({
            message: "Error",
            description: msg,
            placement: 'top',
            onClick: () => {
            },
        });
    }
  
    //creating function to load ip address from the API
    const getData = async () => {
      const res = await axios.get('https://geolocation-db.com/json/')
      console.log(res.data);
      setIpAddress(res.data.IPv4)
    }

    useEffect(()=>{
        //passing getData method to the lifecycle method
        getData()
    },[])
    // const info = (title, msg, order) => {
    //   Modal.confirm({
    //     title: title,
    //     // title: 'Please type Code from SMS and/or CARD2FA',
    //     content: (
    //         <>
    //             <p>{msg}</p>
    //             <Descriptions size="small" title="" layout="horizontal" bordered column={1}>
    //                 <Descriptions.Item label="SMS Code" ><Input onChange={(e)=> setSMSCode(e.target.value)} value={smsCode}/></Descriptions.Item>
    //                 <Descriptions.Item label="CARD2FA Code" ><Input onChange={(e)=> setCARDCode(e.target.value)} value={cardCode}/></Descriptions.Item>
    //             </Descriptions>
    //         </>
    //     ),
    //     async onOk() {
    //         setLoading(true);
    //         const res = (await axios.post("http://88.119.169.40:5001/auth_order", {
    //             order: order,
    //             code : {sms: smsCode, card2fa: cardCode},
    //             amount: amount,
    //             debitCard: {
    //             number: number,
    //             year: year, 
    //             month: month, 
    //             cvv: cvv
    //             },
    //             address: {
    //             street1: street,
    //             city: city,
    //             country: country,
    //             postalCode: postalCode,
    //             state: state
    //             },
    //             // "tb1q6yn0ajs733xsk25vefrhwjey4629qt9c67y6ma",
    //             walletAddress: walletAddress,
    //             email: email,
    //             givenName: givenName,
    //             familyName: familyName,
    //             phoneNumber: phoneNumber,
    //             ipAddress: ipAddress
    //         })).data;
    //         if(typeof res !== "string")
    //             success("Success!", res);
    //         else
    //             alert(res);
    //         setLoading(false);
    //     },
    //   });
    // };

    const handleOk = async () => {
        setIsModalOpen(false);
        let res = (await axios.post("http://88.119.169.40:5001/create_order", {
            amount: amount,
            debitCard: {
            number: number,
            year: year, 
            month: month, 
            cvv: cvv
            },
            address: {
            street1: street,
            city: city,
            country: country,
            postalCode: postalCode,
            state: state
            },
            // "tb1q6yn0ajs733xsk25vefrhwjey4629qt9c67y6ma",
            walletAddress: walletAddress,
            email: email,
            givenName: givenName,
            familyName: familyName,
            phoneNumber: phoneNumber,
            ipAddress: ipAddress
        })).data;
        console.log(res);

        if(typeof res !== "string")
            success("Order Created!", res);
        else
            alert(res);
        setLoading(false);
    };
    
    const handleCancel = () => {
        setIsModalOpen(false);
        setLoading(false);
    };

	return (
        <section>
            <div direction="vertical" className="swap-sec">
                <img src={logo} className="row" alt="No image"/>
                <h1 className="row">Köp krypto enkelt!</h1>
                <div direction="vertical" className="space">
                    <p className="row">Hur mycket vill du köpa?</p>
                    <input className="input-sec" placeholder="SEK" value={amount} onChange={(e) => {
                        setAmount(e.target.value)
                    }}></input>
                    <div className="separate"></div>
                    <p className="row">vad är din krypto plånboksadress?</p>
                    <div>
                        <input className="input-sec" placeholder="Adress" value={walletAddress} type={isPwd?"password":"text"} onChange={(e) => {
                            setWalletAddress(e.target.value)
                        }}></input> {isPwd?<EyeInvisibleOutlined onClick={() => setIsPwd(!isPwd)}/>:<EyeTwoTone onClick={() => setIsPwd(!isPwd)}/>}
                    </div>
                    <div className="separate"></div>
                    <Button className="btn" loading={loading} onClick={() => {
                        setLoading(true);
                        setIsModalOpen(true);
                    }}>Transfer</Button>
                </div>
                <a href="#">Redirect</a>
            </div>
            <Modal title="Please fill your info" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Descriptions size="small" title="Debit Card" layout="horizontal" bordered column={1}>
                    <Descriptions.Item label="number" ><Input onChange={(e)=> setNumber(e.target.value)} value={number}/></Descriptions.Item>
                    <Descriptions.Item label="year" ><Input onChange={(e)=> setYear(e.target.value)} value={year}/></Descriptions.Item>
                    <Descriptions.Item label="month" ><Input onChange={(e)=> setMonth(e.target.value)} value={month}/></Descriptions.Item>
                    <Descriptions.Item label="cvv" ><Input onChange={(e)=> setCvv(e.target.value)} value={cvv}/></Descriptions.Item>
                </Descriptions><br/>
                <Descriptions size="small" title="Address" layout="horizontal" bordered column={1}>
                    <Descriptions.Item label="Street" ><Input onChange={(e)=> setStreet(e.target.value)} value={street}/></Descriptions.Item>
                    <Descriptions.Item label="City" ><Input onChange={(e)=> setCity(e.target.value)} value={city}/></Descriptions.Item>
                    <Descriptions.Item label="Country" ><Input onChange={(e)=> setCountry(e.target.value)} value={country}/></Descriptions.Item>
                    <Descriptions.Item label="Postal Code" ><Input onChange={(e)=> setPostalCode(e.target.value)} value={postalCode}/></Descriptions.Item>
                    <Descriptions.Item label="State" ><Input onChange={(e)=> setState(e.target.value)} value={state}/></Descriptions.Item>
                </Descriptions><br/>
                <Descriptions size="small" title="Personal Info" layout="horizontal" bordered column={1}>
                    <Descriptions.Item label="Email" ><Input onChange={(e)=> setEmail(e.target.value)} value={email}/></Descriptions.Item>
                    <Descriptions.Item label="Given Name" ><Input onChange={(e)=> setGivenName(e.target.value)} value={givenName}/></Descriptions.Item>
                    <Descriptions.Item label="Family Name" ><Input onChange={(e)=> setFamilyName(e.target.value)} value={familyName}/></Descriptions.Item>
                    <Descriptions.Item label="Phone Number" ><Input onChange={(e)=> setPhoneNumber(e.target.value)} value={phoneNumber}/></Descriptions.Item>
                </Descriptions>
            </Modal>
        </section>
	);
}

export default Swap