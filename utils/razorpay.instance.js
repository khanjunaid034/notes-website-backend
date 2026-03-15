import Razorpay from "razorpay";

const rzp = new Razorpay({
    key_id: process.env.RZP_KEY,
    key_secret: process.env.RZP_SECRET
});


export default rzp;