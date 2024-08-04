import React, { useState } from 'react';

interface PaymentInstructionProps {
  paymentMethod: 'BCA' | 'MANDIRI';
}

const PaymentInstruction: React.FC<PaymentInstructionProps> = ({
  paymentMethod,
}) => {
  // Langkah-langkah pembayaran untuk MANDIRI
  const mandiriSteps = {
    ATM: [
      'Input kartu ATM dan PIN Anda',
      'Pilih Menu Bayar/Beli',
      'Pilih Lainnya',
      'Pilih Multi Payment',
      'Input 70014 sebagai Kode Institusi',
      'Input Virtual Account Number, misal. 7001 4501 0944 3414',
      'Pilih Benar',
      'Pilih Ya',
      'Pilih Ya',
      'Ambil bukti bayar Anda',
      'Selesai',
    ],
    MobileBanking: [
      'Login New Livin by Mandiri',
      'Pilih Menu Bayar',
      'Pilih E-Commerce',
      'Cari Transferpay sebagai penyedia jasa',
      'Input Nomor Virtual Account, misal. 7001 4501 0944 3414 sebagai kode bayar',
      'Pilih Lanjut',
      'Layar akan menampilkan kode bayar dan detail pembayaran. Cek apakah sudah sesuai',
      'Input MPIN New Livin, Klik OK',
      'Selesai',
    ],
  };

  // Langkah-langkah pembayaran untuk BCA
  const bcaSteps = {
    ATM: [
      'Input kartu ATM dan PIN Anda',
      'Pilih Menu Transaksi Lainnya',
      'Pilih Transfer',
      'Pilih Ke Rekening BCA Virtual Account',
      'Input Nomor Virtual Account, yaitu 780 0112 7821 0807',
      'Pilih Benar',
      'Pilih Ya',
      'Ambil bukti bayar Anda',
      'Selesai',
    ],
    MobileBanking: [
      'Login Mobile Banking',
      'Pilih m-Transfer',
      'Pilih BCA Virtual Account',
      'Input Nomor Virtual Account, yaitu 780 0112 7821 0807 sebagai No. Virtual Account',
      'Klik Send',
      'Informasi Virtual Account akan ditampilkan',
      'Klik OK',
      'Input PIN Mobile Banking',
      'Bukti bayar ditampilkan',
      'Selesai',
    ],
  };

  // State untuk memilih metode pembayaran
  const [paymentType, setPaymentType] = useState<'ATM' | 'MobileBanking'>(
    'ATM',
  );

  // Pilih langkah-langkah sesuai dengan metode pembayaran dan jenis pembayaran
  const paymentMethodSteps =
    paymentMethod === 'MANDIRI'
      ? mandiriSteps[paymentType]
      : paymentMethod === 'BCA'
        ? bcaSteps[paymentType]
        : [];

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Panduan Pembayaran</h3>

      {/* Pilih jenis pembayaran */}
      <div className="mb-4">
        <button
          className={`px-4 py-2 mr-2 ${paymentType === 'ATM' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setPaymentType('ATM')}
        >
          ATM
        </button>
        <button
          className={`px-4 py-2 ${paymentType === 'MobileBanking' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setPaymentType('MobileBanking')}
        >
          Mobile Banking
        </button>
      </div>

      {/* Tampilkan langkah-langkah */}
      <ol className="list-decimal pl-4">
        {paymentMethodSteps.length > 0 ? (
          paymentMethodSteps.map((step, index) => (
            <li key={index} className="mb-2">
              {step}
            </li>
          ))
        ) : (
          <li>Tidak ada panduan untuk metode pembayaran ini.</li>
        )}
      </ol>
    </div>
  );
};

export default PaymentInstruction;
