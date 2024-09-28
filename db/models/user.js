const bcrypt = require('bcrypt')

'use strict';
const { Sequelize, DataTypes} = require('sequelize');
const { sequelize } = require('../../config/database')
const AppError = require('../../utils/appError')
const {flatten} = require("express/lib/utils");

const project = require('./project')

const user = sequelize.define('user', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userType: {
    type: DataTypes.ENUM('0', '1', '2'),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'userType cannot be null'
      },
      notEmpty:{
        msg: 'userType cannot be empty'
      }
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'First Name cannot be null'
      },
      notEmpty:{
        msg: 'First Name cannot be empty'
      }
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Last Name cannot be null'
      },
      notEmpty:{
        msg: 'Last Name cannot be empty'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Email cannot be null'
      },
      notEmpty:{
        msg: 'Email cannot be empty'
      },
      isEmail: {
        msg: 'Invalid email id'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'password cannot be null'
      },
      notEmpty:{
        msg: 'password cannot be empty'
      },
      len: {
        args: [7],
        msg: "Password must be at least 8 characters long"
      }
    }
  },
  confirmPassword: {
    type: DataTypes.VIRTUAL,
    set(value){
      if (value === this.password){
        const hashedPassword = bcrypt.hashSync(value,10)
        this.setDataValue('password', hashedPassword)
        } else {
        throw new AppError('Password and confirm password values must be the same', 400)
      }
    }
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  deletedAt: {
    type: DataTypes.DATE
  }
}, {
  paranoid: true,
  freezeTableName: true,
  modelName: 'user'
})

user.hasMany(project, { foreignKey: 'createdBy'})
project.belongsTo(user, { foreignKey: 'createdBy'})

module.exports = user