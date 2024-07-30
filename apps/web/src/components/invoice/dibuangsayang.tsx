// const [paymentMethodDetails, setPaymentMethodDetails] =
//   useState<PaymentMethodDetails>({
//     method: '',
//     va: '',
//     imgSrc: '',
//   });

// const snapScript = 'https://app.sandbox.midtrans.com/snap/snap.js';
// const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
// console.log(clientKey);
// const script = document.createElement('script');
// script.src = snapScript;
// if (clientKey) {
//   console.log('masok', clientKey);
//   script.setAttribute('data-client-key', clientKey);
//   script.async = true;
//   document.body.appendChild(script);
// }

// const paymentMethodMap: {
//   [key: string]: { method: string; va: string; imgSrc: string };
// } = {
//   MANDIRI: {
//     method: 'MANDIRI Transfer',
//     va: '8708950875882',
//     imgSrc:
//       'https://d2q79iu7y748jz.cloudfront.net/s/_squarelogo/256x256/494671cedab89e8b66621451cfb2dcba',
//   },
//   BCA: {
//     method: 'BCA Transfer',
//     va: '8900850875882',
//     imgSrc:
//       'https://cdn.iconscout.com/icon/free/png-256/free-bca-225544.png?f=webp',
//   },
// };

// const tempPaymentMethodDetails =
//   paymentMethodMap[
//     res.data.data?.payment_method as keyof typeof paymentMethodMap
//   ] || res.data.data?.payment_method;

// setPaymentMethodDetails(tempPaymentMethodDetails);

// const paymentMethodMap: { [key: string]: string } = {
//   MANDIRI: 'MANDIRI Transfer',
//   BCA: 'BCA Transfer',
// };

// return () => {
//   document.body.removeChild(script);
// };

// const [paymentMethodDetails, setPaymentMethodDetails] =
//   useState<PaymentMethodDetails>({
//     method: '',
//     va: '',
//     imgSrc: '',
//   });
