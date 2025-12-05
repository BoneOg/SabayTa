import mongoose from "mongoose";

const favoriteLocationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    placeName: {
        type: String,
        required: true
    },
    placeAddress: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    placeId: {
        type: String,
        default: ""
    },
    customLabel: {
        type: String,
        default: ""
    },
    iconName: {
        type: String,
        default: "location-sharp"
    }
}, { timestamps: true });

// Create compound index to prevent duplicate favorites
favoriteLocationSchema.index({ userId: 1, placeId: 1 }, { unique: true });

const FavoriteLocation = mongoose.model("FavoriteLocation", favoriteLocationSchema);

export default FavoriteLocation;
