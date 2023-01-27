const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.options("*", cors());

const sdk = require('api')('@wyre-hub/v4#jiufu13wl6nwfxa7');

const key = "TEST-SK-6C9AXWAX-YZ976B2W-TGD9B6R2-JD6ACY3P"
const accountId = "AC_PD7YFA9LEPA"
sdk.auth(key);
sdk.server('https://api.testwyre.com');

const createWalletOrderReservation = async () => {
  let res;
  try {
    res = await sdk.CreateWalletOrderReservation({
      referrerAccountId: accountId
    }).catch(console.log)
  } catch (err) {
    throw "Error while Create Wallet Order Reservation";
  }
  console.log(res);
  return res;
}

const createOrder = async (
  reservationId, amount, debitCard, address, walletAddress,
  email, givenName, familyName, phoneNumber, ipAddress
  ) => {
  let res;
  try {
    res = await sdk.CreateOrder({
      debitCard: debitCard,
      address: address,
      reservationId: reservationId,
      amount: amount,
      trigger3ds: true,
      sourceCurrency: 'SEK',
      destCurrency: 'BTC',
      dest: `bitcoin:${walletAddress}`,
      referrerAccountId: accountId,
      email: email,
      givenName: givenName,
      familyName: familyName,
      phone: phoneNumber,
      ipAddress: ipAddress
    })
  } catch (err) {
    throw "Error while Create Order";
  }
  console.log(res);
  return res;
}

const getAuthorization = async (orderId) => {
  let res;
  try {
    res = await sdk.GetAuthorization({orderId: orderId})
  } catch (err) {
    throw "Error while Submit Authorization";
  }
  console.log(res);
  return res;
}

const submitAuthorization = async (orderId, reservationId, sms, card2fa, type) => {
  let res;
  try {
    if(type == "ALL")
      res = await sdk.SubmitAuthorization({
        walletOrderId: orderId,
        type: type,
        sms: sms,
        card2fa: card2fa,
        reservation: reservationId
      })
    else if (type == "SMS")
      res = await sdk.SubmitAuthorization({
        walletOrderId: orderId,
        type: type,
        sms: sms,
        reservation: reservationId
      })
    else if (type == "CARD2FA")
      res = await sdk.SubmitAuthorization({
        walletOrderId: orderId,
        type: type,
        card2fa: card2fa,
        reservation: reservationId
      })
  } catch (err) {
    throw "Error while Submit Authorization";
  }
  console.log(res);
  return res;
}

const getWalletOrder = async (orderId) => {
  let res;
  try {
    res = await sdk.GetWalletOrder({orderId: orderId})
  } catch (err) {
    throw "Error while Get Wallet Order";
  }
  console.log(res);
  return res;
}

const trackWidgetOrder = async (transferId) => {
  let res;
  try {
    res = await sdk.TrackWidgetOrder({transferId: transferId})
  } catch (err) {
    throw "Error while Get Wallet Order";
  }
  console.log(res);
  return res;
}

const runOrder = async (
  amount, debitCard, address, walletAddress, email, 
  givenName, familyName, phoneNumber, ipAddress
) => {
  let res;
  try {
    const reservation = (await createWalletOrderReservation()).reservation;

    let order = await createOrder(
      reservation, 
      amount,
      debitCard,
      address,
      walletAddress,
      email,
      givenName,
      familyName,
      phoneNumber,
      ipAddress,
    );
    
    do {
      order = await getWalletOrder(order.id);
    } while(order.status == "RUNNING_CHECKS");
    if(order.status == "FAILED")
      return order.status;
    res = await trackWidgetOrder(order.transferId);
  } catch (err) {
    console.log(err);
    return err;
  }
  return res;
}

// runOrder(
//   10000,
//   {
//   number: '4111111111111111',
//   year: '2023', 
//   month: '10', 
//   cvv: '555' 
//   },
//   {
//   street1: 'Hammarvägen 36',
//   city: 'Sorsele',
//   country: 'SE',
//   postalCode: '5555',
//   state: 'SE'
//   },
//   "tb1q6yn0ajs733xsk25vefrhwjey4629qt9c67y6ma",
//   "testwyre@mail.io",
//   "Send",
//   "Wyre",
//   '46765196294',
//   '1.1.1.1'
// );

app.post('/create_order', async (req, res) => {
  console.log("Create Order")
  const param = req.body;

  let result = await runOrder(
    param.amount,
    param.debitCard,
    param.address,
    param.walletAddress,
    param.email,
    param.givenName,
    param.familyName,
    param.phoneNumber,
    param.ipAddress,
  ).catch(e => res.json(e));
  res.json(result);
})

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = Number(process.env.PORT || 5001);
// starting the server
app.listen(port, () =>
    console.log(`Server running on port ${port}!`)
);

module.exports = app;