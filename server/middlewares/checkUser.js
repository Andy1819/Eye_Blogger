const validateContact = (req, res, next) => {
    const { name, email, phoneNumber } = req.body;
  
    if (!name) {
      return res.status(400).json({ message: 'First name and last name are required.' });
    }
  
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }
  
    if (phoneNumber && phoneNumber.length !== 10) {
      return res.status(400).json({ message: 'Phone number must be 10 digits long.' });
    }
  
    next();
  };
  
  module.exports = { validateContact };
  