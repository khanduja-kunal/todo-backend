export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'aifiueiwyayuryguioyeuigyr9ey80uwipriw',
    expiresIn: '1h',
  },
});
