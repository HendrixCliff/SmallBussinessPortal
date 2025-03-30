const axios = require("axios");
const dotenv = require("dotenv")
dotenv.config({path: "./config.env"})

const PAGE_ACCESS_TOKEN = "YOUR_LONG_LIVED_ACCESS_TOKEN";

// curl -i -X GET "https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=EAASoSZApm92ABOZB93dH8OMVeihWtpOZBVEZBIelhjhdJhUrzDirFPYZB9qiZAZB8KEyg3KUsRje01xSZAm2qSKfw3yQg7fGLGP8YBTLW2WInNae56SXyowZBj035JCAyzGP9kaHSXCjfXGJi6dZBdYHobs2EirPxWhJ0orta8C8GEGmzhEZBWx42LdreVYklJFex94"
// curl -i -X GET "https://graph.facebook.com/debug_token?input_token=EAASoSZApm92ABOZB93dH8OMVeihWtpOZBVEZBIelhjhdJhUrzDirFPYZB9qiZAZB8KEyg3KUsRje01xSZAm2qSKfw3yQg7fGLGP8YBTLW2WInNae56SXyowZBj035JCAyzGP9kaHSXCjfXGJi6dZBdYHobs2EirPxWhJ0orta8C8GEGmzhEZBWx42LdreVYklJFex94&access_token=1310933983360864|jS2tSUvzDUtSZcTGTAKv5yyu7eM"


exports.postToFacebook = async (message, imageUrl) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/YOUR_PAGE_ID/photos`,
      {
        url: imageUrl, // Image URL
        caption: message, // Text message
        access_token: PAGE_ACCESS_TOKEN,
      }
    );

    console.log("Post ID:", response.data.id);
  } catch (error) {
    console.error("Error posting image to Facebook:", error.response.data);
  }
};

// Example Usage
// postToFacebook(
//   "🏡 Check out this beautiful new listing!",
//   "https://example.com/house.jpg"
// );


exports.receiveComment = ((req, res) => {
  console.log("New Comment Received:", req.body);

  // Store comment in the database
  saveToDatabase(req.body);

  res.status(200).send("Received");
});



exports.replyToComment = async (commentId, message) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${commentId}/comments`,
      { message: message },
      {
        headers: { Authorization: `Bearer YOUR_PAGE_ACCESS_TOKEN` },
      }
    );

    console.log("Reply Sent:", response.data);
  } catch (error) {
    console.error("Error replying to comment:", error.response.data);
  }
};

// Example Usage
// replyToComment("1234567890", "Thanks for your inquiry! Our team will reach out shortly.");


const postToInstagram = async (imageUrl, caption) => {
    try {
      const response = await axios.post(
        "https://graph.facebook.com/v18.0/YOUR_INSTAGRAM_ACCOUNT_ID/media",
        {
          image_url: imageUrl,
          caption: caption,
          access_token: "YOUR_LONG_LIVED_ACCESS_TOKEN",
        }
      );
  
      console.log("Instagram Post ID:", response.data.id);
    } catch (error) {
      console.error("Error posting to Instagram:", error.response.data);
    }
  };
  
  // Example Usage
  //postToInstagram(
//     "https://example.com/new-house.jpg",
//     "🏡 Just Listed: Stunning 4-Bedroom Duplex in Lekki! #RealEstate #LagosHomes"
//   );
  


