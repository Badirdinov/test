import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import Tickets from '@/tickets.json';
import './App.css'


interface ICurrency {
    id: number;
    currency: string;
}

const initialCurrencies: ICurrency[] = [
    { id: 1, currency: 'RUB' },
    { id: 2, currency: 'USD' },
    { id: 3, currency: 'EUR' }
];

const App: React.FC = () => {
    const [activeCurrency, setActiveCurrency] = useState<number>(1);
    const [filteredTickets, setFilteredTickets] = useState(Tickets.tickets);
    const [stopsId, setStopsId] = useState([])
    const sortedTickets = Tickets.tickets.sort((a, b) => a.price - b.price);

    useEffect(() => {
        setFilteredTickets(sortedTickets)
    }, []);

    useEffect(() => {
        if (stopsId.includes('all') || stopsId.length === 0) {
            setFilteredTickets(Tickets.tickets);
        } else {
            const filters = Tickets.tickets.filter((ticket) => stopsId.includes(ticket.stops));
            setFilteredTickets(filters);
        }
    }, [activeCurrency, stopsId]);

    const handleCurrencyClick = (id: number) => {
        setActiveCurrency(id);
    };

    const handleCheckboxChange = (id: any) => {
        setStopsId((prevState) => {
            if (prevState.includes(id)) {
                return prevState.filter(stopId => stopId !== id);
            } else {
                return [...prevState, id];
            }
        });
    };

    console.log(stopsId)


    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            weekday: 'short',
        };
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', options);
    };

    console.log(filteredTickets)

    return (
        <section>
            <div className={'flex items-center justify-center my-[20px] md:my-[40px]'}>
                <img width={100} height={100} src="/logo.png" alt="Image"/>
            </div>
            <div className={'wrapper'}>
                <div className="filters">
                    <div className="filters-items">
                        <h2>Валюта</h2>
                        <div className="currency">
                            {initialCurrencies.map(currency => (
                                <Button
                                    key={currency.id}
                                    variant={activeCurrency === currency.id ? 'default' : 'outline'}
                                    onClick={() => handleCurrencyClick(currency.id)}
                                >
                                    {currency.currency}
                                </Button>
                            ))}
                        </div>
                        <h2>Количество пересадок</h2>
                        <div className={'checkboxes'}>
                            <div  className="checkboxes-item flex items-center space-x-4">
                                <Checkbox id={'all'} onClick={() => handleCheckboxChange('all')} />
                                <label
                                    htmlFor={'all'}
                                    className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                   Все
                                </label>
                            </div>
                            {[0, 1, 2, 3].map(numStops => (
                                <div key={numStops} className="checkboxes-item flex items-center space-x-4">
                                    <Checkbox id={String(numStops)} onClick={() => handleCheckboxChange(numStops)} />
                                    <label
                                        htmlFor={String(numStops)}
                                        className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {numStops === 0  ?  'Без пересадок' : `${numStops} пересадки`}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={'tickets'}>
                    {filteredTickets.map((ticket, index) => (
                        <div key={index} className={'ticket'}>
                            <div className={'ticket-left'}>
                                <div className={'w-[180px] mx-auto mb-[24px]'}>
                                    <img src="/logo-ticket.png" alt="Image"/>
                                </div>
                                <Button variant={'secondary'} className={'w-full rounded-md py-[10px]'}>
                                    Купить <br/>
                                    за {ticket.price} Р
                                </Button>
                            </div>
                            <div className={'ticket-right'}>
                                <div className={'time'}>
                                    <div className={'to'}>
                                        <h1>{ticket.departure_time}</h1>
                                    </div>
                                    <div className={'line'}>
                                        <h2>{ticket.stops === 0 ? 'Без пересадок' : ticket.stops === 1 ? `${ticket.stops} Пересадка` : `${ticket.stops} Пересадки` } </h2>
                                        <div className={'line-air'}>
                                            <img width={28} src="/air-icon.svg" alt="Image"/>
                                        </div>
                                    </div>
                                    <div className={'to'}>
                                        <h1>{ticket.arrival_time}</h1>
                                    </div>
                                </div>
                                <div className={'origin'}>
                                    <div className={'origin-name'}>
                                        <h3>{ticket.origin_name}, {ticket.origin}</h3>
                                        <p>{formatDate(ticket.departure_date)}</p>
                                    </div>
                                    <div className={'destination-name'}>
                                        <h3>{ticket.destination_name}, {ticket.destination}</h3>
                                        <p>{formatDate(ticket.arrival_date)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default App;