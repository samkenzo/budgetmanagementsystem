import { OAuth2Client } from "google-auth-library";
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const auth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);
const googleAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== 'null') {
    const token = authHeader.split(" ")[1];
    const ticket = await auth2Client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (payload) req.email = payload["email"];
  }
  next();
};

export default googleAuth;