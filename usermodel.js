const { DataTypes } = require('sequelize');
const sequelize = require('./config.js'); // Import the sequelize instance from index.js

const User = sequelize.define('User', {
    trackid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/i,
        },
        set(value) {
            const saltRounds = 10;
            const hashedPassword = bcrypt.hashSync(value, saltRounds); // Corrected bcrypt function call
            this.setDataValue('password', hashedPassword);
        },
        writeOnly: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    emailTimestamp: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    timestamps: true,
    createdAt: 'account_created',
    updatedAt: 'account_updated'
});

module.exports = { User };
