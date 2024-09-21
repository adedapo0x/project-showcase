const {sequelize} = require("../../config/database");
const {DataTypes} = require("sequelize");
module.exports = sequelize.define('project', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Title cannot be null'
      },
      notEmpty: {
        msg: 'Title cannot be empty'
      }
    }
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    validate: {
      isIn: {
        args: [[true, false]],
        msg: "IsFeatured value must be true or false"
      }
    }
  },
  projectImage: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Product image cannot be null'
      }
    }
  },
  shortDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'shortDescription cannot be null'
      },
      notEmpty: {
        msg : 'shortDescription cannot be empty'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Description cannot be null'
      },
      notEmpty: {
        msg: 'Description cannot be empty'
      }
    }
  },
  projectUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'ProjectURL cannot be null'
      },
      notEmpty: {
        msg: 'ProjectURL cannot be empty'
      },
      isUrl: {
        msg: 'Invalid project URL string'
      }
    }
  },
  category: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Category cannot be null'
      }
    }
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Title cannot be null'
      }
    }
  },
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'user',
      key: 'id'
    }
  },
  createdAt:{
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
}, {
  paranoid: true,
  freezeTableName: true,
  modelName: 'project'
})