import { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [lastBooking, setLastBooking] = useState(null);

    const saveBooking = (bookingData) => {
        setLastBooking(bookingData);
    };

    return (
        <BookingContext.Provider value={{ lastBooking, saveBooking }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => useContext(BookingContext);
