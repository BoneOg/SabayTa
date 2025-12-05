import React from 'react';
import ChatScreen from '../../app/user/chat';
import { DriverArrival } from '../driver/DriverArrival';
import { DriverDetails } from '../driver/DriverDetails';
import { DriverSearchLoading } from '../Loading';

interface DriverComponentsProps {
    driverSearchVisible: boolean;
    driverArrivalVisible: boolean;
    showDriverDetails: boolean;
    showChat: boolean;
    onCancelBooking: () => void;
    onCloseDriverArrival: () => void;
    onMessagePress: () => void;
    onDetailsPress: () => void;
    onCloseDriverDetails: () => void;
    onCloseChat: () => void;
}

export const DriverComponents: React.FC<DriverComponentsProps> = ({
    driverSearchVisible,
    driverArrivalVisible,
    showDriverDetails,
    showChat,
    onCancelBooking,
    onCloseDriverArrival,
    onMessagePress,
    onDetailsPress,
    onCloseDriverDetails,
    onCloseChat,
}) => {
    return (
        <>
            {/* DRIVER SEARCH LOADING */}
            <DriverSearchLoading
                visible={driverSearchVisible}
                onCancel={onCancelBooking}
            />

            {/* DRIVER ARRIVAL */}
            {driverArrivalVisible && !showChat && (
                <DriverArrival
                    isSearching={driverSearchVisible}
                    visible={driverArrivalVisible}
                    onClose={onCloseDriverArrival}
                    onCancelPress={onCancelBooking}
                    onMessagePress={onMessagePress}
                    onDetailsPress={onDetailsPress}
                />
            )}

            {/* DRIVER DETAILS OVERLAY */}
            {showDriverDetails && (
                <DriverDetails onClose={onCloseDriverDetails} />
            )}

            {/* CHAT SCREEN */}
            {showChat && (
                <ChatScreen onClose={onCloseChat} />
            )}
        </>
    );
};
