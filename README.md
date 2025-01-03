# Fashion Forecast

Fashion Forecast is a web application that helps users plan their outfits based on the weather forecast. Users can sign up, log in, and receive outfit suggestions tailored to their location and weather conditions.


<img src="https://github.com/user-attachments/assets/29287445-d2dd-4e66-9041-3122d2078390">
<img src="https://github.com/user-attachments/assets/8318dab1-2f19-4742-87c9-06867b32fcc6">

<p float=left>
<img src="https://github.com/user-attachments/assets/3d728209-ae8e-402a-9c06-ddb63db99ea9" width="260" height="500">
<img src="https://github.com/user-attachments/assets/1a5dde43-3b5c-4b3b-83cf-7f8b1b941aa0" width="260" height="500">
<img src="https://github.com/user-attachments/assets/085b002e-94ef-4ba6-8b3d-a58acba914f9" width="260" height="500">
</p>

<p float=left>
   <img src="https://github.com/user-attachments/assets/46f0f599-2c8a-4dcf-96b6-8074d132ab59" width="260" height="500">
   <img src="https://github.com/user-attachments/assets/4ad6d6ab-3812-41b2-84cd-b7666c528252" width="260" height="500">
   <img src="https://github.com/user-attachments/assets/ab94cd46-2cb2-4def-aca1-841aa9af4123" width="260" height="500"> 
</p>

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)


## Features

- User authentication with email and username
- Weather-based outfit suggestions
- Responsive design for various screen sizes
- Integration with external weather and geolocation services

## Installation

To get a local copy up and running, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/fashion-forecast.git
   cd fashion-forecast
   ```

2. **Install dependencies:**

   Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add your environment variables:

   ```plaintext
   DB_STRING=your_database_connection_string
   DB_NAME=your_database_name
   SESSION_SECRET=your_session_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=3000
   WEATHER_API_KEY= your_weather_api_key
   ```
   - **Cloudinary Setup**: 
     - Sign up for a [Cloudinary account](https://cloudinary.com/).
     - Once logged in, navigate to the Cloudinary Dashboard to find your **Cloud Name**, **API Key**, and **API Secret**.
     - Add these credentials to your `.env` file as shown above.

4. **Run the application:**

   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`.

## Usage

- **Sign Up**: Create an account using your email, username, and password.
- **Log In**: Access your account using either your email or username along with your password.
- **Get Outfit Suggestions**: Receive outfit recommendations based on the current weather in your location.

## Configuration

- **Database**: The application uses MongoDB. Ensure your MongoDB instance is running and accessible.
- **Weather and Geolocation Services**: Integrate with external APIs for weather and geolocation data. Ensure you have the necessary API keys and configurations.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.
