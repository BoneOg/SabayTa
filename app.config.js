import 'dotenv/config';

export default {
    expo: {
        name: "SabayTa",
        slug: "sabayta",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/SabayTa_logo...png",
        scheme: "sabayta",
        userInterfaceStyle: "light",
        newArchEnabled: true,
        ios: {
            supportsTablet: true
        },
        android: {
            adaptiveIcon: {
                backgroundColor: "#E6F4FE",
                foregroundImage: "./assets/images/SabayTa_logo...png",
                backgroundImage: "./assets/images/SabayTa_logo...png",
                monochromeImage: "./assets/images/SabayTa_logo...png"
            },
            edgeToEdgeEnabled: true,
            predictiveBackGestureEnabled: false,
            package: "com.boneog.sabayta",
            config: {
                googleMaps: {
                    apiKey: process.env.GOOGLE_MAPS_API_URL
                }
            }
        },
        web: {
            output: "static",
            favicon: "./assets/images/SabayTa_logo...png"
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff",
                    dark: {
                        backgroundColor: "#000000"
                    }
                }
            ],
            "expo-font"
        ],
        experiments: {
            typedRoutes: true,
            reactCompiler: true
        },
        extra: {
            router: {},
            eas: {
                projectId: "2ec44214-e1a1-4fec-871b-d937393b11ab"
            }
        }
    }
};
