import { connect } from "mongoose";

export const dbConnect = () => {
    connect(process.env.MONGODB_URI).then(
        () => console.log("Database Connected Successfuly"),
        (error) => console.log(error)
    );
};