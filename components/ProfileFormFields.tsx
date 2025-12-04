import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Field {
    key: string;
    label: string;
    value: string;
}

interface ProfileFormFieldsProps {
    fields: Field[];
    onFieldPress: (key: string, value: string) => void;
    sections?: {
        title: string;
        fieldKeys: string[];
    }[];
}

export default function ProfileFormFields({ fields, onFieldPress, sections }: ProfileFormFieldsProps) {
    const renderField = (field: Field) => {
        // Special rendering for phone field
        if (field.key === 'phone') {
            return (
                <TouchableOpacity
                    key={field.key}
                    style={styles.rowInput}
                    onPress={() => onFieldPress(field.key, field.value)}
                >
                    <View style={styles.countryCodeBox}>
                        <Text style={styles.countryCode}>🇵🇭 +63</Text>
                    </View>
                    <View style={styles.phoneInputContainer}>
                        <Text style={field.value ? styles.inputText : styles.placeholderText}>
                            {field.value || field.label}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }

        // Regular field rendering
        return (
            <TouchableOpacity
                key={field.key}
                style={styles.input}
                onPress={() => onFieldPress(field.key, field.value)}
            >
                <Text style={field.value ? styles.inputText : styles.placeholderText}>
                    {field.value || field.label}
                </Text>
            </TouchableOpacity>
        );
    };

    if (sections) {
        return (
            <>
                {sections.map((section) => (
                    <View key={section.title} style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        {section.fieldKeys.map((key) => {
                            const field = fields.find(f => f.key === key);
                            return field ? renderField(field) : null;
                        })}
                    </View>
                ))}
            </>
        );
    }

    return (
        <>
            {fields.map(renderField)}
        </>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        width: '100%',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#534889',
        fontFamily: 'Poppins',
        marginBottom: 12,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: '#F8F8F8',
        marginBottom: 15,
        justifyContent: 'center',
    },
    inputText: {
        fontSize: 16,
        color: '#414141',
        fontFamily: 'Poppins',
    },
    placeholderText: {
        fontSize: 16,
        color: '#D0D0D0',
        fontFamily: 'Poppins',
    },
    rowInput: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
    },
    countryCodeBox: {
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderRadius: 6,
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginRight: 8,
        backgroundColor: '#fff',
    },
    countryCode: {
        fontFamily: 'Poppins',
        color: '#414141',
        fontSize: 15,
    },
    phoneInputContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
    },
});
