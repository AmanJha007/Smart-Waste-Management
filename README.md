# ♻️ Smart Waste Management System (IoT + MERN Stack)

A real-time IoT-based waste monitoring system that tracks dustbin fill levels and optimizes garbage collection routes. Built using the **MERN Stack** (MongoDB, Express, React, Node.js) and **ESP32** hardware.

![Project Status](https://img.shields.io/badge/Status-Prototype%20Complete-success)
![Tech Stack](https://img.shields.io/badge/Tech-MERN%20%2B%20IoT-blueviolet)

## 📌 Project Overview
Inefficient waste management leads to overflowing bins and fuel wastage. This project solves that by:
1.  **Monitoring** dustbin levels in real-time using Ultrasonic Sensors.
2.  **Visualizing** data on a live interactive map.
3.  **Alerting** authorities when bins cross 80% capacity.
4.  **Optimizing** collection routes to visit only full bins (Green Route Algorithm).

---

## 📸 Screenshots

| **Dashboard View** | **Route Optimization** |
|:---:|:---:|
| ![Dashboard](https://via.placeholder.com/400x200?text=Paste+Your+Dashboard+Image+Link+Here) | ![Map](https://via.placeholder.com/400x200?text=Paste+Your+Map+Image+Link+Here) |
*(Note: Replace these placeholder links with your actual screenshots)*

---

## 🛠️ Tech Stack

### **Software (Web Dashboard)**
* **Frontend:** React.js, Vite, Leaflet Maps (for tracking), Recharts (for analytics).
* **Backend:** Node.js, Express.js.
* **Database:** In-memory storage (Prototype) / MongoDB (Production ready).
* **API:** REST API for communication between Hardware & Web.

### **Hardware (IoT Device)**
* **Microcontroller:** ESP32 (Wi-Fi enabled).
* **Sensors:** HC-SR04 Ultrasonic Sensor (measures trash distance).
* **Protocol:** HTTP POST Requests (sending JSON data to server).

---

## ⚙️ How It Works (Architecture)

1.  **Detection:** The **HC-SR04** sensor measures the distance from the bin lid to the trash.
2.  **Processing:** The **ESP32** calculates the fill percentage:
    * `30cm` distance = 0% Full (Empty).
    * `5cm` distance = 100% Full.
3.  **Transmission:** The ESP32 sends a `POST` request with the data (Bin ID, Level, GPS Coords) to the **Node.js Server**.
4.  **Visualization:** The **React Dashboard** fetches this data every 2 seconds and updates the map markers (Green → Red).

---

## 🚀 How to Run Locally

### **1. Clone the Repository**
```bash
git clone [https://github.com/YOUR_USERNAME/smart-waste-management-system.git](https://github.com/YOUR_USERNAME/smart-waste-management-system.git)
cd smart-waste-management-system
