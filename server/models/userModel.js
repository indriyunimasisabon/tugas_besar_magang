import { Sequelize } from "sequelize";
import database from "../config/database.js";
import bcrypt from "bcrypt";

const { DataTypes } = Sequelize;
const User = database.define(
    "pt_users", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: "Invalid email format"
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    departement: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true,
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
});

User.prototype.comparePassword = function (password) {
    return bcrypt.compare(password, this.hashedPassword);
};

export default User;