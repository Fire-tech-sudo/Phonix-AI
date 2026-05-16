import crypto from "crypto";

const order_id = "order_Sq48ebDski9DUC"; // Step 2 ka order.id
const payment_id = "pay_testPayment123"; // koi bhi fake value

const signature = crypto
    .createHmac("sha256", "5dQWC9iozuzBBVFiwQ2oHUwF") // .env wali value
    .update(`${order_id}|${payment_id}`)
    .digest("hex");

console.log(signature);
