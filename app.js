const express = require("express");
const cors = require("cors");
const connectDB = require("./configs/database");
const router = require("./routers");
require("dotenv").config();
const bodyParser = require("body-parser");
const qs = require("qs");
const CryptoJS = require("crypto-js");
const moment = require("moment");
const axios = require("axios");
const http = require("http");
const socketIo = require("socket.io");

const jwt = require('jsonwebtoken');
const config = {
    app_id: "2554",
    key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
    key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

const app = express();
const server = http.createServer(app); // Tạo server http
const io = socketIo(server, {
  transports: ['websocket', 'polling'],
  cors: {
    origin:"http://localhost:5173", // Cập nhật URL frontend của bạn
    methods: ["GET", "POST"],
  }
});

// Middleware
app.use(
  cors({
    origin: process.env.REACT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.REACT_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Xử lý yêu cầu thanh toán ZaloPay
app.post("/payment", async (req, res) => {
  const embed_data = {
      redirecturl: "http://localhost:5173/Order_suc"
  };
  const { amount } = req.body; 
  const items = [{}];
  const transID = Math.floor(Math.random() * 1000000);
  const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
      app_user: "user123",
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: amount, 
      description: `Lazada - Payment for the order #${transID}`,
      bank_code: "",
      callback_url: 'https://9317-27-64-54-208.ngrok-free.app/callback', // Callback khi thanh toán xong
  };

  const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
      console.log("Sending data to ZaloPay: ", order); // Ghi log dữ liệu sẽ gửi
      const result = await axios.post(config.endpoint, null, { params: order });
      console.log("ZaloPay Response: ", result.data); // Ghi log phản hồi từ ZaloPay
      
      if (result.data && result.data.return_code === 1 && result.data.order_url) {
          return res.json({
              order_url: result.data.order_url
          });
      } else {
          console.error("ZaloPay API Error: ", result.data);
          return res.status(500).json({ error: "Error from ZaloPay API" });
      }

  } catch (error) {
      console.error("Error during ZaloPay payment request: ", error.message); // Ghi log chi tiết lỗi
      return res.status(500).json({ error: error.message });
  }
});

// Callback khi ZaloPay trả về thông tin thanh toán
app.post('/callback', (req, res) => {
  let result = {};
  try {
      let dataStr = req.body.data;
      let reqMac = req.body.mac;

      let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

      if (reqMac !== mac) {
          result.return_code = -1;
          result.return_message = "mac not equal";
      } else {
          let dataJson = JSON.parse(dataStr);
          console.log("Update order's status = success where app_trans_id =", dataJson["app_trans_id"]);
          result.return_code = 1;
          result.return_message = "success";
      }
  } catch (ex) {
      result.return_code = 0;
      result.return_message = ex.message;
  }

  res.json(result);
});

// Kiểm tra trạng thái đơn hàng
app.post('/check-status-order/:app_trans_id', async (req, res) => {
  const app_trans_id = req.params.app_trans_id;

  let postData = {
      app_id: config.app_id,
      app_trans_id: app_trans_id
  };

  let data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1;
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
      method: 'post',
      url: 'https://sb-openapi.zalopay.vn/v2/query',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify(postData),
  };

  try {
      const result = await axios(postConfig);
      console.log(result.data);
      return res.status(200).json(result.data);
  } catch (error) {
      console.log('Error:', error);
      return res.status(500).json({ error: error.message });
  }
});


connectDB();


router(app);


let users = {}; 

io.on('connection', (socket) => {
    console.log('New user connected');

    // Xử lý khi người dùng đăng nhập thành công
    socket.on('login', (token) => {
      console.log('Received token:', token);
        try {
            const decoded = jwt.verify(token,"123");
            console.log('Decoded token:', decoded);
            // Kiểm tra xem socket.id đã có trong users chưa, nếu có thì không thêm
            if (!users[socket.id]) {
                users[socket.id] = { userId: decoded.userId, role: decoded.role };
                console.log(`${decoded.role} logged in with socket id: ${socket.id}`);
            }
        } catch (err) {
            console.log('Invalid token', err.message);
            socket.disconnect(); 
        }
    });


socket.on('sendMessage', (data) => {
    const { message, role } = data;
    const messageData = { role, message };
  
    if (role === 'user') {
      // Gửi tin nhắn đến Admin
      for (let id in users) {
        if (users[id].role === 'adminPage1') {
          io.to(id).emit('receiveMessage', messageData); // Gửi tin nhắn tới admin
          break;
        }
      }
    } else if (role === 'adminPage1') {
      // Gửi tin nhắn từ Admin đến User
      for (let id in users) {
        if (users[id].role === 'user') {
          io.to(id).emit('receiveMessage', messageData); // Gửi tin nhắn tới user
          break;
        }
      }
    }
  });

    // Xử lý khi người dùng ngắt kết nối
    socket.on('disconnect', () => {
        delete users[socket.id];
        console.log('User disconnected:', socket.id);
    });


  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });
  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err);
  });
  
});

// Lắng nghe server trên cổng 5000
server.listen(5000, () => {
  console.log("Server đang chạy trên cổng 5000...");
});
