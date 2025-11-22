'use client';

import '@coinbase/onchainkit/styles.css'; 
import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useAccount } from 'wagmi'; 
import { 
  ConnectWallet, 
  Wallet, 
  WalletDropdown, 
  WalletDropdownDisconnect, 
  WalletDropdownLink 
} from '@coinbase/onchainkit/wallet';
import { Address, Avatar, Name, Identity, EthBalance } from '@coinbase/onchainkit/identity';
import { Plus, X } from 'lucide-react';

// SSR sorununu önlemek için dinamik import
const TinderCard = dynamic(() => import('react-tinder-card'), { ssr: false });

// --- MOCK DATA ---
const INITIAL_DB = [
  {
    id: 1,
    name: 'Maria S.',
    wallet: '0x7099...79C8', 
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=60',
    type: 'SELLING',
    amount: '100 USDT', 
    rate: '1 USDT = 1100 ARS',
    color: 'bg-red-100' 
  },
  {
    id: 2,
    name: 'Juan P.',
    wallet: '0x3C44...93BC',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=60',
    type: 'BUYING',
    amount: '200 USDT',
    rate: '1 USDT = 1090 ARS',
    color: 'bg-green-100' 
  },
  {
    id: 3,
    name: 'Sofia L.',
    wallet: '0x90F7...b906',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=60',
    type: 'SELLING',
    amount: '50 USDT',
    rate: '1 USDT = 1105 ARS',
    color: 'bg-red-100'
  },
];

export default function Page() {
  const { isConnected } = useAccount();
  
  const [cards, setCards] = useState(INITIAL_DB);
  const [lastDirection, setLastDirection] = useState<string | undefined>();
  const [blueRate, setBlueRate] = useState(1100);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offerType, setOfferType] = useState('SELLING');
  const [amount, setAmount] = useState('');

  // TinderCard referansları
  const childRefs = useMemo(
    () =>
      Array(cards.length)
        .fill(0)
        .map(() => React.createRef()),
    [cards.length]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setBlueRate(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // --- EŞLEŞME MANTIĞI (Sadece Görsel) ---
  const handleMatch = (character: any) => {
    if (!isConnected) {
      alert("⚠️ Please connect your wallet first!");
      return;
    }

    // Blockchain işlemi YOK. Sadece eşleşme var.
    console.log(`Matched with ${character.name}!`);
    alert(`🎉 It's a Match with ${character.name}!\n\nYou can now contact them to arrange the exchange.`);
  };

  // --- SWIPE MANTIĞI ---
  const swiped = (direction: string, character: any, index: number) => {
    setLastDirection(direction);
    if (direction === 'right') {
      handleMatch(character);
    }
  };

  const outOfFrame = (name: string) => {
    console.log(name + ' left the screen!');
  };

  // --- BUTONLA TETİKLEME ---
  const swipeButton = (dir: string) => {
    if (cards.length === 0) return;
    const index = cards.length - 1; 
    // @ts-ignore
    childRefs[index].current.swipe(dir); 
  };

  // --- YENİ İLAN ---
  const handleNewOfferClick = () => {
    if (!isConnected) {
      alert("⚠️ Connect wallet to post an offer!");
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCard = {
      id: Date.now(),
      name: 'You (New)',
      wallet: '0xYour...Wallet', 
      url: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=500&q=60',
      type: offerType,
      amount: `${amount} USDT`,
      rate: `1 USDT = ${blueRate * 1} ARS`,
      color: offerType === 'SELLING' ? 'bg-red-100' : 'bg-green-100'
    };
    setCards([...cards, newCard]); 
    setIsModalOpen(false);
    setAmount('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      
      {/* --- HEADER --- */}
      <header className="flex justify-between items-center p-4 bg-white shadow-md z-[50] sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">V</div>
          <h1 className="text-xl font-bold text-blue-600">Vecino</h1>
        </div>
        <div className="flex gap-2">
          <Wallet>
            <ConnectWallet className="bg-blue-600 text-white hover:bg-blue-700">
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownLink icon="wallet" href="https://keys.coinbase.com">Wallet</WalletDropdownLink>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 overflow-hidden relative w-full z-0">
        <div className="relative w-full max-w-sm h-[55vh] mt-4">
          {cards.map((character, index) => (
            <TinderCard
              // @ts-ignore
              ref={childRefs[index]}
              className="absolute inset-0 z-20"
              key={character.id}
              onSwipe={(dir) => swiped(dir, character, index)}
              onCardLeftScreen={() => outOfFrame(character.name)}
              preventSwipe={['up', 'down']}
            >
              <div
                style={{ backgroundImage: `url(${character.url})` }}
                className="relative w-full h-full bg-cover bg-center rounded-2xl shadow-xl border-4 border-white cursor-grab active:cursor-grabbing"
              >
                <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-b-xl text-white`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold">{character.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-black shadow-sm ${character.color}`}>
                      {character.type}
                    </span>
                  </div>
                  <p className="text-3xl font-bold mb-1">{character.amount}</p>
                  <p className="text-sm opacity-90 font-mono">{character.rate}</p>
                </div>
              </div>
            </TinderCard>
          ))}
          
          {/* Kartlar bitince görünen mesaj */}
          <div className="absolute inset-0 flex flex-col items-center justify-center -z-10">
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
            <p className="text-gray-400 text-center">
              No more offers nearby.<br />
              Why not create one?
            </p>
          </div>
        </div>

        {/* --- ACTION BUTTONS --- */}
        <div className="flex gap-8 mt-8 mb-20 z-10">
          <button 
            onClick={() => swipeButton('left')}
            className="w-14 h-14 bg-white rounded-full shadow-lg text-red-500 text-2xl flex items-center justify-center hover:scale-110 transition border border-gray-100 cursor-pointer"
          >
            ✕
          </button>
          <button 
            onClick={() => swipeButton('right')}
            className="w-14 h-14 bg-white rounded-full shadow-lg text-green-500 text-2xl flex items-center justify-center hover:scale-110 transition border border-gray-100 cursor-pointer"
          >
            ♥
          </button>
        </div>
      </main>

      {/* --- FAB --- */}
      <button 
        onClick={handleNewOfferClick}
        style={{ backgroundColor: '#2563EB', color: 'white' }} 
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 z-[40] cursor-pointer border-4 border-white"
      >
        <Plus size={32} />
      </button>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Create New Offer</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmitOffer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-1 bg-gray-100 rounded-xl">
                <button type="button" onClick={() => setOfferType('SELLING')} className={`py-3 rounded-lg font-bold ${offerType === 'SELLING' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}>Selling</button>
                <button type="button" onClick={() => setOfferType('BUYING')} className={`py-3 rounded-lg font-bold ${offerType === 'BUYING' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}>Buying</button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USDT)</label>
                <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 100" className="w-full p-4 text-lg border border-gray-200 rounded-xl outline-none" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg">Post Offer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}