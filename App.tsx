
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { RaffleProvider, RaffleContext } from './context/RaffleContext';
import { RaffleContextType, RaffleNumber, NumberStatus, RaffleSettings } from './types';

// --- HELPER IONS ---
const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-white">
    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-1.383-.597 15.185 15.185 0 0 1-2.15-1.193c-1.152-.804-2.29-1.82-3.324-2.894C1.379 12.363 0 10.938 0 8.515c0-2.893 2.22-5.207 5.022-5.717 1.28-.225 2.583.126 3.633.916l.757.659.757-.659a5.023 5.023 0 0 1 3.632-.916c2.802.51 5.022 2.824 5.022 5.717 0 2.423-1.379 3.848-4.431 6.323-1.033 1.074-2.172 2.09-3.324 2.894a15.185 15.185 0 0 1-2.149 1.193 15.247 15.247 0 0 1-1.384.597l-.022.012-.007.003-.004.001a.752.752 0 0 1-.704 0l-.004-.001Z" />
  </svg>
);

const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>);
const AdminIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.6-3.75M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>);

// --- SUB-COMPONENTS ---
const PrizeInfo: React.FC<{ settings: RaffleSettings }> = ({ settings }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl mx-auto my-8">
        <div className="md:flex">
            <div className="md:flex-shrink-0">
                <img className="h-48 w-full object-cover md:h-full md:w-64" src={settings.prizeImage} alt={settings.prizeDescription} />
            </div>
            <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-rose-500 font-semibold">Prêmio da Rifa</div>
                <h1 className="block mt-1 text-2xl leading-tight font-bold text-black">{settings.prizeDescription}</h1>
                <p className="mt-2 text-gray-600">Dimensões: {settings.prizeDimensions}</p>
                <p className="mt-4 text-lg font-semibold text-gray-800">Data do Sorteio: <span className="text-rose-600">{settings.drawDate}</span></p>
                <p className="mt-2 text-xl font-bold text-green-600">Valor por número: R$ {settings.numberPrice.toFixed(2).replace('.', ',')}</p>
            </div>
        </div>
    </div>
);

const NumberCell: React.FC<{ number: RaffleNumber; onClick: () => void; }> = ({ number, onClick }) => {
    const statusClasses = useMemo(() => {
        switch (number.status) {
            case NumberStatus.Available: return "bg-green-200 hover:bg-green-300 text-green-800 cursor-pointer";
            case NumberStatus.Reserved: return "bg-yellow-200 text-yellow-800 cursor-not-allowed";
            case NumberStatus.Paid: return "bg-rose-300 text-rose-800 cursor-not-allowed";
            default: return "bg-gray-200 text-gray-800";
        }
    }, [number.status]);

    return (
        <button
            onClick={onClick}
            disabled={number.status !== NumberStatus.Available}
            className={`w-12 h-12 flex items-center justify-center font-bold text-lg rounded-md transition-transform transform hover:scale-110 shadow-md ${statusClasses}`}
        >
            {String(number.id).padStart(2, '0')}
        </button>
    );
};

const AdminNumberCell: React.FC<{ number: RaffleNumber; onClick: () => void; }> = ({ number, onClick }) => {
    const statusClasses = useMemo(() => {
        switch (number.status) {
            case NumberStatus.Available: return "bg-green-100 border-green-300 text-green-800";
            case NumberStatus.Reserved: return "bg-yellow-100 border-yellow-300 text-yellow-800 animate-pulse";
            case NumberStatus.Paid: return "bg-rose-100 border-rose-300 text-rose-800";
            default: return "bg-gray-100 border-gray-300";
        }
    }, [number.status]);

    return (
        <button
            onClick={onClick}
            className={`w-12 h-12 flex items-center justify-center font-bold text-lg rounded-md transition-shadow shadow-sm hover:shadow-lg border-2 ${statusClasses}`}
        >
             {String(number.id).padStart(2, '0')}
        </button>
    );
};


const RaffleGrid: React.FC<{ numbers: RaffleNumber[]; onNumberClick: (number: RaffleNumber) => void; isAdmin: boolean }> = ({ numbers, onNumberClick, isAdmin }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-10 gap-3">
            {numbers.map(number => (
                isAdmin ? 
                <AdminNumberCell key={number.id} number={number} onClick={() => onNumberClick(number)} /> :
                <NumberCell key={number.id} number={number} onClick={() => onNumberClick(number)} />
            ))}
        </div>
         <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-green-200 mr-2"></span>Disponível</div>
            <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-yellow-200 mr-2"></span>Reservado</div>
            <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-rose-300 mr-2"></span>Pago</div>
        </div>
    </div>
);


