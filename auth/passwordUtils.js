//./src/utils/passwordUtils.js
const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(Number("10"));
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error('Błąd podczas hashowania hasła');
    }
};

const comparePassword = async (plainPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        throw new Error('Błąd podczas porównywania haseł');
    }
};

module.exports = {
    hashPassword,
    comparePassword
};