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
    driverName?: string;
    rating?: number;
    totalRatings?: number;
    phone?: string;
    email?: string;
    vehicleType?: string;
    plateNumber?: string;
    color?: string;
    profileImage?: string;
    distance?: string | null;
    duration?: string | null;
    driverId?: string | null;
    userId?: string | null;
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
    driverName,
    rating,
    totalRatings,
    phone,
    email,
    vehicleType,
    plateNumber,
    color,
    profileImage,
    distance,
    duration,
    driverId,
    userId
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
                    driverName={driverName}
                    rating={rating}
                    totalRatings={totalRatings}
                    profileImage={profileImage}
                    arrivalDistance={distance}
                    arrivalTime={duration}
                />
            )}

            {/* DRIVER DETAILS OVERLAY */}
            {showDriverDetails && (
                <DriverDetails
                    onClose={onCloseDriverDetails}
                    driverName={driverName}
                    rating={rating}
                    totalRatings={totalRatings}
                    phone={phone}
                    email={email}
                    vehicleType={vehicleType}
                    plateNumber={plateNumber}
                    color={color}
                    profileImage={profileImage}
                />
            )}

            {/* CHAT SCREEN */}
            {showChat && (
                <ChatScreen
                    onClose={onCloseChat}
                    driverId={driverId}
                    userId={userId}
                    driverName={driverName}
                    driverImage={profileImage}
                />
            )}
        </>
    );
};