// --- VIEWS ---
const UserView = () => {
    const context = useContext(RaffleContext) as RaffleContextType;
    const [selectedNumber, setSelectedNumber] = useState<RaffleNumber | null>(null);
    const [buyerInfo, setBuyerInfo] = useState({ name: '', contact: '' });
    const [isReserved, setIsReserved] = useState(false);

    const handleNumberClick = (number: RaffleNumber) => {
        if (number.status === NumberStatus.Available) {
            setSelectedNumber(number);
            setIsReserved(false);
            setBuyerInfo({name: '', contact: ''});
        }
    };

    const handleReserve = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedNumber && buyerInfo.name && buyerInfo.contact) {
            context.reserveNumber(selectedNumber.id, buyerInfo.name, buyerInfo.contact);
            setIsReserved(true);
        }
    };

    const closeModal = () => {
        setSelectedNumber(null);
    }

    return (
        <>
            <PrizeInfo settings={context.settings} />
            <RaffleGrid numbers={context.numbers} onNumberClick={handleNumberClick} isAdmin={false} />

            {selectedNumber && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full relative transform transition-all scale-100">
                        <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">&times;</button>
                        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Número {String(selectedNumber.id).padStart(2, '0')}</h2>
                        
                        {!isReserved ? (
                            <form onSubmit={handleReserve}>
                                <p className="text-center text-gray-600 mb-6">Para reservar, preencha seus dados. Você terá 15 minutos para fazer o pagamento.</p>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                                    <input type="text" id="name" value={buyerInfo.name} onChange={e => setBuyerInfo({...buyerInfo, name: e.target.value})} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"/>
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700">WhatsApp / Contato</label>
                                    <input type="text" id="contact" value={buyerInfo.contact} onChange={e => setBuyerInfo({...buyerInfo, contact: e.target.value})} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"/>
                                </div>
                                <button type="submit" className="w-full bg-rose-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-rose-600 transition-colors">Reservar Número</button>
                            </form>
                        ) : (
                            <div>
                                <h3 className="text-xl font-semibold text-center text-green-600 mb-4">Número Reservado!</h3>
                                <p className="text-center text-gray-700 mb-4">Faça o pagamento via PIX para garantir seu número. Envie o comprovante se necessário.</p>
                                <div className="bg-gray-100 p-4 rounded-lg text-center">
                                    <p className="text-sm text-gray-600">Chave PIX (Celular)</p>
                                    <p className="text-lg font-mono font-bold text-gray-800 tracking-wider my-2">{context.settings.pixKey}</p>
                                    <p className="font-bold text-xl text-rose-600">Valor: R$ {context.settings.numberPrice.toFixed(2).replace('.', ',')}</p>
                                </div>
                                <button onClick={closeModal} className="mt-6 w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors">Fechar</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

const AdminView = () => {
    const context = useContext(RaffleContext) as RaffleContextType;
    const [currentSettings, setCurrentSettings] = useState<RaffleSettings>(context.settings);
    const [selectedNumber, setSelectedNumber] = useState<RaffleNumber | null>(null);
    const stats = context.getStats();

    const participants = useMemo(() =>
        context.numbers
            .filter(n => n.status === NumberStatus.Paid || n.status === NumberStatus.Reserved)
            .sort((a, b) => a.id - b.id),
        [context.numbers]
    );

    useEffect(() => {
        setCurrentSettings(context.settings);
    }, [context.settings]);

    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setCurrentSettings(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };

    const saveSettings = () => {
        context.updateSettings(currentSettings);
        alert("Configurações salvas!");
    };
    
    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Painel do Administrador</h2>
                
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
                    <div className="bg-green-100 p-4 rounded-lg"><p className="text-2xl font-bold text-green-700">{stats.available}</p><p className="text-sm text-green-600">Disponíveis</p></div>
                    <div className="bg-yellow-100 p-4 rounded-lg"><p className="text-2xl font-bold text-yellow-700">{stats.reserved}</p><p className="text-sm text-yellow-600">Reservados</p></div>
                    <div className="bg-rose-100 p-4 rounded-lg"><p className="text-2xl font-bold text-rose-700">{stats.paid}</p><p className="text-sm text-rose-600">Pagos</p></div>
                </div>

                {/* Settings Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="prizeDescription" className="block text-sm font-medium text-gray-700">Descrição do Prêmio</label>
                        <input type="text" name="prizeDescription" value={currentSettings.prizeDescription} onChange={handleSettingsChange} className="mt-1 block w-full input"/>
                    </div>
                     <div>
                        <label htmlFor="drawDate" className="block text-sm font-medium text-gray-700">Data do Sorteio</label>
                        <input type="text" name="drawDate" value={currentSettings.drawDate} onChange={handleSettingsChange} className="mt-1 block w-full input"/>
                    </div>
                     <div>
                        <label htmlFor="numberPrice" className="block text-sm font-medium text-gray-700">Valor (R$)</label>
                        <input type="number" name="numberPrice" value={currentSettings.numberPrice} onChange={handleSettingsChange} className="mt-1 block w-full input"/>
                    </div>
                     <div>
                        <label htmlFor="pixKey" className="block text-sm font-medium text-gray-700">Chave PIX</label>
                        <input type="text" name="pixKey" value={currentSettings.pixKey} onChange={handleSettingsChange} className="mt-1 block w-full input"/>
                    </div>
                     <div>
                        <label htmlFor="totalNumbers" className="block text-sm font-medium text-gray-700">Total de Números</label>
                        <input type="number" name="totalNumbers" value={currentSettings.totalNumbers} onChange={handleSettingsChange} className="mt-1 block w-full input"/>
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <button onClick={saveSettings} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">Salvar Configurações</button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Participantes</h2>
                <div className="overflow-x-auto">
                    {participants.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {participants.map(number => (
                                    <tr key={number.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{String(number.id).padStart(2, '0')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{number.buyerName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{number.buyerContact}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${number.status === NumberStatus.Paid ? 'bg-rose-100 text-rose-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {number.status === NumberStatus.Paid ? 'Pago' : 'Reservado'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {number.status === NumberStatus.Reserved && (
                                                <button
                                                    onClick={() => context.confirmPayment(number.id)}
                                                    className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1 px-3 rounded-full transition-colors"
                                                >
                                                    Marcar como Pago
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-gray-500">Nenhum número foi reservado ou pago ainda.</p>
                    )}
                </div>
            </div>

            <RaffleGrid numbers={context.numbers} onNumberClick={(num) => setSelectedNumber(num)} isAdmin={true} />

            {selectedNumber && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full relative">
                         <button onClick={() => setSelectedNumber(null)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">&times;</button>
                         <h3 className="text-xl font-bold text-center mb-4">Gerenciar Número {String(selectedNumber.id).padStart(2, '0')}</h3>
                         {selectedNumber.status !== NumberStatus.Available && (
                            <div className="bg-gray-50 p-3 rounded-md mb-4 text-sm">
                                <p><span className="font-semibold">Comprador:</span> {selectedNumber.buyerName}</p>
                                <p><span className="font-semibold">Contato:</span> {selectedNumber.buyerContact}</p>
                            </div>
                         )}
                         <div className="flex flex-col space-y-3">
                            {selectedNumber.status === NumberStatus.Reserved && (
                                <button onClick={() => { context.confirmPayment(selectedNumber.id); setSelectedNumber(null); }} className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">Confirmar Pagamento</button>
                            )}
                            {selectedNumber.status !== NumberStatus.Available && (
                                <button onClick={() => { context.releaseNumber(selectedNumber.id); setSelectedNumber(null); }} className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600">Liberar Número</button>
                            )}
                             {selectedNumber.status === NumberStatus.Available && (
                                <p className="text-center text-gray-500">Este número está disponível.</p>
                            )}
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};


// --- MAIN APP COMPONENT ---
const RafflePage = () => {
    const [isAdminView, setIsAdminView] = useState(false);
    const context = useContext(RaffleContext);

    if (!context) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="min-h-screen bg-rose-50 font-sans text-gray-800 pb-24">
            <header className="bg-gray-800 text-white p-6 shadow-md">
                <div className="container mx-auto flex items-center justify-center relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 bg-rose-500 p-2 rounded-full shadow-lg">
                        <HeartIcon />
                    </div>
                    <div className="flex flex-col items-center mt-16 text-center">
                        <h1 className="text-5xl font-extrabold" style={{ fontFamily: 'Impact, sans-serif' }}>RIFA</h1>
                        <h2 className="text-4xl font-light" style={{ fontFamily: 'Brush Script MT, cursive' }}>Solidária</h2>
                    </div>
                </div>
            </header>
            <main className="container mx-auto p-4">
                {isAdminView ? <AdminView /> : <UserView />}
            </main>
            <button
                onClick={() => setIsAdminView(!isAdminView)}
                title={isAdminView ? "Ver como usuário" : "Ver como administrador"}
                className="fixed bottom-6 right-6 bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 transition-colors"
            >
                {isAdminView ? <UserIcon /> : <AdminIcon />}
            </button>
        </div>
    );
}

function App() {
  return (
    <RaffleProvider>
      <style>{`
          .input {
            @apply mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500;
          }
      `}</style>
      <RafflePage />
    </RaffleProvider>
  );
}

export default App;
