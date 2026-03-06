from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import requests
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import certifi
import random
from flask_mail import Mail, Message

app = Flask(__name__)
app.secret_key = "agronex_secret_key"
# ===============================
# EMAIL CONFIG
# ===============================

import os

app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 465
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USE_SSL"] = False
app.config["MAIL_USERNAME"] = os.environ.get("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.environ.get("MAIL_PASSWORD")
app.config["MAIL_DEFAULT_SENDER"] = os.environ.get("MAIL_USERNAME")

# important settings
app.config["MAIL_MAX_EMAILS"] = 5
app.config["MAIL_ASCII_ATTACHMENTS"] = False
app.config["MAIL_TIMEOUT"] = 10

mail = Mail(app)

# ===============================
# MongoDB Connection
# ===============================

client = MongoClient(
    "mongodb+srv://dhruv61222_dbuser:Dhruv61222@dhruv6122.a9axfjv.mongodb.net/?retryWrites=true&w=majority",
    tls=True,
    tlsCAFile=certifi.where()
)
db = client["agronex"]
users_collection = db["users"]

# ===============================
# Google Client ID
# ===============================
GOOGLE_CLIENT_ID = "795330881278-sc3r8slgr7bb5mpbk5vv4s6rec179132.apps.googleusercontent.com"

# ===============================
# HOME
# ===============================
@app.route("/")
def home():
    return render_template("index.html")

# ===============================
# LOGIN
# ===============================
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email").lower()
        password = request.form.get("password")

        user = users_collection.find_one({"email": email})

        print("USER FROM DB:", user)
        print("ENTERED PASSWORD:", password)

        if user:
            print("STORED HASH:", user["password"])
            print("HASH CHECK:", check_password_hash(user["password"], password))

        if user and check_password_hash(user["password"], password):
            session["user"] = user["name"]
            session["email"] = user["email"]
            return redirect(url_for("dashboard"))
        else:
            flash("Invalid email or password!")
            return redirect(url_for("login"))

    return render_template("login.html", google_client_id=GOOGLE_CLIENT_ID)
# ===============================
# REGISTER
# ===============================
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        password = request.form.get("password")

        if users_collection.find_one({"email": email}):
            flash("Email already exists!")
            return redirect(url_for("register"))

        hashed_password = generate_password_hash(password)

        users_collection.insert_one({
            "name": name,
            "email": email,
            "password": hashed_password
        })

        flash("Registration successful! Please login.")
        return redirect(url_for("login"))

    return render_template("register.html")

# ===============================
# FORGOT PASSWORD (SEND OTP)
# ===============================
@app.route("/forgot-password", methods=["GET", "POST"])
def forgot_password():

    if request.method == "POST":

        email = request.form.get("email").lower()
        user = users_collection.find_one({"email": email})

        if not user:
            flash("No account found with this email.", "forgot_error")
            return redirect(url_for("forgot_password"))

        otp = str(random.randint(100000, 999999))

        session["reset_email"] = email
        session["otp"] = otp

        try:
            msg = Message(
                "AgroNex Password Reset OTP",
                recipients=[email]
            )

            msg.body = f"Your AgroNex OTP is: {otp}"
            with mail.connect() as conn:
                conn.send(msg)


        except Exception as e:
            print("MAIL ERROR:", e)
            flash("Email service failed. Try again later.")
            return redirect(url_for("forgot_password"))

        flash("OTP sent to your email.")
        return redirect(url_for("verify_otp"))

    return render_template("forgot_password.html")
# ===============================
# VERIFY OTP
# ===============================
@app.route("/verify-otp", methods=["GET", "POST"])
def verify_otp():

    if request.method == "POST":

        entered_otp = request.form.get("otp")

        if entered_otp == session.get("otp"):
            return redirect(url_for("reset_password"))

        flash("Invalid OTP", "forgot_error")

    return render_template("verify_otp.html")

# ===============================
# RESET PASSWORD
# ===============================
@app.route("/reset-password", methods=["GET", "POST"])
def reset_password():

    if "reset_email" not in session:
        return redirect("/login")

    if request.method == "POST":
        new_password = request.form.get("password")

        hashed_password = generate_password_hash(new_password)

        users_collection.update_one(
            {"email": session["reset_email"]},
            {"$set": {"password": hashed_password}}
        )

        session.pop("reset_email", None)

        flash("Password updated successfully!")
        return redirect("/login")

    return render_template("reset_password.html")
# ===============================
# GOOGLE LOGIN
# ===============================
@app.route("/google-login", methods=["POST"])
def google_login():
    token = request.json["credential"]

    response = requests.get(
        f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
    )

    user_info = response.json()

    session["user"] = user_info.get("name")
    session["email"] = user_info.get("email")

    return {"status": "success"}

# ===============================
# DASHBOARD
# ===============================
@app.route("/dashboard")
def dashboard():
    if "user" not in session:
        flash("You must login first!")
        return redirect(url_for("login"))
    return render_template("dashboard.html")

# ===============================
# LOGOUT
# ===============================
@app.route("/logout")
def logout():
    session.clear()
    flash("You have been logged out successfully!", "logout")
    return redirect(url_for("home"))

# ===============================
# ABOUT
# ===============================
@app.route("/about")
def about():
    return render_template("about.html")

# ===============================
# CONTACT
# ===============================
@app.route("/contact")
def contact():
    return render_template("contact.html")
# ===============================
# LIVE WEATHER FROM INTERNET
# ===============================

API_KEY = "591f15e70fa0468192595912260303"
CITY = "Ahmedabad"

@app.route("/live-data")
def live_data():
    url = f"http://api.openweathermap.org/data/2.5/weather?q={CITY}&appid={API_KEY}&units=metric"
    
    response = requests.get(url)
    data = response.json()

    print("API RESPONSE:", data)

    temperature = data["main"]["temp"]
    humidity = data["main"]["humidity"]

    return jsonify({
        "temperature": temperature,
        "humidity": humidity
    })
# ===============================
# RUN
# ===============================
if __name__ == "__main__":
    app.run(debug=True)
