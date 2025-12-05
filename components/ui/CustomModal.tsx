import Button from '@/components/Button';
import { Modal, StyleSheet, Text, View } from 'react-native';

interface CustomModalProps {
    visible: boolean;
    title: string;
    message: string;
    variant?: 'withButton' | 'noButton' | 'twoButtons';
    onClose?: () => void;
    buttonText?: string;
    secondaryButtonText?: string;
    onSecondaryPress?: () => void;
}

export default function CustomModal({
    visible,
    title,
    message,
    variant = 'withButton',
    onClose,
    buttonText = 'OK',
    secondaryButtonText = 'Cancel',
    onSecondaryPress,
}: CustomModalProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    {variant === 'withButton' && (
                        <View style={styles.buttonContainer}>
                            <Button
                                label={buttonText}
                                onPress={onClose || (() => { })}
                                style={styles.button}
                            />
                        </View>
                    )}

                    {variant === 'twoButtons' && (
                        <View style={styles.rowButtonContainer}>
                            <Button
                                label={secondaryButtonText}
                                onPress={onSecondaryPress || (() => { })}
                                variant="outline"
                                style={[styles.halfButton, { marginRight: 10 }]}
                            />
                            <Button
                                label={buttonText}
                                onPress={onClose || (() => { })}
                                style={styles.halfButton}
                            />
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#414141',
        marginBottom: 12,
        fontFamily: 'Poppins',
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        fontFamily: 'Poppins',
        lineHeight: 22,
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        width: '100%',
        borderRadius: 12,
    },
    rowButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    halfButton: {
        flex: 1,
        borderRadius: 12,
    }
});
